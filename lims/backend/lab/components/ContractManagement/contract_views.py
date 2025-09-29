import time
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import filters
from .contract_models import Contract, ContractRenewal
from .contract_serializers import (
    ContractSerializer, ContractListSerializer,
    ContractRenewalSerializer, ContractRenewalListSerializer
)

class ContractViewSet(viewsets.ModelViewSet):
    queryset = Contract.objects.all().order_by('-created_at')
    serializer_class = ContractSerializer
    permission_classes = [AllowAny]  # Temporarily allow unauthenticated access for testing
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['status', 'type', 'vendor', 'tenant']
    search_fields = ['title', 'vendor', 'vendor_contact']
    ordering_fields = ['created_at', 'start_date', 'end_date', 'value']
    ordering = ['-created_at']
    
    def get_serializer_class(self):
        if self.action == 'list':
            return ContractListSerializer
        return ContractSerializer
    
    def create(self, request, *args, **kwargs):
        data = request.data.copy()
        
        # Generate unique ID if missing or empty
        if not data.get('id') or data.get('id') == '':
            data['id'] = f"CT{int(time.time() * 1000)}"
        
        # Set default values
        if not data.get('tenant'):
            data['tenant'] = 1  # Default tenant
        
        if not data.get('created_by'):
            data['created_by'] = 1  # Default user
        
        serializer = self.get_serializer(data=data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)
    
    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        data = request.data.copy()
        
        # For updates, don't allow changing the ID, tenant, or created_by
        # These should remain the same as the original instance
        data['id'] = instance.id
        data['tenant'] = instance.tenant_id
        data['created_by'] = instance.created_by_id
        
        serializer = self.get_serializer(instance, data=data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        
        if getattr(instance, '_prefetched_objects_cache', None):
            instance._prefetched_objects_cache = {}
        
        return Response(serializer.data)
    
    @action(detail=True, methods=['post'])
    def activate(self, request, pk=None):
        contract = self.get_object()
        contract.status = 'active'
        contract.save()
        return Response({'status': 'Contract activated successfully'})
    
    @action(detail=True, methods=['post'])
    def terminate(self, request, pk=None):
        contract = self.get_object()
        contract.status = 'terminated'
        contract.save()
        return Response({'status': 'Contract terminated successfully'})
    
    @action(detail=True, methods=['post'])
    def renew(self, request, pk=None):
        contract = self.get_object()
        new_end_date = request.data.get('new_end_date')
        new_value = request.data.get('new_value')
        
        if new_end_date:
            # Create renewal record
            renewal_data = {
                'id': f"CR{int(time.time() * 1000)}",
                'contract': contract.id,
                'renewal_date': time.strftime('%Y-%m-%d'),
                'new_end_date': new_end_date,
                'new_value': new_value,
                'approved_by': 1,  # Default user
                'tenant': 1,  # Default tenant
            }
            
            renewal = ContractRenewal.objects.create(**renewal_data)
            
            # Update contract
            contract.end_date = new_end_date
            if new_value:
                contract.value = new_value
            contract.status = 'renewed'
            contract.save()
            
            return Response({'status': 'Contract renewed successfully'})
        return Response({'error': 'New end date is required'}, status=status.HTTP_400_BAD_REQUEST)

class ContractRenewalViewSet(viewsets.ModelViewSet):
    queryset = ContractRenewal.objects.all().order_by('-approved_at')
    serializer_class = ContractRenewalSerializer
    permission_classes = [AllowAny]  # Temporarily allow unauthenticated access for testing
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['contract', 'tenant']
    search_fields = ['contract__title', 'contract__vendor']
    ordering_fields = ['approved_at', 'renewal_date', 'new_end_date']
    ordering = ['-approved_at']
    
    def get_serializer_class(self):
        if self.action == 'list':
            return ContractRenewalListSerializer
        return ContractRenewalSerializer
    
    def create(self, request, *args, **kwargs):
        data = request.data.copy()
        
        # Generate unique ID if missing
        if not data.get('id'):
            data['id'] = f"CR{int(time.time() * 1000)}"
        
        # Set default values
        if not data.get('tenant'):
            data['tenant'] = 1  # Default tenant
        
        if not data.get('approved_by'):
            data['approved_by'] = 1  # Default user
        
        serializer = self.get_serializer(data=data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)
