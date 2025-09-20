from rest_framework import serializers
from .notification_models import Notification, NotificationPreference

class NotificationSerializer(serializers.ModelSerializer):
    recipient_name = serializers.CharField(source='recipient.username', read_only=True)
    
    class Meta:
        model = Notification
        fields = ['id', 'title', 'message', 'notification_type', 'priority', 'is_read', 
                 'is_global', 'recipient', 'recipient_name', 'tenant', 'action_url', 
                 'expires_at', 'created_at', 'updated_at']

class NotificationListSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notification
        fields = ['id', 'title', 'message', 'notification_type', 'priority', 'is_read', 
                 'action_url', 'created_at']

class NotificationPreferenceSerializer(serializers.ModelSerializer):
    class Meta:
        model = NotificationPreference
        fields = ['id', 'email_enabled', 'push_enabled', 'sms_enabled', 'notification_types', 
                 'created_at', 'updated_at']
