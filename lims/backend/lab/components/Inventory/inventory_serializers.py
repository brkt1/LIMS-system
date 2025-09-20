from rest_framework import serializers
from .inventory_models import InventoryCategory, Supplier, InventoryItem, InventoryTransaction, ReorderRequest

class InventoryCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = InventoryCategory
        fields = ['id', 'name', 'description', 'created_at', 'updated_at']

class SupplierSerializer(serializers.ModelSerializer):
    class Meta:
        model = Supplier
        fields = ['id', 'name', 'contact_person', 'email', 'phone', 'address', 'is_active', 'created_at', 'updated_at']

class InventoryItemSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(source='category.name', read_only=True)
    supplier_name = serializers.CharField(source='supplier.name', read_only=True)
    
    class Meta:
        model = InventoryItem
        fields = ['id', 'name', 'description', 'category', 'category_name', 'quantity', 'threshold', 
                 'status', 'approval_status', 'location', 'supplier', 'supplier_name', 
                 'unit_price', 'tenant', 'created_at', 'updated_at']

class InventoryItemListSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(source='category.name', read_only=True)
    supplier_name = serializers.CharField(source='supplier.name', read_only=True)
    
    class Meta:
        model = InventoryItem
        fields = ['id', 'name', 'category_name', 'quantity', 'threshold', 'status', 
                 'approval_status', 'location', 'supplier_name', 'created_at']

class InventoryTransactionSerializer(serializers.ModelSerializer):
    item_name = serializers.CharField(source='item.name', read_only=True)
    
    class Meta:
        model = InventoryTransaction
        fields = ['id', 'item', 'item_name', 'transaction_type', 'quantity', 
                 'reference_number', 'notes', 'performed_by', 'created_at']

class ReorderRequestSerializer(serializers.ModelSerializer):
    item_name = serializers.CharField(source='item.name', read_only=True)
    item_category = serializers.CharField(source='item.category.name', read_only=True)
    
    class Meta:
        model = ReorderRequest
        fields = ['id', 'item', 'item_name', 'item_category', 'requested_quantity', 
                 'status', 'requested_by', 'approved_by', 'notes', 'tenant', 'created_at', 'updated_at']

class ReorderRequestListSerializer(serializers.ModelSerializer):
    item_name = serializers.CharField(source='item.name', read_only=True)
    item_category = serializers.CharField(source='item.category.name', read_only=True)
    current_quantity = serializers.IntegerField(source='item.quantity', read_only=True)
    
    class Meta:
        model = ReorderRequest
        fields = ['id', 'item_name', 'item_category', 'requested_quantity', 'current_quantity', 
                 'status', 'requested_by', 'created_at']
