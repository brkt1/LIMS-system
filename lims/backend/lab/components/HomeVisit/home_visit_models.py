from django.db import models
from django.conf import settings
from lab.components.superadmin.models import Tenant

class HomeVisitRequest(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('approved', 'Approved'),
        ('scheduled', 'Scheduled'),
        ('in_progress', 'In Progress'),
        ('completed', 'Completed'),
        ('cancelled', 'Cancelled'),
        ('rejected', 'Rejected'),
    ]
    
    PRIORITY_CHOICES = [
        ('low', 'Low'),
        ('normal', 'Normal'),
        ('high', 'High'),
        ('urgent', 'Urgent'),
    ]
    
    SERVICE_TYPE_CHOICES = [
        ('consultation', 'Consultation'),
        ('checkup', 'Checkup'),
        ('sample_collection', 'Sample Collection'),
        ('injection', 'Injection'),
        ('emergency', 'Emergency'),
        ('follow_up', 'Follow Up'),
    ]
    
    id = models.CharField(primary_key=True, max_length=50)
    patient_name = models.CharField(max_length=255)
    patient_id = models.CharField(max_length=50)
    address = models.TextField()
    phone = models.CharField(max_length=20)
    requested_date = models.DateField()
    requested_time = models.TimeField()
    service_type = models.CharField(max_length=30, choices=SERVICE_TYPE_CHOICES)
    doctor = models.CharField(max_length=255)
    notes = models.TextField(blank=True, null=True)
    priority = models.CharField(max_length=10, choices=PRIORITY_CHOICES, default='normal')
    estimated_duration = models.CharField(max_length=50, blank=True, null=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    approved_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True, related_name='approved_visits')
    approved_at = models.DateTimeField(null=True, blank=True)
    scheduled_date = models.DateField(null=True, blank=True)
    scheduled_time = models.TimeField(null=True, blank=True)
    completed_at = models.DateTimeField(null=True, blank=True)
    tenant = models.ForeignKey(Tenant, on_delete=models.CASCADE, related_name='home_visit_requests')
    created_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True, related_name='created_visits')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return f"Home Visit {self.id} - {self.patient_name}"

class HomeVisitSchedule(models.Model):
    STATUS_CHOICES = [
        ('scheduled', 'Scheduled'),
        ('in_progress', 'In Progress'),
        ('completed', 'Completed'),
        ('cancelled', 'Cancelled'),
        ('no_show', 'No Show'),
    ]
    
    id = models.CharField(primary_key=True, max_length=50)
    visit_request = models.ForeignKey(HomeVisitRequest, on_delete=models.CASCADE, related_name='schedules')
    doctor = models.CharField(max_length=255)
    scheduled_date = models.DateField()
    scheduled_time = models.TimeField()
    estimated_duration = models.CharField(max_length=50)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='scheduled')
    notes = models.TextField(blank=True, null=True)
    started_at = models.DateTimeField(null=True, blank=True)
    completed_at = models.DateTimeField(null=True, blank=True)
    tenant = models.ForeignKey(Tenant, on_delete=models.CASCADE, related_name='home_visit_schedules')
    created_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['scheduled_date', 'scheduled_time']
    
    def __str__(self):
        return f"Schedule {self.id} - {self.visit_request.patient_name}"
