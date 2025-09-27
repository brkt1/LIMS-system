from django.contrib.auth import get_user_model
from .notification_models import Notification
from django.utils import timezone
from datetime import timedelta

User = get_user_model()

class NotificationService:
    """Service class for creating and managing notifications"""
    
    @staticmethod
    def create_notification(
        title: str,
        message: str,
        notification_type: str = 'info',
        priority: str = 'medium',
        recipient_id: int = None,
        tenant: str = None,
        action_url: str = None,
        is_global: bool = False,
        expires_in_hours: int = None
    ):
        """Create a new notification"""
        try:
            recipient = None
            if recipient_id:
                recipient = User.objects.get(id=recipient_id)
            
            expires_at = None
            if expires_in_hours:
                expires_at = timezone.now() + timedelta(hours=expires_in_hours)
            
            notification = Notification.objects.create(
                title=title,
                message=message,
                notification_type=notification_type,
                priority=priority,
                recipient=recipient,
                tenant=tenant,
                action_url=action_url,
                is_global=is_global,
                expires_at=expires_at
            )
            
            print(f"✅ Notification created: {title}")
            return notification
        except Exception as e:
            print(f"❌ Error creating notification: {e}")
            return None
    
    @staticmethod
    def notify_test_request_created(test_request):
        """Notify when a new test request is created"""
        title = "New Test Request"
        message = f"New test request for {test_request.patient_name}: {test_request.test_type} ({test_request.priority} priority)"
        
        return NotificationService.create_notification(
            title=title,
            message=message,
            notification_type='info',
            priority='medium',
            tenant='default',
            action_url=f"/doctor/test-requests/{test_request.id}/"
        )
    
    @staticmethod
    def notify_test_request_status_changed(test_request, old_status, new_status):
        """Notify when test request status changes"""
        title = "Test Request Status Updated"
        message = f"Test request for {test_request.patient_name} changed from {old_status} to {new_status}"
        
        notification_type = 'success' if new_status in ['Completed', 'Approved'] else 'info'
        priority = 'high' if new_status in ['Critical', 'Urgent'] else 'medium'
        
        return NotificationService.create_notification(
            title=title,
            message=message,
            notification_type=notification_type,
            priority=priority,
            tenant='default',
            action_url=f"/doctor/test-requests/{test_request.id}/"
        )
    
    @staticmethod
    def notify_appointment_created(appointment):
        """Notify when a new appointment is created"""
        title = "New Appointment Scheduled"
        message = f"Appointment scheduled for {appointment.patient_name} on {appointment.appointment_date} at {appointment.appointment_time}"
        
        return NotificationService.create_notification(
            title=title,
            message=message,
            notification_type='info',
            priority='medium',
            tenant='default',
            action_url=f"/doctor/appointments/{appointment.id}/"
        )
    
    @staticmethod
    def notify_appointment_status_changed(appointment, old_status, new_status):
        """Notify when appointment status changes"""
        title = "Appointment Status Updated"
        message = f"Appointment for {appointment.patient_name} changed from {old_status} to {new_status}"
        
        notification_type = 'success' if new_status == 'Confirmed' else 'warning' if new_status == 'Cancelled' else 'info'
        priority = 'high' if new_status == 'Cancelled' else 'medium'
        
        return NotificationService.create_notification(
            title=title,
            message=message,
            notification_type=notification_type,
            priority=priority,
            tenant='default',
            action_url=f"/doctor/appointments/{appointment.id}/"
        )
    
    @staticmethod
    def notify_equipment_maintenance_required(equipment):
        """Notify when equipment requires maintenance"""
        title = "Equipment Maintenance Required"
        message = f"Equipment {equipment.name} ({equipment.model}) requires maintenance. Priority: {equipment.priority}"
        
        priority = 'high' if equipment.priority in ['Critical', 'Urgent'] else 'medium'
        
        return NotificationService.create_notification(
            title=title,
            message=message,
            notification_type='warning',
            priority=priority,
            tenant='default',
            action_url=f"/technician/equipment/{equipment.id}/"
        )
    
    @staticmethod
    def notify_new_message(message):
        """Notify when a new message is received"""
        title = "New Message"
        message_text = f"New message from {message.sender_name}: {message.subject or message.message_body[:50]}..."
        
        priority = 'high' if message.is_urgent else 'medium'
        notification_type = 'urgent' if message.is_urgent else 'info'
        
        return NotificationService.create_notification(
            title=title,
            message=message_text,
            notification_type=notification_type,
            priority=priority,
            tenant='default',
            action_url=f"/doctor/messages/{message.id}/"
        )
    
    @staticmethod
    def notify_sample_processed(sample, technician_name):
        """Notify when a sample is processed by technician"""
        title = "Sample Processed"
        message = f"Sample for {sample.patient_name} has been processed by {technician_name}"
        
        return NotificationService.create_notification(
            title=title,
            message=message,
            notification_type='success',
            priority='medium',
            tenant='default',
            action_url=f"/doctor/test-requests/{sample.test_request_id}/"
        )
    
    @staticmethod
    def notify_system_announcement(title, message, priority='medium'):
        """Send system-wide announcement"""
        return NotificationService.create_notification(
            title=title,
            message=message,
            notification_type='info',
            priority=priority,
            is_global=True,
            tenant='default',
            expires_in_hours=24
        )

