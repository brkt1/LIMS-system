from django.db import models
from lab.components.superadmin.models import Tenant

BRANCH_STATUS_CHOICES = [
    ('active', 'Active'),
    ('inactive', 'Inactive'),
    ('maintenance', 'Maintenance'),
    ('closed', 'Closed'),
]

class Branch(models.Model):
    id = models.CharField(primary_key=True, max_length=50)
    name = models.CharField(max_length=255)
    address = models.TextField()
    city = models.CharField(max_length=100)
    state = models.CharField(max_length=100)
    postal_code = models.CharField(max_length=20)
    country = models.CharField(max_length=100, default='United States')
    phone = models.CharField(max_length=20)
    email = models.EmailField()
    manager_name = models.CharField(max_length=255)
    manager_email = models.EmailField()
    manager_phone = models.CharField(max_length=20)
    opening_hours = models.CharField(max_length=255, null=True, blank=True)
    services = models.TextField(null=True, blank=True)
    capacity = models.IntegerField(null=True, blank=True)
    status = models.CharField(max_length=20, choices=BRANCH_STATUS_CHOICES, default='active')
    established_date = models.DateField()
    tenant = models.ForeignKey(Tenant, to_field="id", on_delete=models.CASCADE, related_name="branches")
    created_by = models.EmailField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['name']
        unique_together = ['name', 'tenant']

    def __str__(self):
        return f"{self.name} ({self.city})"
