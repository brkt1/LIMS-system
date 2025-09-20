from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()
from lab.models import LabBaseModel

class SupportTicket(LabBaseModel):
    PRIORITY_CHOICES = [
        ('low', 'Low'),
        ('medium', 'Medium'),
        ('high', 'High'),
        ('critical', 'Critical'),
    ]
    
    STATUS_CHOICES = [
        ('open', 'Open'),
        ('pending', 'Pending'),
        ('resolved', 'Resolved'),
        ('closed', 'Closed'),
    ]
    
    title = models.CharField(max_length=255)
    description = models.TextField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='open')
    priority = models.CharField(max_length=20, choices=PRIORITY_CHOICES, default='medium')
    created_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name='created_tickets')
    assigned_to = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='assigned_tickets')
    tenant = models.CharField(max_length=100, null=True, blank=True)
    
    class Meta:
        app_label = 'lab'
        ordering = ['-created_at']
    
    def __str__(self):
        return f"#{self.id} - {self.title}"

class SupportMessage(LabBaseModel):
    ticket = models.ForeignKey(SupportTicket, on_delete=models.CASCADE, related_name='messages')
    sender = models.ForeignKey(User, on_delete=models.CASCADE, related_name='support_messages')
    message = models.TextField()
    is_internal = models.BooleanField(default=False)
    
    class Meta:
        app_label = 'lab'
        ordering = ['created_at']
    
    def __str__(self):
        return f"Message for #{self.ticket.id} by {self.sender.username}"

class SupportAttachment(LabBaseModel):
    message = models.ForeignKey(SupportMessage, on_delete=models.CASCADE, related_name='attachments')
    file = models.FileField(upload_to='support_attachments/')
    filename = models.CharField(max_length=255)
    file_size = models.PositiveIntegerField()
    
    class Meta:
        app_label = 'lab'
    
    def __str__(self):
        return f"Attachment: {self.filename}"
