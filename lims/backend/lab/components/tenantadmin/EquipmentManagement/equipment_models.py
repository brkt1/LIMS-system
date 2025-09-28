from django.db import models
from lab.components.superadmin.models import Tenant

EQUIPMENT_TYPE_CHOICES = [
    ('laboratory', 'Laboratory'),
    ('imaging', 'Imaging'),
    ('sterilization', 'Sterilization'),
    ('monitoring', 'Monitoring'),
    ('surgical', 'Surgical'),
    ('diagnostic', 'Diagnostic'),
]

EQUIPMENT_STATUS_CHOICES = [
    ('operational', 'Operational'),
    ('maintenance', 'Maintenance'),
    ('out_of_service', 'Out of Service'),
    ('retired', 'Retired'),
]

EQUIPMENT_CONDITION_CHOICES = [
    ('excellent', 'Excellent'),
    ('good', 'Good'),
    ('fair', 'Fair'),
    ('poor', 'Poor'),
    ('needs_repair', 'Needs Repair'),
]

class Equipment(models.Model):
    id = models.CharField(primary_key=True, max_length=50)
    name = models.CharField(max_length=255)
    type = models.CharField(max_length=50, choices=EQUIPMENT_TYPE_CHOICES)
    category = models.CharField(max_length=100)
    serial_number = models.CharField(max_length=100, unique=True)
    manufacturer = models.CharField(max_length=100)
    model = models.CharField(max_length=100)
    status = models.CharField(max_length=20, choices=EQUIPMENT_STATUS_CHOICES, default='operational')
    location = models.CharField(max_length=255)
    purchase_date = models.DateField()
    warranty_expiry = models.DateField(null=True, blank=True)
    last_maintenance = models.DateField(null=True, blank=True)
    next_maintenance = models.DateField(null=True, blank=True)
    maintenance_interval = models.CharField(max_length=50, null=True, blank=True)
    responsible = models.CharField(max_length=255, null=True, blank=True)
    cost = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    condition = models.CharField(max_length=20, choices=EQUIPMENT_CONDITION_CHOICES, default='good')
    tenant = models.ForeignKey(Tenant, to_field="id", on_delete=models.CASCADE, related_name="equipment")
    created_by = models.EmailField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['name']
        unique_together = ['serial_number', 'tenant']

    def __str__(self):
        return f"{self.name} ({self.serial_number})"
