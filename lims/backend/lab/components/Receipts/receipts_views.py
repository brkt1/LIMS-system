import time
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import filters
from .receipts_models import Receipt, BillingTransaction
from .receipts_serializers import ReceiptSerializer, ReceiptListSerializer, BillingTransactionSerializer

class ReceiptViewSet(viewsets.ModelViewSet):
    queryset = Receipt.objects.all().order_by('-created_at')
    serializer_class = ReceiptSerializer
    permission_classes = [AllowAny]  # Temporarily allow unauthenticated access for testing
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['status', 'payment_method', 'tenant', 'doctor']
    search_fields = ['patient_name', 'patient_id', 'id']
    ordering_fields = ['created_at', 'amount', 'generated_date']
    ordering = ['-created_at']
    
    def get_serializer_class(self):
        if self.action == 'list':
            return ReceiptListSerializer
        return ReceiptSerializer
    
    def create(self, request, *args, **kwargs):
        data = request.data.copy()
        
        # Generate unique ID if missing
        if not data.get('id'):
            data['id'] = f"RCP{int(time.time() * 1000)}"
        
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
    def print_receipt(self, request, pk=None):
        receipt = self.get_object()
        receipt.print_count += 1
        receipt.status = 'printed'
        receipt.save()
        return Response({'status': 'Receipt printed successfully', 'print_count': receipt.print_count})
    
    @action(detail=True, methods=['post'])
    def generate_receipt(self, request, pk=None):
        receipt = self.get_object()
        receipt.status = 'generated'
        receipt.save()
        return Response({'status': 'Receipt generated successfully'})

class BillingTransactionViewSet(viewsets.ModelViewSet):
    queryset = BillingTransaction.objects.all().order_by('-processed_at')
    serializer_class = BillingTransactionSerializer
    permission_classes = [AllowAny]  # Temporarily allow unauthenticated access for testing
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['transaction_type', 'receipt', 'tenant']
    search_fields = ['description', 'reference_number']
    ordering_fields = ['processed_at', 'amount']
    ordering = ['-processed_at']
    
    def create(self, request, *args, **kwargs):
        data = request.data.copy()
        
        # Generate unique ID if missing
        if not data.get('id'):
            data['id'] = f"TXN{int(time.time() * 1000)}"
        
        # Set default values
        if not data.get('tenant'):
            data['tenant'] = 1  # Default tenant
        
        if not data.get('processed_by'):
            data['processed_by'] = 1  # Default user
        
        serializer = self.get_serializer(data=data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)
