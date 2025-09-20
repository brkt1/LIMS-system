from django.db import models
from lab.models import LabBaseModel

class InventoryCategory(LabBaseModel):
    name = models.CharField(max_length=100, unique=True)
    description = models.TextField(blank=True, null=True)
    
    class Meta:
        app_label = 'lab'
        verbose_name_plural = 'Inventory Categories'
    
    def __str__(self):
        return self.name

class Supplier(LabBaseModel):
    name = models.CharField(max_length=255)
    contact_person = models.CharField(max_length=255, blank=True, null=True)
    email = models.EmailField(blank=True, null=True)
    phone = models.CharField(max_length=20, blank=True, null=True)
    address = models.TextField(blank=True, null=True)
    is_active = models.BooleanField(default=True)
    
    class Meta:
        app_label = 'lab'
    
    def __str__(self):
        return self.name

class InventoryItem(LabBaseModel):
    STATUS_CHOICES = [
        ('in-stock', 'In Stock'),
        ('low-stock', 'Low Stock'),
        ('out-of-stock', 'Out of Stock'),
    ]
    
    APPROVAL_STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('approved', 'Approved'),
        ('rejected', 'Rejected'),
    ]
    
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)
    category = models.ForeignKey(InventoryCategory, on_delete=models.CASCADE, related_name='items')
    quantity = models.PositiveIntegerField(default=0)
    threshold = models.PositiveIntegerField(default=1)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='in-stock')
    approval_status = models.CharField(max_length=20, choices=APPROVAL_STATUS_CHOICES, default='pending')
    location = models.CharField(max_length=255, blank=True, null=True)
    supplier = models.ForeignKey(Supplier, on_delete=models.SET_NULL, null=True, blank=True, related_name='items')
    unit_price = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    tenant = models.CharField(max_length=100, null=True, blank=True)
    
    class Meta:
        app_label = 'lab'
        ordering = ['name']
    
    def __str__(self):
        return f"{self.name} ({self.quantity} units)"
    
    def save(self, *args, **kwargs):
        # Update status based on quantity and threshold
        if self.quantity <= 0:
            self.status = 'out-of-stock'
        elif self.quantity <= self.threshold:
            self.status = 'low-stock'
        else:
            self.status = 'in-stock'
        super().save(*args, **kwargs)

class InventoryTransaction(LabBaseModel):
    TRANSACTION_TYPES = [
        ('in', 'Stock In'),
        ('out', 'Stock Out'),
        ('adjustment', 'Adjustment'),
        ('transfer', 'Transfer'),
    ]
    
    item = models.ForeignKey(InventoryItem, on_delete=models.CASCADE, related_name='transactions')
    transaction_type = models.CharField(max_length=20, choices=TRANSACTION_TYPES)
    quantity = models.IntegerField()  # Positive for in, negative for out
    reference_number = models.CharField(max_length=100, blank=True, null=True)
    notes = models.TextField(blank=True, null=True)
    performed_by = models.CharField(max_length=255)
    
    class Meta:
        app_label = 'lab'
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.transaction_type} - {self.item.name} ({self.quantity})"

class ReorderRequest(LabBaseModel):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('approved', 'Approved'),
        ('rejected', 'Rejected'),
        ('ordered', 'Ordered'),
        ('received', 'Received'),
    ]
    
    item = models.ForeignKey(InventoryItem, on_delete=models.CASCADE, related_name='reorder_requests')
    requested_quantity = models.PositiveIntegerField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    requested_by = models.CharField(max_length=255)
    approved_by = models.CharField(max_length=255, blank=True, null=True)
    notes = models.TextField(blank=True, null=True)
    tenant = models.CharField(max_length=100, null=True, blank=True)
    
    class Meta:
        app_label = 'lab'
        ordering = ['-created_at']
    
    def __str__(self):
        return f"Reorder: {self.item.name} ({self.requested_quantity})"
