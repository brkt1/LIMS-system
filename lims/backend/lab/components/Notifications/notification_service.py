from django.contrib.auth import get_user_model
from .notification_models import Notification
from django.utils import timezone
from datetime import timedelta
from typing import List, Optional, Dict, Any
import logging

User = get_user_model()
logger = logging.getLogger(__name__)

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
    
    @staticmethod
    def create_global_notification(
        title: str,
        message: str,
        notification_type: str = 'info',
        priority: str = 'medium',
        target_audience: str = 'all',
        target_roles: List[str] = None,
        target_tenants: List[str] = None,
        action_url: str = None,
        expires_in_hours: int = 24,
        created_by: str = 'system'
    ) -> Dict[str, Any]:
        """
        Create a global notification that can be targeted to specific audiences
        
        Args:
            title: Notification title
            message: Notification message
            notification_type: Type of notification (info, warning, error, success, urgent)
            priority: Priority level (low, medium, high, critical)
            target_audience: Who should receive this (all, tenants, roles, specific)
            target_roles: List of roles to target (if target_audience is 'roles')
            target_tenants: List of tenants to target (if target_audience is 'tenants')
            action_url: Optional URL for action
            expires_in_hours: Hours until notification expires
            created_by: Who created this notification
        
        Returns:
            Dict with notification details and delivery stats
        """
        try:
            expires_at = None
            if expires_in_hours:
                expires_at = timezone.now() + timedelta(hours=expires_in_hours)
            
            # Create the global notification
            notification = Notification.objects.create(
                title=title,
                message=message,
                notification_type=notification_type,
                priority=priority,
                is_global=True,
                action_url=action_url,
                expires_at=expires_at
            )
            
            # Determine recipients based on target audience
            recipients = []
            if target_audience == 'all':
                recipients = list(User.objects.filter(is_active=True).values_list('id', flat=True))
            elif target_audience == 'roles' and target_roles:
                recipients = list(User.objects.filter(
                    is_active=True,
                    role__in=target_roles
                ).values_list('id', flat=True))
            elif target_audience == 'tenants' and target_tenants:
                recipients = list(User.objects.filter(
                    is_active=True,
                    tenant__in=target_tenants
                ).values_list('id', flat=True))
            
            # Create individual notifications for each recipient
            individual_notifications = []
            for recipient_id in recipients:
                individual_notification = Notification.objects.create(
                    title=title,
                    message=message,
                    notification_type=notification_type,
                    priority=priority,
                    recipient_id=recipient_id,
                    is_global=True,
                    action_url=action_url,
                    expires_at=expires_at
                )
                individual_notifications.append(individual_notification)
            
            logger.info(f"✅ Global notification created: {title} for {len(recipients)} recipients")
            
            return {
                'success': True,
                'notification_id': notification.id,
                'total_recipients': len(recipients),
                'delivered_count': len(individual_notifications),
                'message': f'Global notification sent to {len(recipients)} recipients'
            }
            
        except Exception as e:
            logger.error(f"❌ Error creating global notification: {e}")
            return {
                'success': False,
                'error': str(e),
                'message': 'Failed to create global notification'
            }
    
    @staticmethod
    def send_global_notification_to_roles(
        title: str,
        message: str,
        roles: List[str],
        notification_type: str = 'info',
        priority: str = 'medium',
        action_url: str = None,
        expires_in_hours: int = 24
    ) -> Dict[str, Any]:
        """Send notification to specific roles"""
        return NotificationService.create_global_notification(
            title=title,
            message=message,
            notification_type=notification_type,
            priority=priority,
            target_audience='roles',
            target_roles=roles,
            action_url=action_url,
            expires_in_hours=expires_in_hours
        )
    
    @staticmethod
    def send_global_notification_to_tenants(
        title: str,
        message: str,
        tenants: List[str],
        notification_type: str = 'info',
        priority: str = 'medium',
        action_url: str = None,
        expires_in_hours: int = 24
    ) -> Dict[str, Any]:
        """Send notification to specific tenants"""
        return NotificationService.create_global_notification(
            title=title,
            message=message,
            notification_type=notification_type,
            priority=priority,
            target_audience='tenants',
            target_tenants=tenants,
            action_url=action_url,
            expires_in_hours=expires_in_hours
        )
    
    @staticmethod
    def send_maintenance_notification(
        title: str,
        message: str,
        maintenance_type: str = 'scheduled',
        priority: str = 'high',
        affected_services: List[str] = None
    ) -> Dict[str, Any]:
        """Send system maintenance notification"""
        full_message = f"{message}"
        if affected_services:
            full_message += f"\n\nAffected services: {', '.join(affected_services)}"
        
        return NotificationService.create_global_notification(
            title=f"System Maintenance: {title}",
            message=full_message,
            notification_type='warning',
            priority=priority,
            target_audience='all',
            expires_in_hours=48
        )
    
    @staticmethod
    def send_security_alert(
        title: str,
        message: str,
        severity: str = 'medium',
        action_required: bool = False
    ) -> Dict[str, Any]:
        """Send security alert notification"""
        priority = 'critical' if severity == 'high' else 'high' if severity == 'medium' else 'medium'
        notification_type = 'urgent' if action_required else 'warning'
        
        full_message = f"SECURITY ALERT: {message}"
        if action_required:
            full_message += "\n\nIMMEDIATE ACTION REQUIRED"
        
        return NotificationService.create_global_notification(
            title=f"Security Alert: {title}",
            message=full_message,
            notification_type=notification_type,
            priority=priority,
            target_audience='all',
            expires_in_hours=72
        )
    
    @staticmethod
    def get_user_notifications(
        user_id: int,
        include_read: bool = False,
        limit: int = 50,
        notification_type: str = None
    ) -> List[Dict[str, Any]]:
        """Get notifications for a specific user"""
        try:
            queryset = Notification.objects.filter(
                recipient_id=user_id
            ).order_by('-created_at')
            
            if not include_read:
                queryset = queryset.filter(is_read=False)
            
            if notification_type:
                queryset = queryset.filter(notification_type=notification_type)
            
            if limit:
                queryset = queryset[:limit]
            
            notifications = []
            for notification in queryset:
                notifications.append({
                    'id': notification.id,
                    'title': notification.title,
                    'message': notification.message,
                    'notification_type': notification.notification_type,
                    'priority': notification.priority,
                    'is_read': notification.is_read,
                    'is_global': notification.is_global,
                    'action_url': notification.action_url,
                    'created_at': notification.created_at.isoformat(),
                    'expires_at': notification.expires_at.isoformat() if notification.expires_at else None
                })
            
            return notifications
            
        except Exception as e:
            logger.error(f"❌ Error getting user notifications: {e}")
            return []
    
    @staticmethod
    def mark_notification_as_read(notification_id: int, user_id: int) -> bool:
        """Mark a notification as read for a specific user"""
        try:
            notification = Notification.objects.get(
                id=notification_id,
                recipient_id=user_id
            )
            notification.is_read = True
            notification.save()
            return True
        except Notification.DoesNotExist:
            logger.warning(f"Notification {notification_id} not found for user {user_id}")
            return False
        except Exception as e:
            logger.error(f"❌ Error marking notification as read: {e}")
            return False
    
    @staticmethod
    def get_unread_count(user_id: int) -> int:
        """Get unread notification count for a user"""
        try:
            return Notification.objects.filter(
                recipient_id=user_id,
                is_read=False
            ).count()
        except Exception as e:
            logger.error(f"❌ Error getting unread count: {e}")
            return 0



