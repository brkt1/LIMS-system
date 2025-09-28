from django.db import models
from lab.components.superadmin.models import Tenant

SPECIMEN_TYPE_CHOICES = [
    ('blood', 'Blood'),
    ('urine', 'Urine'),
    ('sputum', 'Sputum'),
    ('stool', 'Stool'),
    ('wound_swab', 'Wound Swab'),
    ('throat_swab', 'Throat Swab'),
    ('cerebrospinal_fluid', 'Cerebrospinal Fluid'),
    ('tissue', 'Tissue'),
    ('other', 'Other'),
]

CULTURE_TYPE_CHOICES = [
    ('bacterial', 'Bacterial Culture'),
    ('fungal', 'Fungal Culture'),
    ('viral', 'Viral Culture'),
    ('mycobacterial', 'Mycobacterial Culture'),
    ('mixed', 'Mixed Culture'),
]

STATUS_CHOICES = [
    ('pending', 'Pending'),
    ('in_progress', 'In Progress'),
    ('completed', 'Completed'),
    ('cancelled', 'Cancelled'),
]

SENSITIVITY_CHOICES = [
    ('sensitive', 'Sensitive'),
    ('intermediate', 'Intermediate'),
    ('resistant', 'Resistant'),
    ('not_tested', 'Not Tested'),
]

class Culture(models.Model):
    id = models.CharField(primary_key=True, max_length=50)
    patient_name = models.CharField(max_length=255)
    patient_id = models.CharField(max_length=50)
    specimen_type = models.CharField(max_length=50, choices=SPECIMEN_TYPE_CHOICES)
    culture_type = models.CharField(max_length=50, choices=CULTURE_TYPE_CHOICES)
    organism = models.CharField(max_length=255, blank=True, null=True)
    collection_date = models.DateField()
    technician = models.CharField(max_length=255, blank=True, null=True)
    notes = models.TextField(blank=True, null=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    report_date = models.DateField(blank=True, null=True)
    tenant = models.ForeignKey(Tenant, to_field="id", on_delete=models.CASCADE, related_name="cultures")
    created_by = models.EmailField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-collection_date']
        unique_together = ['patient_id', 'collection_date', 'specimen_type', 'tenant']

    def __str__(self):
        return f"{self.patient_name} - {self.specimen_type} ({self.collection_date})"

class AntibioticSensitivity(models.Model):
    id = models.CharField(primary_key=True, max_length=50)
    culture = models.ForeignKey(Culture, on_delete=models.CASCADE, related_name='antibiotic_sensitivities')
    antibiotic_name = models.CharField(max_length=255)
    sensitivity = models.CharField(max_length=20, choices=SENSITIVITY_CHOICES)
    mic_value = models.CharField(max_length=50, blank=True, null=True)  # Minimum Inhibitory Concentration
    zone_diameter = models.CharField(max_length=50, blank=True, null=True)  # For disk diffusion
    notes = models.TextField(blank=True, null=True)
    tested_date = models.DateField()
    tenant = models.ForeignKey(Tenant, to_field="id", on_delete=models.CASCADE, related_name="antibiotic_sensitivities")
    created_by = models.EmailField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['antibiotic_name']
        unique_together = ['culture', 'antibiotic_name']

    def __str__(self):
        return f"{self.culture.patient_name} - {self.antibiotic_name} ({self.sensitivity})"
