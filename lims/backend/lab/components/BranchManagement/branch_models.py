from django.db import models
from django.conf import settings
from lab.components.superadmin.models import Tenant

class Branch(models.Model):
    STATUS_CHOICES = [
        ('active', 'Active'),
        ('inactive', 'Inactive'),
        ('maintenance', 'Maintenance'),
        ('closed', 'Closed'),
    ]
    
    id = models.CharField(primary_key=True, max_length=50)
    name = models.CharField(max_length=255)
    address = models.TextField()
    phone = models.CharField(max_length=20)
    email = models.EmailField()
    city = models.CharField(max_length=100)
    state = models.CharField(max_length=100)
    zip_code = models.CharField(max_length=20)
    manager = models.CharField(max_length=255)
    established_date = models.DateField()
    total_staff = models.PositiveIntegerField(default=0)
    total_patients = models.PositiveIntegerField(default=0)
    services = models.JSONField(default=list)  # List of services offered
    operating_hours = models.JSONField(default=dict)  # Operating hours for each day
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='active')
    notes = models.TextField(blank=True, null=True)
    tenant = models.ForeignKey(Tenant, on_delete=models.CASCADE, related_name='branches')
    created_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['name']
    
    def __str__(self):
        return f"{self.name} - {self.city}"

class BranchStaff(models.Model):
    ROLE_CHOICES = [
        ('manager', 'Manager'),
        ('doctor', 'Doctor'),
        ('technician', 'Technician'),
        ('nurse', 'Nurse'),
        ('receptionist', 'Receptionist'),
        ('admin', 'Administrator'),
    ]
    
    id = models.CharField(primary_key=True, max_length=50)
    branch = models.ForeignKey(Branch, on_delete=models.CASCADE, related_name='staff')
    name = models.CharField(max_length=255)
    email = models.EmailField()
    phone = models.CharField(max_length=20)
    role = models.CharField(max_length=20, choices=ROLE_CHOICES)
    hire_date = models.DateField()
    salary = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    is_active = models.BooleanField(default=True)
    notes = models.TextField(blank=True, null=True)
    tenant = models.ForeignKey(Tenant, on_delete=models.CASCADE, related_name='branch_staff')
    created_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['name']
    
    def __str__(self):
        return f"{self.name} - {self.role} at {self.branch.name}"
