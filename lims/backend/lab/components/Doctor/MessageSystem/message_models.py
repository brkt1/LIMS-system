from django.db import models
from datetime import datetime

# Message type choices
MESSAGE_TYPE_CHOICES = [
    ('General', 'General'),
    ('Appointment', 'Appointment'),
    ('Test Results', 'Test Results'),
    ('Prescription', 'Prescription'),
    ('Emergency', 'Emergency'),
]

# Message status choices
STATUS_CHOICES = [
    ('Unread', 'Unread'),
    ('Read', 'Read'),
    ('Replied', 'Replied'),
    ('Archived', 'Archived'),
]

class Message(models.Model):
    sender_id = models.CharField(max_length=50)
    sender_name = models.CharField(max_length=255)
    recipient_id = models.CharField(max_length=50)
    recipient_name = models.CharField(max_length=255)
    subject = models.CharField(max_length=255)
    message_body = models.TextField()
    message_type = models.CharField(max_length=20, choices=MESSAGE_TYPE_CHOICES, default='General')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='Unread')
    is_urgent = models.BooleanField(default=False)
    related_appointment_id = models.CharField(max_length=50, blank=True, null=True)
    related_test_request_id = models.CharField(max_length=50, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    read_at = models.DateTimeField(blank=True, null=True)

    class Meta:
        app_label = 'lab'
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.sender_name} to {self.recipient_name}: {self.subject}"
