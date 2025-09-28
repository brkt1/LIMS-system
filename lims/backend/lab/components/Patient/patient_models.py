from django.db import models
from django.conf import settings
from datetime import date, datetime

# Gender choices
GENDER_CHOICES = [
    ('Male', 'Male'),
    ('Female', 'Female'),
    ('Other', 'Other'),
    ('Prefer not to say', 'Prefer not to say'),
]

# Blood type choices
BLOOD_TYPE_CHOICES = [
    ('A+', 'A+'),
    ('A-', 'A-'),
    ('B+', 'B+'),
    ('B-', 'B-'),
    ('AB+', 'AB+'),
    ('AB-', 'AB-'),
    ('O+', 'O+'),
    ('O-', 'O-'),
    ('Unknown', 'Unknown'),
]

# Patient status choices
STATUS_CHOICES = [
    ('Active', 'Active'),
    ('Inactive', 'Inactive'),
    ('Discharged', 'Discharged'),
    ('Deceased', 'Deceased'),
]

# Appointment status choices
APPOINTMENT_STATUS_CHOICES = [
    ('Scheduled', 'Scheduled'),
    ('Confirmed', 'Confirmed'),
    ('In Progress', 'In Progress'),
    ('Completed', 'Completed'),
    ('Cancelled', 'Cancelled'),
    ('No Show', 'No Show'),
    ('Rescheduled', 'Rescheduled'),
]

# Appointment type choices
APPOINTMENT_TYPE_CHOICES = [
    ('In-Person', 'In-Person'),
    ('Video Consultation', 'Video Consultation'),
    ('Phone Consultation', 'Phone Consultation'),
    ('Follow-up', 'Follow-up'),
    ('Emergency', 'Emergency'),
]

# Test result status choices
TEST_RESULT_STATUS_CHOICES = [
    ('Pending', 'Pending'),
    ('In Progress', 'In Progress'),
    ('Completed', 'Completed'),
    ('Abnormal', 'Abnormal'),
    ('Critical', 'Critical'),
    ('Cancelled', 'Cancelled'),
]

# Message priority choices
MESSAGE_PRIORITY_CHOICES = [
    ('Low', 'Low'),
    ('Normal', 'Normal'),
    ('High', 'High'),
    ('Urgent', 'Urgent'),
]

# Support ticket status choices
SUPPORT_TICKET_STATUS_CHOICES = [
    ('Open', 'Open'),
    ('In Progress', 'In Progress'),
    ('Resolved', 'Resolved'),
    ('Closed', 'Closed'),
]

# Support ticket priority choices
SUPPORT_TICKET_PRIORITY_CHOICES = [
    ('Low', 'Low'),
    ('Medium', 'Medium'),
    ('High', 'High'),
    ('Critical', 'Critical'),
]

# Support ticket category choices
SUPPORT_TICKET_CATEGORY_CHOICES = [
    ('Technical', 'Technical'),
    ('Appointment', 'Appointment'),
    ('Test Results', 'Test Results'),
    ('Account', 'Account'),
    ('Billing', 'Billing'),
    ('General', 'General'),
]


class Patient(models.Model):
    """Patient model for comprehensive patient information"""
    
    # Basic Information
    patient_id = models.CharField(max_length=50, unique=True)
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='patient_profile', null=True, blank=True)
    
    # Personal Information
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    email = models.EmailField(unique=True)
    phone = models.CharField(max_length=20, blank=True, null=True)
    date_of_birth = models.DateField()
    gender = models.CharField(max_length=20, choices=GENDER_CHOICES)
    blood_type = models.CharField(max_length=10, choices=BLOOD_TYPE_CHOICES, blank=True, null=True)
    
    # Address Information
    address = models.TextField(blank=True, null=True)
    city = models.CharField(max_length=100, blank=True, null=True)
    state = models.CharField(max_length=100, blank=True, null=True)
    zip_code = models.CharField(max_length=20, blank=True, null=True)
    country = models.CharField(max_length=100, default='United States')
    
    # Emergency Contact
    emergency_contact_name = models.CharField(max_length=255, blank=True, null=True)
    emergency_contact_phone = models.CharField(max_length=20, blank=True, null=True)
    emergency_contact_relationship = models.CharField(max_length=100, blank=True, null=True)
    
    # Insurance Information
    insurance_provider = models.CharField(max_length=255, blank=True, null=True)
    insurance_number = models.CharField(max_length=100, blank=True, null=True)
    insurance_group_number = models.CharField(max_length=100, blank=True, null=True)
    
    # Medical Information
    medical_history = models.TextField(blank=True, null=True)
    allergies = models.TextField(blank=True, null=True)
    current_medications = models.TextField(blank=True, null=True)
    chronic_conditions = models.TextField(blank=True, null=True)
    
    # Additional Information
    bio = models.TextField(blank=True, null=True)
    timezone = models.CharField(max_length=50, default='America/New_York')
    language = models.CharField(max_length=10, default='en')
    
    # Notification Preferences
    email_notifications = models.BooleanField(default=True)
    sms_notifications = models.BooleanField(default=True)
    push_notifications = models.BooleanField(default=False)
    
    # Status and Metadata
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='Active')
    last_visit = models.DateField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    created_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True, related_name='created_patients')
    
    class Meta:
        ordering = ['last_name', 'first_name']
        verbose_name = 'Patient'
        verbose_name_plural = 'Patients'
    
    def __str__(self):
        return f"{self.first_name} {self.last_name} ({self.patient_id})"
    
    @property
    def full_name(self):
        return f"{self.first_name} {self.last_name}"
    
    @property
    def age(self):
        today = date.today()
        return today.year - self.date_of_birth.year - ((today.month, today.day) < (self.date_of_birth.month, self.date_of_birth.day))


class Appointment(models.Model):
    """Appointment model for patient appointments"""
    
    appointment_id = models.CharField(max_length=50, unique=True)
    patient = models.ForeignKey(Patient, on_delete=models.CASCADE, related_name='appointments')
    doctor = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='patient_appointments')
    
    # Appointment Details
    appointment_date = models.DateField()
    appointment_time = models.TimeField()
    duration = models.IntegerField(default=30)  # Duration in minutes
    appointment_type = models.CharField(max_length=30, choices=APPOINTMENT_TYPE_CHOICES, default='In-Person')
    
    # Location Information
    location = models.CharField(max_length=255, blank=True, null=True)
    room_number = models.CharField(max_length=20, blank=True, null=True)
    video_link = models.URLField(blank=True, null=True)
    
    # Appointment Information
    reason = models.TextField()
    notes = models.TextField(blank=True, null=True)
    status = models.CharField(max_length=20, choices=APPOINTMENT_STATUS_CHOICES, default='Scheduled')
    
    # Follow-up Information
    follow_up_required = models.BooleanField(default=False)
    follow_up_date = models.DateField(blank=True, null=True)
    follow_up_notes = models.TextField(blank=True, null=True)
    
    # Metadata
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    created_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True, related_name='created_appointments')
    
    class Meta:
        ordering = ['appointment_date', 'appointment_time']
        verbose_name = 'Appointment'
        verbose_name_plural = 'Appointments'
    
    def __str__(self):
        return f"{self.patient.full_name} - {self.appointment_date} {self.appointment_time}"


class TestResult(models.Model):
    """Test result model for patient test results"""
    
    test_id = models.CharField(max_length=50, unique=True)
    patient = models.ForeignKey(Patient, on_delete=models.CASCADE, related_name='test_results')
    doctor = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='ordered_tests')
    technician = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True, related_name='performed_tests')
    
    # Test Information
    test_name = models.CharField(max_length=255)
    test_category = models.CharField(max_length=100, blank=True, null=True)
    test_code = models.CharField(max_length=50, blank=True, null=True)
    
    # Test Details
    test_date = models.DateField()
    result_date = models.DateField(blank=True, null=True)
    status = models.CharField(max_length=20, choices=TEST_RESULT_STATUS_CHOICES, default='Pending')
    
    # Results
    result_value = models.TextField(blank=True, null=True)
    normal_range = models.CharField(max_length=255, blank=True, null=True)
    units = models.CharField(max_length=50, blank=True, null=True)
    interpretation = models.TextField(blank=True, null=True)
    
    # Additional Information
    notes = models.TextField(blank=True, null=True)
    is_abnormal = models.BooleanField(default=False)
    is_critical = models.BooleanField(default=False)
    
    # File Attachments
    result_file = models.FileField(upload_to='test_results/', blank=True, null=True)
    
    # Metadata
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    created_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True, related_name='created_test_results')
    
    class Meta:
        ordering = ['-test_date', '-created_at']
        verbose_name = 'Test Result'
        verbose_name_plural = 'Test Results'
    
    def __str__(self):
        return f"{self.patient.full_name} - {self.test_name} ({self.test_date})"


class Message(models.Model):
    """Message model for patient-doctor communication"""
    
    message_id = models.CharField(max_length=50, unique=True)
    sender = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='sent_messages')
    recipient = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='received_messages')
    patient = models.ForeignKey(Patient, on_delete=models.CASCADE, related_name='messages')
    
    # Message Content
    subject = models.CharField(max_length=255)
    message = models.TextField()
    priority = models.CharField(max_length=20, choices=MESSAGE_PRIORITY_CHOICES, default='Normal')
    
    # Message Status
    is_read = models.BooleanField(default=False)
    read_at = models.DateTimeField(blank=True, null=True)
    is_archived = models.BooleanField(default=False)
    
    # Attachments
    attachment = models.FileField(upload_to='message_attachments/', blank=True, null=True)
    
    # Metadata
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-created_at']
        verbose_name = 'Message'
        verbose_name_plural = 'Messages'
    
    def __str__(self):
        return f"{self.sender.email} to {self.recipient.email} - {self.subject}"


class SupportTicket(models.Model):
    """Support ticket model for patient support requests"""
    
    ticket_id = models.CharField(max_length=50, unique=True)
    patient = models.ForeignKey(Patient, on_delete=models.CASCADE, related_name='support_tickets')
    
    # Ticket Information
    subject = models.CharField(max_length=255)
    description = models.TextField()
    category = models.CharField(max_length=30, choices=SUPPORT_TICKET_CATEGORY_CHOICES, default='General')
    priority = models.CharField(max_length=20, choices=SUPPORT_TICKET_PRIORITY_CHOICES, default='Medium')
    status = models.CharField(max_length=20, choices=SUPPORT_TICKET_STATUS_CHOICES, default='Open')
    
    # Assignment
    assigned_to = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True, related_name='patient_support_tickets')
    
    # Resolution
    resolution = models.TextField(blank=True, null=True)
    resolved_at = models.DateTimeField(blank=True, null=True)
    resolved_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True, related_name='resolved_patient_tickets')
    
    # Attachments
    attachment = models.FileField(upload_to='support_attachments/', blank=True, null=True)
    
    # Metadata
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-created_at']
        verbose_name = 'Support Ticket'
        verbose_name_plural = 'Support Tickets'
    
    def __str__(self):
        return f"Ticket {self.ticket_id} - {self.subject}"


class PatientNotification(models.Model):
    """Notification model for patient notifications"""
    
    notification_id = models.CharField(max_length=50, unique=True)
    patient = models.ForeignKey(Patient, on_delete=models.CASCADE, related_name='notifications')
    
    # Notification Content
    title = models.CharField(max_length=255)
    message = models.TextField()
    notification_type = models.CharField(max_length=50, default='info')  # info, warning, success, error
    
    # Notification Status
    is_read = models.BooleanField(default=False)
    read_at = models.DateTimeField(blank=True, null=True)
    
    # Action Information
    action_url = models.URLField(blank=True, null=True)
    action_text = models.CharField(max_length=100, blank=True, null=True)
    
    # Metadata
    created_at = models.DateTimeField(auto_now_add=True)
    expires_at = models.DateTimeField(blank=True, null=True)
    
    class Meta:
        ordering = ['-created_at']
        verbose_name = 'Patient Notification'
        verbose_name_plural = 'Patient Notifications'
    
    def __str__(self):
        return f"{self.patient.full_name} - {self.title}"
