from django.db import models
from django.conf import settings
from lab.components.superadmin.models import Tenant

class Contract(models.Model):
    STATUS_CHOICES = [
        ('draft', 'Draft'),
        ('active', 'Active'),
        ('expired', 'Expired'),
        ('terminated', 'Terminated'),
        ('renewed', 'Renewed'),
        ('cancelled', 'Cancelled'),
    ]
    
    TYPE_CHOICES = [
        ('service', 'Service Contract'),
        ('supply', 'Supply Contract'),
        ('maintenance', 'Maintenance Contract'),
        ('consulting', 'Consulting Contract'),
        ('lease', 'Lease Contract'),
        ('employment', 'Employment Contract'),
    ]
    
    CURRENCY_CHOICES = [
        ('USD', 'US Dollar'),
        ('EUR', 'Euro'),
        ('GBP', 'British Pound'),
        ('CAD', 'Canadian Dollar'),
        ('AUD', 'Australian Dollar'),
    ]
    
    id = models.CharField(primary_key=True, max_length=50)
    title = models.CharField(max_length=255)
    type = models.CharField(max_length=20, choices=TYPE_CHOICES)
    vendor = models.CharField(max_length=255)
    vendor_contact = models.CharField(max_length=255)
    vendor_email = models.EmailField()
    vendor_phone = models.CharField(max_length=20)
    start_date = models.DateField()
    end_date = models.DateField()
    value = models.DecimalField(max_digits=15, decimal_places=2)
    currency = models.CharField(max_length=3, choices=CURRENCY_CHOICES, default='USD')
    terms = models.TextField()
    description = models.TextField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='draft')
    renewal_date = models.DateField(null=True, blank=True)
    auto_renewal = models.BooleanField(default=False)
    notes = models.TextField(blank=True, null=True)
    contract_file = models.FileField(upload_to='contracts/', null=True, blank=True)
    tenant = models.ForeignKey(Tenant, on_delete=models.CASCADE, related_name='contracts')
    created_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.title} - {self.vendor}"

class ContractRenewal(models.Model):
    id = models.CharField(primary_key=True, max_length=50)
    contract = models.ForeignKey(Contract, on_delete=models.CASCADE, related_name='renewals')
    renewal_date = models.DateField()
    new_end_date = models.DateField()
    new_value = models.DecimalField(max_digits=15, decimal_places=2, null=True, blank=True)
    notes = models.TextField(blank=True, null=True)
    approved_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    approved_at = models.DateTimeField(auto_now_add=True)
    tenant = models.ForeignKey(Tenant, on_delete=models.CASCADE, related_name='contract_renewals')
    
    class Meta:
        ordering = ['-approved_at']
    
    def __str__(self):
        return f"Renewal for {self.contract.title}"
