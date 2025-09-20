from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()
from lab.models import LabBaseModel

class Notification(LabBaseModel):
    NOTIFICATION_TYPES = [
        ('info', 'Information'),
        ('warning', 'Warning'),
        ('error', 'Error'),
        ('success', 'Success'),
        ('urgent', 'Urgent'),
    ]
    
    PRIORITY_CHOICES = [
        ('low', 'Low'),
        ('medium', 'Medium'),
        ('high', 'High'),
        ('critical', 'Critical'),
    ]
    
    title = models.CharField(max_length=255)
    message = models.TextField()
    notification_type = models.CharField(max_length=20, choices=NOTIFICATION_TYPES, default='info')
    priority = models.CharField(max_length=20, choices=PRIORITY_CHOICES, default='medium')
    is_read = models.BooleanField(default=False)
    is_global = models.BooleanField(default=False)
    recipient = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True, related_name='notifications')
    tenant = models.CharField(max_length=100, null=True, blank=True)
    action_url = models.URLField(blank=True, null=True)
    expires_at = models.DateTimeField(null=True, blank=True)
    
    class Meta:
        app_label = 'lab'
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.title} - {self.notification_type}"

class NotificationPreference(LabBaseModel):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='notification_preferences')
    email_enabled = models.BooleanField(default=True)
    push_enabled = models.BooleanField(default=True)
    sms_enabled = models.BooleanField(default=False)
    notification_types = models.JSONField(default=list)  # List of notification types to receive
    
    class Meta:
        app_label = 'lab'
    
    def __str__(self):
        return f"Preferences for {self.user.username}"
