from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import filters
from .inventory_models import InventoryCategory, Supplier, InventoryItem, InventoryTransaction, ReorderRequest
from .inventory_serializers import (
    InventoryCategorySerializer, SupplierSerializer, InventoryItemSerializer, 
    InventoryItemListSerializer, InventoryTransactionSerializer, 
    ReorderRequestSerializer, ReorderRequestListSerializer
)

class InventoryCategoryViewSet(viewsets.ModelViewSet):
    queryset = InventoryCategory.objects.all()
    serializer_class = InventoryCategorySerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    search_fields = ['name', 'description']

class SupplierViewSet(viewsets.ModelViewSet):
    queryset = Supplier.objects.all()
    serializer_class = SupplierSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    search_fields = ['name', 'contact_person', 'email']
    filterset_fields = ['is_active']

class InventoryItemViewSet(viewsets.ModelViewSet):
    queryset = InventoryItem.objects.all()
    serializer_class = InventoryItemSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['status', 'approval_status', 'category', 'supplier', 'tenant']
    search_fields = ['name', 'description', 'location']
    ordering_fields = ['name', 'quantity', 'created_at']
    ordering = ['name']
    
    def get_serializer_class(self):
        if self.action == 'list':
            return InventoryItemListSerializer
        return InventoryItemSerializer
    
    @action(detail=True, methods=['post'])
    def approve(self, request, pk=None):
        item = self.get_object()
        item.approval_status = 'approved'
        item.save()
        return Response({'status': 'Item approved successfully'})
    
    @action(detail=True, methods=['post'])
    def reject(self, request, pk=None):
        item = self.get_object()
        item.approval_status = 'rejected'
        item.save()
        return Response({'status': 'Item rejected successfully'})
    
    @action(detail=True, methods=['post'])
    def adjust_quantity(self, request, pk=None):
        item = self.get_object()
        adjustment = request.data.get('quantity', 0)
        transaction_type = request.data.get('transaction_type', 'adjustment')
        notes = request.data.get('notes', '')
        
        # Create transaction record
        InventoryTransaction.objects.create(
            item=item,
            transaction_type=transaction_type,
            quantity=adjustment,
            notes=notes,
            performed_by=request.user.username if hasattr(request, 'user') else 'System'
        )
        
        # Update item quantity
        item.quantity += adjustment
        item.save()
        
        return Response({'status': 'Quantity adjusted successfully'})

class InventoryTransactionViewSet(viewsets.ModelViewSet):
    queryset = InventoryTransaction.objects.all()
    serializer_class = InventoryTransactionSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['item', 'transaction_type', 'performed_by']

class ReorderRequestViewSet(viewsets.ModelViewSet):
    queryset = ReorderRequest.objects.all()
    serializer_class = ReorderRequestSerializer
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    filterset_fields = ['status', 'item', 'requested_by', 'tenant']
    ordering_fields = ['created_at', 'status']
    ordering = ['-created_at']
    
    def get_serializer_class(self):
        if self.action == 'list':
            return ReorderRequestListSerializer
        return ReorderRequestSerializer
    
    @action(detail=True, methods=['post'])
    def approve(self, request, pk=None):
        reorder = self.get_object()
        reorder.status = 'approved'
        reorder.approved_by = request.user.username if hasattr(request, 'user') else 'System'
        reorder.save()
        return Response({'status': 'Reorder request approved successfully'})
    
    @action(detail=True, methods=['post'])
    def reject(self, request, pk=None):
        reorder = self.get_object()
        reorder.status = 'rejected'
        reorder.approved_by = request.user.username if hasattr(request, 'user') else 'System'
        reorder.save()
        return Response({'status': 'Reorder request rejected successfully'})
    
    @action(detail=True, methods=['post'])
    def mark_ordered(self, request, pk=None):
        reorder = self.get_object()
        reorder.status = 'ordered'
        reorder.save()
        return Response({'status': 'Reorder request marked as ordered'})
    
    @action(detail=True, methods=['post'])
    def mark_received(self, request, pk=None):
        reorder = self.get_object()
        reorder.status = 'received'
        
        # Update inventory quantity
        item = reorder.item
        item.quantity += reorder.requested_quantity
        item.save()
        
        # Create transaction record
        InventoryTransaction.objects.create(
            item=item,
            transaction_type='in',
            quantity=reorder.requested_quantity,
            reference_number=f"REORDER-{reorder.id}",
            notes=f"Received from reorder request #{reorder.id}",
            performed_by=request.user.username if hasattr(request, 'user') else 'System'
        )
        
        reorder.save()
        return Response({'status': 'Reorder request marked as received and inventory updated'})
