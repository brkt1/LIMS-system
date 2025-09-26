from django.db import models
from datetime import date, time

# Status choices for appointments
STATUS_CHOICES = [
    ('Scheduled', 'Scheduled'),
    ('Confirmed', 'Confirmed'),
    ('Completed', 'Completed'),
    ('Cancelled', 'Cancelled'),
    ('No Show', 'No Show'),
]

# Appointment type choices
TYPE_CHOICES = [
    ('Consultation', 'Consultation'),
    ('Follow-up', 'Follow-up'),
    ('New Patient', 'New Patient'),
    ('Test Review', 'Test Review'),
    ('Emergency', 'Emergency'),
]

class Appointment(models.Model):
    patient_id = models.CharField(max_length=50)
    patient_name = models.CharField(max_length=255)
    doctor_id = models.CharField(max_length=50, default='current_doctor')
    appointment_date = models.DateField(default=date.today)
    appointment_time = models.TimeField(default=time(9, 0))
    duration = models.IntegerField(default=30)  # Duration in minutes
    appointment_type = models.CharField(max_length=20, choices=TYPE_CHOICES, default='Consultation')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='Scheduled')
    notes = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        app_label = 'lab'
        ordering = ['appointment_date', 'appointment_time']

    def __str__(self):
        return f"{self.patient_name} - {self.appointment_date} {self.appointment_time}"
