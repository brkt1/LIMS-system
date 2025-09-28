from django.db import models
from django.contrib.auth import get_user_model
from lab.components.superadmin.models import Tenant

User = get_user_model()
from lab.models import LabBaseModel

class SupportTicket(LabBaseModel):
    PRIORITY_CHOICES = [
        ('low', 'Low'),
        ('medium', 'Medium'),
        ('high', 'High'),
        ('critical', 'Critical'),
        ('urgent', 'Urgent'),
    ]
    
    STATUS_CHOICES = [
        ('open', 'Open'),
        ('pending', 'Pending'),
        ('in_progress', 'In Progress'),
        ('resolved', 'Resolved'),
        ('closed', 'Closed'),
        ('cancelled', 'Cancelled'),
    ]
    
    CATEGORY_CHOICES = [
        ('technical', 'Technical'),
        ('billing', 'Billing'),
        ('account', 'Account'),
        ('appointments', 'Appointments'),
        ('reports', 'Reports'),
        ('equipment', 'Equipment'),
        ('data_export', 'Data Export'),
        ('notifications', 'Notifications'),
        ('general', 'General'),
    ]
    
    title = models.CharField(max_length=255)
    description = models.TextField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='open')
    priority = models.CharField(max_length=20, choices=PRIORITY_CHOICES, default='medium')
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES, default='general')
    created_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name='created_tickets')
    assigned_to = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='assigned_tickets')
    tenant = models.ForeignKey(Tenant, on_delete=models.CASCADE, related_name='support_tickets', null=True, blank=True)
    
    # Enhanced fields for better support management
    reporter_name = models.CharField(max_length=255, blank=True, null=True)
    reporter_email = models.EmailField(blank=True, null=True)
    reporter_phone = models.CharField(max_length=20, blank=True, null=True)
    tags = models.JSONField(default=list, blank=True)
    estimated_resolution_time = models.DateTimeField(blank=True, null=True)
    actual_resolution_time = models.DateTimeField(blank=True, null=True)
    first_response_time = models.DateTimeField(blank=True, null=True)
    satisfaction_rating = models.IntegerField(blank=True, null=True, choices=[(i, i) for i in range(1, 6)])
    satisfaction_feedback = models.TextField(blank=True, null=True)
    escalation_level = models.IntegerField(default=0)
    is_escalated = models.BooleanField(default=False)
    escalation_reason = models.TextField(blank=True, null=True)
    resolution_notes = models.TextField(blank=True, null=True)
    internal_notes = models.TextField(blank=True, null=True)
    
    class Meta:
        app_label = 'lab'
        ordering = ['-created_at']
    
    def __str__(self):
        return f"#{self.id} - {self.title}"
    
    @property
    def response_time_hours(self):
        """Calculate first response time in hours"""
        if self.first_response_time and self.created_at:
            delta = self.first_response_time - self.created_at
            return delta.total_seconds() / 3600
        return None
    
    @property
    def resolution_time_hours(self):
        """Calculate resolution time in hours"""
        if self.actual_resolution_time and self.created_at:
            delta = self.actual_resolution_time - self.created_at
            return delta.total_seconds() / 3600
        return None

class SupportMessage(LabBaseModel):
    ticket = models.ForeignKey(SupportTicket, on_delete=models.CASCADE, related_name='messages')
    sender = models.ForeignKey(User, on_delete=models.CASCADE, related_name='support_messages')
    message = models.TextField()
    is_internal = models.BooleanField(default=False)
    is_auto_generated = models.BooleanField(default=False)
    message_type = models.CharField(max_length=20, choices=[
        ('user_message', 'User Message'),
        ('support_response', 'Support Response'),
        ('system_notification', 'System Notification'),
        ('escalation_note', 'Escalation Note'),
    ], default='user_message')
    
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


class SupportStaff(models.Model):
    """Model for managing support staff members"""
    
    SPECIALIZATION_CHOICES = [
        ('technical', 'Technical Support'),
        ('billing', 'Billing Support'),
        ('general', 'General Support'),
        ('escalation', 'Escalation Specialist'),
        ('training', 'Training Specialist'),
    ]
    
    LEVEL_CHOICES = [
        ('junior', 'Junior Support'),
        ('senior', 'Senior Support'),
        ('lead', 'Lead Support'),
        ('manager', 'Support Manager'),
    ]
    
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='support_staff_profile')
    employee_id = models.CharField(max_length=50, unique=True)
    specialization = models.CharField(max_length=20, choices=SPECIALIZATION_CHOICES, default='general')
    level = models.CharField(max_length=20, choices=LEVEL_CHOICES, default='junior')
    tenant = models.ForeignKey(Tenant, on_delete=models.CASCADE, related_name='support_staff')
    
    # Performance metrics
    total_tickets_resolved = models.IntegerField(default=0)
    average_resolution_time = models.FloatField(default=0.0)  # in hours
    customer_satisfaction_rating = models.FloatField(default=0.0)
    escalation_rate = models.FloatField(default=0.0)
    
    # Availability and workload
    max_concurrent_tickets = models.IntegerField(default=10)
    current_ticket_count = models.IntegerField(default=0)
    is_available = models.BooleanField(default=True)
    working_hours_start = models.TimeField(default='09:00')
    working_hours_end = models.TimeField(default='17:00')
    timezone = models.CharField(max_length=50, default='UTC')
    
    # Skills and certifications
    skills = models.JSONField(default=list, blank=True)
    certifications = models.JSONField(default=list, blank=True)
    languages_spoken = models.JSONField(default=list, blank=True)
    
    # Contact information
    phone = models.CharField(max_length=20, blank=True, null=True)
    emergency_contact = models.CharField(max_length=20, blank=True, null=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['user__first_name', 'user__last_name']
    
    def __str__(self):
        return f"{self.user.get_full_name()} - {self.get_specialization_display()}"
    
    @property
    def workload_percentage(self):
        """Calculate current workload as percentage of max capacity"""
        if self.max_concurrent_tickets > 0:
            return (self.current_ticket_count / self.max_concurrent_tickets) * 100
        return 0
    
    @property
    def is_overloaded(self):
        """Check if support staff is overloaded"""
        return self.current_ticket_count >= self.max_concurrent_tickets


class SupportTeam(models.Model):
    """Model for organizing support staff into teams"""
    
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True, null=True)
    tenant = models.ForeignKey(Tenant, on_delete=models.CASCADE, related_name='support_teams')
    team_lead = models.ForeignKey(SupportStaff, on_delete=models.SET_NULL, null=True, blank=True, related_name='led_teams')
    members = models.ManyToManyField(SupportStaff, related_name='teams', blank=True)
    
    # Team performance metrics
    team_sla_target = models.FloatField(default=24.0)  # hours
    team_satisfaction_target = models.FloatField(default=4.0)  # out of 5
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['name']
    
    def __str__(self):
        return f"{self.name} - {self.tenant.company_name}"


class SupportSLA(models.Model):
    """Service Level Agreement definitions for different ticket types"""
    
    name = models.CharField(max_length=100)
    tenant = models.ForeignKey(Tenant, on_delete=models.CASCADE, related_name='support_slas')
    priority = models.CharField(max_length=20, choices=SupportTicket.PRIORITY_CHOICES)
    category = models.CharField(max_length=20, choices=SupportTicket.CATEGORY_CHOICES, blank=True, null=True)
    
    # SLA targets
    first_response_time = models.FloatField(help_text="First response time in hours")
    resolution_time = models.FloatField(help_text="Resolution time in hours")
    
    # Escalation rules
    escalation_time = models.FloatField(help_text="Escalation time in hours")
    escalation_level = models.IntegerField(default=1)
    
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['priority', 'category']
        unique_together = ['tenant', 'priority', 'category']
    
    def __str__(self):
        return f"{self.name} - {self.get_priority_display()}"


class SupportAnalytics(models.Model):
    """Model for storing support analytics and metrics"""
    
    tenant = models.ForeignKey(Tenant, on_delete=models.CASCADE, related_name='support_analytics')
    date = models.DateField()
    
    # Ticket metrics
    total_tickets = models.IntegerField(default=0)
    open_tickets = models.IntegerField(default=0)
    resolved_tickets = models.IntegerField(default=0)
    closed_tickets = models.IntegerField(default=0)
    
    # Performance metrics
    average_response_time = models.FloatField(default=0.0)
    average_resolution_time = models.FloatField(default=0.0)
    customer_satisfaction = models.FloatField(default=0.0)
    escalation_rate = models.FloatField(default=0.0)
    
    # Staff metrics
    active_support_staff = models.IntegerField(default=0)
    total_support_hours = models.FloatField(default=0.0)
    
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['-date']
        unique_together = ['tenant', 'date']
    
    def __str__(self):
        return f"Analytics for {self.tenant.company_name} - {self.date}"
