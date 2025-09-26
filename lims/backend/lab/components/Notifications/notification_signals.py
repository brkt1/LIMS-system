from django.db.models.signals import post_save, pre_save
from django.dispatch import receiver
from django.contrib.auth import get_user_model
from .notification_service import NotificationService

# Import models
from ..Doctor.NewTestRequest.NewTestRequest_models import TestRequest
from ..Doctor.DocterAppointment.appointment_models import Appointment
from ..Doctor.MessageSystem.message_models import Message
from ..Technician.Equipment.equipment_models import Equipment

User = get_user_model()

# Test Request Signals
@receiver(post_save, sender=TestRequest)
def notify_test_request_created(sender, instance, created, **kwargs):
    """Notify when a new test request is created"""
    if created:
        NotificationService.notify_test_request_created(instance)

@receiver(pre_save, sender=TestRequest)
def notify_test_request_status_changed(sender, instance, **kwargs):
    """Notify when test request status changes"""
    if instance.pk:
        try:
            old_instance = TestRequest.objects.get(pk=instance.pk)
            if old_instance.status != instance.status:
                NotificationService.notify_test_request_status_changed(
                    instance, old_instance.status, instance.status
                )
        except TestRequest.DoesNotExist:
            pass

# Appointment Signals
@receiver(post_save, sender=Appointment)
def notify_appointment_created(sender, instance, created, **kwargs):
    """Notify when a new appointment is created"""
    if created:
        NotificationService.notify_appointment_created(instance)

@receiver(pre_save, sender=Appointment)
def notify_appointment_status_changed(sender, instance, **kwargs):
    """Notify when appointment status changes"""
    if instance.pk:
        try:
            old_instance = Appointment.objects.get(pk=instance.pk)
            if old_instance.status != instance.status:
                NotificationService.notify_appointment_status_changed(
                    instance, old_instance.status, instance.status
                )
        except Appointment.DoesNotExist:
            pass

# Message Signals
@receiver(post_save, sender=Message)
def notify_new_message(sender, instance, created, **kwargs):
    """Notify when a new message is created"""
    if created:
        NotificationService.notify_new_message(instance)

# Equipment Signals
@receiver(post_save, sender=Equipment)
def notify_equipment_maintenance_required(sender, instance, created, **kwargs):
    """Notify when equipment requires maintenance"""
    if created and instance.priority in ['Critical', 'Urgent']:
        NotificationService.notify_equipment_maintenance_required(instance)

@receiver(pre_save, sender=Equipment)
def notify_equipment_priority_changed(sender, instance, **kwargs):
    """Notify when equipment priority changes to critical/urgent"""
    if instance.pk:
        try:
            old_instance = Equipment.objects.get(pk=instance.pk)
            if (old_instance.priority not in ['Critical', 'Urgent'] and 
                instance.priority in ['Critical', 'Urgent']):
                NotificationService.notify_equipment_maintenance_required(instance)
        except Equipment.DoesNotExist:
            pass

# Sample Processing Signals - Commented out until AcceptTestRequest model is properly set up
# @receiver(post_save, sender=AcceptTestRequest)
# def notify_sample_processed(sender, instance, created, **kwargs):
#     """Notify when a sample is processed"""
#     if created:
#         # Get technician name (you might need to adjust this based on your model)
#         technician_name = getattr(instance, 'technician_name', 'Technician')
#         NotificationService.notify_sample_processed(instance, technician_name)
