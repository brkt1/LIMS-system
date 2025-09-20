from django.db import models
from lab.models import LabBaseModel

class Equipment(LabBaseModel):
    STATUS_CHOICES = [
        ('operational', 'Operational'),
        ('maintenance', 'Maintenance'),
        ('out-of-service', 'Out of Service'),
    ]
    
    PRIORITY_CHOICES = [
        ('low', 'Low'),
        ('medium', 'Medium'),
        ('high', 'High'),
    ]
    
    name = models.CharField(max_length=255)
    model = models.CharField(max_length=255)
    serial_number = models.CharField(max_length=255, unique=True)
    department = models.CharField(max_length=100)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='operational')
    priority = models.CharField(max_length=20, choices=PRIORITY_CHOICES, default='low')
    location = models.CharField(max_length=255, blank=True, null=True)
    supplier = models.CharField(max_length=255, blank=True, null=True)
    notes = models.TextField(blank=True, null=True)
    tenant = models.CharField(max_length=100, null=True, blank=True)
    
    class Meta:
        app_label = 'lab'
        ordering = ['name']
    
    def __str__(self):
        return f"{self.name} ({self.model})"

class EquipmentCalibration(LabBaseModel):
    equipment = models.ForeignKey(Equipment, on_delete=models.CASCADE, related_name='calibrations')
    calibration_date = models.DateField()
    next_calibration_date = models.DateField()
    calibrated_by = models.CharField(max_length=255)
    notes = models.TextField(blank=True, null=True)
    certificate_number = models.CharField(max_length=255, blank=True, null=True)
    
    class Meta:
        app_label = 'lab'
        ordering = ['-calibration_date']
    
    def __str__(self):
        return f"Calibration for {self.equipment.name} on {self.calibration_date}"

class EquipmentMaintenance(LabBaseModel):
    equipment = models.ForeignKey(Equipment, on_delete=models.CASCADE, related_name='maintenance_records')
    maintenance_date = models.DateField()
    maintenance_type = models.CharField(max_length=100)  # Preventive, Corrective, Emergency
    performed_by = models.CharField(max_length=255)
    description = models.TextField()
    parts_replaced = models.TextField(blank=True, null=True)
    cost = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    next_maintenance_due = models.DateField(null=True, blank=True)
    
    class Meta:
        app_label = 'lab'
        ordering = ['-maintenance_date']
    
    def __str__(self):
        return f"Maintenance for {self.equipment.name} on {self.maintenance_date}"
