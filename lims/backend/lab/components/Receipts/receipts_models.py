from django.db import models
from django.conf import settings
from lab.components.superadmin.models import Tenant

class Receipt(models.Model):
    STATUS_CHOICES = [
        ('draft', 'Draft'),
        ('generated', 'Generated'),
        ('printed', 'Printed'),
        ('cancelled', 'Cancelled'),
    ]
    
    PAYMENT_METHOD_CHOICES = [
        ('cash', 'Cash'),
        ('card', 'Card'),
        ('insurance', 'Insurance'),
        ('check', 'Check'),
        ('bank_transfer', 'Bank Transfer'),
    ]
    
    id = models.CharField(primary_key=True, max_length=50)
    patient_name = models.CharField(max_length=255)
    patient_id = models.CharField(max_length=50)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='draft')
    generated_date = models.DateField(auto_now_add=True)
    generated_time = models.TimeField(auto_now_add=True)
    services = models.JSONField(default=list)  # List of services
    doctor = models.CharField(max_length=255)
    payment_method = models.CharField(max_length=20, choices=PAYMENT_METHOD_CHOICES, default='cash')
    print_count = models.PositiveIntegerField(default=0)
    notes = models.TextField(blank=True, null=True)
    tenant = models.ForeignKey(Tenant, on_delete=models.CASCADE, related_name='receipts')
    created_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return f"Receipt {self.id} - {self.patient_name}"

class BillingTransaction(models.Model):
    TRANSACTION_TYPE_CHOICES = [
        ('payment', 'Payment'),
        ('refund', 'Refund'),
        ('adjustment', 'Adjustment'),
        ('discount', 'Discount'),
    ]
    
    id = models.CharField(primary_key=True, max_length=50)
    receipt = models.ForeignKey(Receipt, on_delete=models.CASCADE, related_name='transactions')
    transaction_type = models.CharField(max_length=20, choices=TRANSACTION_TYPE_CHOICES)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    description = models.TextField()
    reference_number = models.CharField(max_length=100, blank=True, null=True)
    processed_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    processed_at = models.DateTimeField(auto_now_add=True)
    tenant = models.ForeignKey(Tenant, on_delete=models.CASCADE, related_name='billing_transactions')
    
    class Meta:
        ordering = ['-processed_at']
    
    def __str__(self):
        return f"Transaction {self.id} - {self.transaction_type}"
