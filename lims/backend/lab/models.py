from django.db import models
from datetime import date
from django.contrib.auth import get_user_model

User = get_user_model()

# Example common model
class LabBaseModel(models.Model):
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True


# Technician Models
class Technician(models.Model):
    """Technician model for laboratory operations"""
    
    SPECIALIZATION_CHOICES = [
        ('clinical_chemistry', 'Clinical Chemistry'),
        ('hematology', 'Hematology'),
        ('microbiology', 'Microbiology'),
        ('immunology', 'Immunology'),
        ('pathology', 'Pathology'),
        ('molecular_biology', 'Molecular Biology'),
        ('cytology', 'Cytology'),
        ('blood_bank', 'Blood Bank'),
        ('general', 'General Laboratory'),
    ]
    
    CERTIFICATION_LEVEL_CHOICES = [
        ('certified', 'Certified Medical Laboratory Technician (MLT)'),
        ('specialist', 'Medical Laboratory Specialist (MLS)'),
        ('technologist', 'Medical Laboratory Technologist (MLT)'),
        ('supervisor', 'Laboratory Supervisor'),
        ('director', 'Laboratory Director'),
    ]
    
    STATUS_CHOICES = [
        ('active', 'Active'),
        ('inactive', 'Inactive'),
        ('on_leave', 'On Leave'),
        ('terminated', 'Terminated'),
    ]
    
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='technician_profile')
    employee_id = models.CharField(max_length=50, unique=True)
    specialization = models.CharField(max_length=50, choices=SPECIALIZATION_CHOICES, default='general')
    certification_level = models.CharField(max_length=50, choices=CERTIFICATION_LEVEL_CHOICES, default='certified')
    years_experience = models.PositiveIntegerField(default=0)
    license_number = models.CharField(max_length=100, blank=True, null=True)
    license_expiry = models.DateField(blank=True, null=True)
    phone = models.CharField(max_length=20, blank=True, null=True)
    emergency_contact = models.CharField(max_length=100, blank=True, null=True)
    emergency_phone = models.CharField(max_length=20, blank=True, null=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='active')
    hire_date = models.DateField()
    notes = models.TextField(blank=True, null=True)
    tenant_id = models.CharField(max_length=100, null=True, blank=True)  # Reference to tenant
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    # Performance metrics
    total_tests_processed = models.PositiveIntegerField(default=0)
    average_processing_time = models.DurationField(blank=True, null=True)
    quality_score = models.DecimalField(max_digits=5, decimal_places=2, default=0.00)
    
    class Meta:
        ordering = ['user__last_name', 'user__first_name']
    
    def __str__(self):
        return f"{self.user.get_full_name()} - {self.specialization}"
    
    @property
    def full_name(self):
        return self.user.get_full_name()
    
    @property
    def email(self):
        return self.user.email
    
    @property
    def is_license_valid(self):
        if not self.license_expiry:
            return True
        from django.utils import timezone
        return self.license_expiry > timezone.now().date()


class Sample(models.Model):
    """Sample model for laboratory samples"""
    
    SAMPLE_TYPE_CHOICES = [
        ('blood', 'Blood'),
        ('urine', 'Urine'),
        ('tissue', 'Tissue'),
        ('swab', 'Swab'),
        ('fluid', 'Body Fluid'),
        ('stool', 'Stool'),
        ('sputum', 'Sputum'),
        ('other', 'Other'),
    ]
    
    STATUS_CHOICES = [
        ('collected', 'Collected'),
        ('received', 'Received in Lab'),
        ('processing', 'Processing'),
        ('analyzed', 'Analyzed'),
        ('completed', 'Completed'),
        ('rejected', 'Rejected'),
        ('expired', 'Expired'),
    ]
    
    PRIORITY_CHOICES = [
        ('routine', 'Routine'),
        ('urgent', 'Urgent'),
        ('stat', 'STAT'),
        ('emergency', 'Emergency'),
    ]
    
    id = models.CharField(primary_key=True, max_length=50)
    patient_id = models.CharField(max_length=50)  # Reference to patient
    test_request_id = models.CharField(max_length=50, blank=True, null=True)  # Reference to test request
    sample_type = models.CharField(max_length=20, choices=SAMPLE_TYPE_CHOICES)
    collection_date = models.DateTimeField()
    received_date = models.DateTimeField(blank=True, null=True)
    technician = models.ForeignKey(Technician, on_delete=models.SET_NULL, null=True, blank=True, related_name='samples')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='collected')
    priority = models.CharField(max_length=20, choices=PRIORITY_CHOICES, default='routine')
    volume = models.DecimalField(max_digits=8, decimal_places=2, blank=True, null=True)  # in ml
    container_type = models.CharField(max_length=100, blank=True, null=True)
    storage_conditions = models.CharField(max_length=200, blank=True, null=True)
    expiry_date = models.DateTimeField(blank=True, null=True)
    collection_notes = models.TextField(blank=True, null=True)
    processing_notes = models.TextField(blank=True, null=True)
    rejection_reason = models.TextField(blank=True, null=True)
    tenant_id = models.CharField(max_length=100, null=True, blank=True)  # Reference to tenant
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-collection_date']
    
    def __str__(self):
        return f"Sample {self.id} - {self.sample_type}"


class TestResult(models.Model):
    """Test result model for laboratory test results"""
    
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('in_progress', 'In Progress'),
        ('completed', 'Completed'),
        ('reviewed', 'Reviewed by Doctor'),
        ('approved', 'Approved'),
        ('rejected', 'Rejected'),
    ]
    
    RESULT_TYPE_CHOICES = [
        ('quantitative', 'Quantitative'),
        ('qualitative', 'Qualitative'),
        ('text', 'Text'),
        ('image', 'Image'),
        ('file', 'File'),
    ]
    
    id = models.CharField(primary_key=True, max_length=50)
    sample = models.ForeignKey(Sample, on_delete=models.CASCADE, related_name='test_results')
    test_name = models.CharField(max_length=200)
    test_code = models.CharField(max_length=50, blank=True, null=True)
    result_type = models.CharField(max_length=20, choices=RESULT_TYPE_CHOICES, default='quantitative')
    result_value = models.TextField(blank=True, null=True)
    result_unit = models.CharField(max_length=50, blank=True, null=True)
    reference_range = models.CharField(max_length=200, blank=True, null=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    technician = models.ForeignKey(Technician, on_delete=models.SET_NULL, null=True, blank=True, related_name='test_results')
    equipment_used_id = models.CharField(max_length=50, blank=True, null=True)  # Reference to equipment
    analysis_date = models.DateTimeField(blank=True, null=True)
    completion_date = models.DateTimeField(blank=True, null=True)
    reviewed_by_id = models.CharField(max_length=50, blank=True, null=True)  # Reference to doctor
    review_date = models.DateTimeField(blank=True, null=True)
    review_notes = models.TextField(blank=True, null=True)
    is_abnormal = models.BooleanField(default=False)
    critical_value = models.BooleanField(default=False)
    technician_notes = models.TextField(blank=True, null=True)
    quality_control_passed = models.BooleanField(default=True)
    tenant_id = models.CharField(max_length=100, null=True, blank=True)  # Reference to tenant
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-analysis_date']
    
    def __str__(self):
        return f"Result {self.id} - {self.test_name}"


class QualityControl(models.Model):
    """Quality control model for laboratory quality assurance"""
    
    QC_TYPE_CHOICES = [
        ('internal', 'Internal QC'),
        ('external', 'External QC'),
        ('proficiency', 'Proficiency Testing'),
        ('calibration', 'Calibration'),
    ]
    
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('passed', 'Passed'),
        ('failed', 'Failed'),
        ('warning', 'Warning'),
    ]
    
    id = models.CharField(primary_key=True, max_length=50)
    test_name = models.CharField(max_length=200)
    qc_type = models.CharField(max_length=20, choices=QC_TYPE_CHOICES)
    lot_number = models.CharField(max_length=100, blank=True, null=True)
    expected_value = models.DecimalField(max_digits=10, decimal_places=4, blank=True, null=True)
    actual_value = models.DecimalField(max_digits=10, decimal_places=4, blank=True, null=True)
    acceptable_range_min = models.DecimalField(max_digits=10, decimal_places=4, blank=True, null=True)
    acceptable_range_max = models.DecimalField(max_digits=10, decimal_places=4, blank=True, null=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    technician = models.ForeignKey(Technician, on_delete=models.SET_NULL, null=True, blank=True, related_name='qc_records')
    equipment_id = models.CharField(max_length=50, blank=True, null=True)  # Reference to equipment
    performed_date = models.DateTimeField()
    notes = models.TextField(blank=True, null=True)
    corrective_action = models.TextField(blank=True, null=True)
    tenant_id = models.CharField(max_length=100, null=True, blank=True)  # Reference to tenant
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-performed_date']
    
    def __str__(self):
        return f"QC {self.id} - {self.test_name}"


class LabWorkflow(models.Model):
    """Lab workflow model for tracking laboratory processes"""
    
    WORKFLOW_TYPE_CHOICES = [
        ('sample_processing', 'Sample Processing'),
        ('equipment_maintenance', 'Equipment Maintenance'),
        ('quality_control', 'Quality Control'),
        ('calibration', 'Calibration'),
        ('inventory', 'Inventory Management'),
        ('training', 'Training'),
    ]
    
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('in_progress', 'In Progress'),
        ('completed', 'Completed'),
        ('cancelled', 'Cancelled'),
        ('on_hold', 'On Hold'),
    ]
    
    id = models.CharField(primary_key=True, max_length=50)
    workflow_type = models.CharField(max_length=30, choices=WORKFLOW_TYPE_CHOICES)
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True, null=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    assigned_to = models.ForeignKey(Technician, on_delete=models.SET_NULL, null=True, blank=True, related_name='assigned_workflows')
    priority = models.CharField(max_length=20, choices=Sample.PRIORITY_CHOICES, default='routine')
    due_date = models.DateTimeField(blank=True, null=True)
    completed_date = models.DateTimeField(blank=True, null=True)
    estimated_duration = models.DurationField(blank=True, null=True)
    actual_duration = models.DurationField(blank=True, null=True)
    notes = models.TextField(blank=True, null=True)
    tenant_id = models.CharField(max_length=100, null=True, blank=True)  # Reference to tenant
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return f"Workflow {self.id} - {self.title}"
