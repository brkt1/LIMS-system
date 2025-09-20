from django.db import models
from lab.models import LabBaseModel

class LabAnalytics(LabBaseModel):
    tenant = models.CharField(max_length=100)
    date = models.DateField()
    
    # Test volume metrics
    total_tests = models.PositiveIntegerField(default=0)
    completed_tests = models.PositiveIntegerField(default=0)
    pending_tests = models.PositiveIntegerField(default=0)
    failed_tests = models.PositiveIntegerField(default=0)
    
    # Performance metrics
    avg_turnaround_time = models.DurationField(null=True, blank=True)
    success_rate = models.DecimalField(max_digits=5, decimal_places=2, default=0)
    
    # Equipment metrics
    equipment_operational = models.PositiveIntegerField(default=0)
    equipment_maintenance = models.PositiveIntegerField(default=0)
    equipment_out_of_service = models.PositiveIntegerField(default=0)
    
    class Meta:
        app_label = 'lab'
        unique_together = ['tenant', 'date']
        ordering = ['-date']
    
    def __str__(self):
        return f"Analytics for {self.tenant} on {self.date}"

class TestCategoryAnalytics(LabBaseModel):
    tenant = models.CharField(max_length=100)
    category = models.CharField(max_length=100)
    date = models.DateField()
    
    total_tests = models.PositiveIntegerField(default=0)
    success_rate = models.DecimalField(max_digits=5, decimal_places=2, default=0)
    avg_turnaround_time = models.DurationField(null=True, blank=True)
    failures = models.PositiveIntegerField(default=0)
    
    class Meta:
        app_label = 'lab'
        unique_together = ['tenant', 'category', 'date']
        ordering = ['-date']
    
    def __str__(self):
        return f"{self.category} analytics for {self.tenant} on {self.date}"

class SystemLog(LabBaseModel):
    LOG_LEVELS = [
        ('info', 'Info'),
        ('warning', 'Warning'),
        ('error', 'Error'),
        ('success', 'Success'),
    ]
    
    user = models.CharField(max_length=255)
    action = models.CharField(max_length=255)
    level = models.CharField(max_length=20, choices=LOG_LEVELS, default='info')
    ip_address = models.GenericIPAddressField(null=True, blank=True)
    details = models.TextField(blank=True, null=True)
    tenant = models.CharField(max_length=100, null=True, blank=True)
    
    class Meta:
        app_label = 'lab'
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.level.upper()}: {self.action} by {self.user}"
