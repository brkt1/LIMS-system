import time
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import filters
from .branch_models import Branch, BranchStaff
from .branch_serializers import (
    BranchSerializer, BranchListSerializer,
    BranchStaffSerializer, BranchStaffListSerializer
)

class BranchViewSet(viewsets.ModelViewSet):
    queryset = Branch.objects.all().order_by('name')
    serializer_class = BranchSerializer
    permission_classes = [AllowAny]  # Temporarily allow unauthenticated access for testing
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['status', 'city', 'state', 'tenant']
    search_fields = ['name', 'city', 'state', 'manager']
    ordering_fields = ['name', 'established_date', 'total_staff', 'total_patients']
    ordering = ['name']
    
    def get_serializer_class(self):
        if self.action == 'list':
            return BranchListSerializer
        return BranchSerializer
    
    def create(self, request, *args, **kwargs):
        data = request.data.copy()
        
        # Generate unique ID if missing
        if not data.get('id'):
            data['id'] = f"BR{int(time.time() * 1000)}"
        
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
    
    @action(detail=True, methods=['post'])
    def activate(self, request, pk=None):
        branch = self.get_object()
        branch.status = 'active'
        branch.save()
        return Response({'status': 'Branch activated successfully'})
    
    @action(detail=True, methods=['post'])
    def deactivate(self, request, pk=None):
        branch = self.get_object()
        branch.status = 'inactive'
        branch.save()
        return Response({'status': 'Branch deactivated successfully'})

class BranchStaffViewSet(viewsets.ModelViewSet):
    queryset = BranchStaff.objects.all().order_by('name')
    serializer_class = BranchStaffSerializer
    permission_classes = [AllowAny]  # Temporarily allow unauthenticated access for testing
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['role', 'is_active', 'branch', 'tenant']
    search_fields = ['name', 'email', 'phone']
    ordering_fields = ['name', 'hire_date', 'role']
    ordering = ['name']
    
    def get_serializer_class(self):
        if self.action == 'list':
            return BranchStaffListSerializer
        return BranchStaffSerializer
    
    def create(self, request, *args, **kwargs):
        data = request.data.copy()
        
        # Generate unique ID if missing
        if not data.get('id'):
            data['id'] = f"BS{int(time.time() * 1000)}"
        
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
    
    @action(detail=True, methods=['post'])
    def activate(self, request, pk=None):
        staff = self.get_object()
        staff.is_active = True
        staff.save()
        return Response({'status': 'Staff member activated successfully'})
    
    @action(detail=True, methods=['post'])
    def deactivate(self, request, pk=None):
        staff = self.get_object()
        staff.is_active = False
        staff.save()
        return Response({'status': 'Staff member deactivated successfully'})
