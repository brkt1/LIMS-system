from django.db import models
from django.contrib.auth.models import User
from lab.components.superadmin.models import Tenant

SPECIALTY_CHOICES = [
    ('cardiology', 'Cardiology'),
    ('neurology', 'Neurology'),
    ('pediatrics', 'Pediatrics'),
    ('orthopedics', 'Orthopedics'),
    ('dermatology', 'Dermatology'),
    ('internal_medicine', 'Internal Medicine'),
    ('surgery', 'Surgery'),
    ('radiology', 'Radiology'),
    ('pathology', 'Pathology'),
    ('anesthesiology', 'Anesthesiology'),
    ('emergency_medicine', 'Emergency Medicine'),
    ('family_medicine', 'Family Medicine'),
    ('psychiatry', 'Psychiatry'),
    ('oncology', 'Oncology'),
    ('gastroenterology', 'Gastroenterology'),
]

STATUS_CHOICES = [
    ('active', 'Active'),
    ('inactive', 'Inactive'),
    ('pending', 'Pending'),
    ('suspended', 'Suspended'),
    ('on_leave', 'On Leave'),
]

CERTIFICATION_CHOICES = [
    ('board_certified', 'Board Certified'),
    ('board_eligible', 'Board Eligible'),
    ('resident', 'Resident'),
    ('fellow', 'Fellow'),
    ('attending', 'Attending'),
]

class Doctor(models.Model):
    """Doctor model for clinical staff within tenant organizations"""
    
    id = models.CharField(primary_key=True, max_length=50)
    name = models.CharField(max_length=255)
    email = models.EmailField(unique=True)
    specialty = models.CharField(max_length=50, choices=SPECIALTY_CHOICES)
    license_number = models.CharField(max_length=100, unique=True)
    phone = models.CharField(max_length=20, blank=True, null=True)
    experience = models.CharField(max_length=100, blank=True, null=True)
    education = models.TextField(blank=True, null=True)
    schedule = models.TextField(blank=True, null=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='active')
    total_patients = models.IntegerField(default=0)
    rating = models.DecimalField(max_digits=3, decimal_places=1, default=0.0)
    join_date = models.DateField(auto_now_add=True)
    tenant = models.ForeignKey(Tenant, to_field="id", on_delete=models.CASCADE, related_name="doctors")
    created_by = models.EmailField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    # Enhanced clinical fields
    certification_level = models.CharField(max_length=20, choices=CERTIFICATION_CHOICES, default='board_certified')
    years_experience = models.IntegerField(default=0)
    languages_spoken = models.JSONField(default=list, blank=True)
    consultation_fee = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    max_daily_appointments = models.IntegerField(default=20)
    emergency_contact = models.CharField(max_length=20, blank=True, null=True)
    notes = models.TextField(blank=True, null=True)
    
    # Clinical workflow fields
    can_prescribe = models.BooleanField(default=True)
    can_order_tests = models.BooleanField(default=True)
    can_review_results = models.BooleanField(default=True)
    requires_supervision = models.BooleanField(default=False)
    supervisor = models.ForeignKey('self', on_delete=models.SET_NULL, null=True, blank=True, related_name='supervised_doctors')

    class Meta:
        ordering = ['name']
        unique_together = ['email', 'tenant']

    def __str__(self):
        return f"{self.name} ({self.specialty})"
    
    @property
    def is_available_today(self):
        """Check if doctor is available for appointments today"""
        # This would integrate with appointment system
        return self.status == 'active'
    
    @property
    def current_patient_load(self):
        """Get current number of active patients"""
        # This would integrate with patient management system
        return self.total_patients


class TestRequest(models.Model):
    """Test requests created by doctors for technicians"""
    
    PRIORITY_CHOICES = [
        ('routine', 'Routine'),
        ('urgent', 'Urgent'),
        ('stat', 'STAT'),
        ('emergency', 'Emergency'),
    ]
    
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('assigned', 'Assigned to Technician'),
        ('in_progress', 'In Progress'),
        ('completed', 'Completed'),
        ('cancelled', 'Cancelled'),
        ('rejected', 'Rejected'),
    ]
    
    id = models.CharField(primary_key=True, max_length=50)
    doctor = models.ForeignKey(Doctor, on_delete=models.CASCADE, related_name='test_requests')
    patient_id = models.CharField(max_length=50)  # Reference to patient
    test_type = models.CharField(max_length=100)
    test_description = models.TextField()
    priority = models.CharField(max_length=20, choices=PRIORITY_CHOICES, default='routine')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    requested_date = models.DateTimeField(auto_now_add=True)
    required_date = models.DateTimeField()
    technician_notes = models.TextField(blank=True, null=True)
    doctor_notes = models.TextField(blank=True, null=True)
    tenant = models.ForeignKey(Tenant, on_delete=models.CASCADE, related_name='test_requests')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-requested_date']
    
    def __str__(self):
        return f"Test Request {self.id} - {self.test_type}"


class PatientRecord(models.Model):
    """Patient records managed by doctors"""
    
    id = models.CharField(primary_key=True, max_length=50)
    patient_id = models.CharField(max_length=50)  # Reference to patient
    doctor = models.ForeignKey(Doctor, on_delete=models.CASCADE, related_name='patient_records')
    visit_date = models.DateTimeField()
    chief_complaint = models.TextField()
    diagnosis = models.TextField(blank=True, null=True)
    treatment_plan = models.TextField(blank=True, null=True)
    prescriptions = models.JSONField(default=list, blank=True)
    follow_up_required = models.BooleanField(default=False)
    follow_up_date = models.DateField(blank=True, null=True)
    notes = models.TextField(blank=True, null=True)
    tenant = models.ForeignKey(Tenant, on_delete=models.CASCADE, related_name='patient_records')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-visit_date']
    
    def __str__(self):
        return f"Record {self.id} - {self.patient_id}"


class TestResult(models.Model):
    """Test results that doctors can review"""
    
    STATUS_CHOICES = [
        ('pending_review', 'Pending Review'),
        ('reviewed', 'Reviewed'),
        ('approved', 'Approved'),
        ('rejected', 'Rejected'),
    ]
    
    id = models.CharField(primary_key=True, max_length=50)
    test_request = models.OneToOneField(TestRequest, on_delete=models.CASCADE, related_name='result')
    patient_id = models.CharField(max_length=50)
    doctor = models.ForeignKey(Doctor, on_delete=models.CASCADE, related_name='test_results')
    result_data = models.JSONField()
    result_summary = models.TextField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending_review')
    reviewed_at = models.DateTimeField(blank=True, null=True)
    doctor_notes = models.TextField(blank=True, null=True)
    tenant = models.ForeignKey(Tenant, on_delete=models.CASCADE, related_name='test_results')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return f"Result {self.id} - {self.test_request.test_type}"


class DoctorAppointment(models.Model):
    """Enhanced appointment management for doctors"""
    
    STATUS_CHOICES = [
        ('scheduled', 'Scheduled'),
        ('confirmed', 'Confirmed'),
        ('in_progress', 'In Progress'),
        ('completed', 'Completed'),
        ('cancelled', 'Cancelled'),
        ('no_show', 'No Show'),
    ]
    
    APPOINTMENT_TYPES = [
        ('consultation', 'Consultation'),
        ('follow_up', 'Follow-up'),
        ('emergency', 'Emergency'),
        ('procedure', 'Procedure'),
        ('telemedicine', 'Telemedicine'),
    ]
    
    id = models.CharField(primary_key=True, max_length=50)
    doctor = models.ForeignKey(Doctor, on_delete=models.CASCADE, related_name='appointments')
    patient_id = models.CharField(max_length=50)
    appointment_date = models.DateTimeField()
    duration_minutes = models.IntegerField(default=30)
    appointment_type = models.CharField(max_length=20, choices=APPOINTMENT_TYPES, default='consultation')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='scheduled')
    reason = models.TextField()
    notes = models.TextField(blank=True, null=True)
    tenant = models.ForeignKey(Tenant, on_delete=models.CASCADE, related_name='doctor_appointments')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['appointment_date']
    
    def __str__(self):
        return f"Appointment {self.id} - {self.appointment_date}"
