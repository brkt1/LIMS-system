from rest_framework import serializers
from .support_ticket_models import SupportTicket, SupportMessage, SupportAttachment

class SupportAttachmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = SupportAttachment
        fields = ['id', 'filename', 'file_size', 'file', 'created_at']

class SupportMessageSerializer(serializers.ModelSerializer):
    attachments = SupportAttachmentSerializer(many=True, read_only=True)
    sender_name = serializers.CharField(source='sender.username', read_only=True)
    
    class Meta:
        model = SupportMessage
        fields = ['id', 'message', 'sender', 'sender_name', 'is_internal', 'attachments', 'created_at']

class SupportTicketSerializer(serializers.ModelSerializer):
    messages = SupportMessageSerializer(many=True, read_only=True)
    created_by_name = serializers.CharField(source='created_by.username', read_only=True)
    assigned_to_name = serializers.CharField(source='assigned_to.username', read_only=True)
    message_count = serializers.SerializerMethodField()
    
    class Meta:
        model = SupportTicket
        fields = ['id', 'title', 'description', 'status', 'priority', 'created_by', 'created_by_name', 
                 'assigned_to', 'assigned_to_name', 'tenant', 'message_count', 'messages', 'created_at', 'updated_at']
    
    def get_message_count(self, obj):
        return obj.messages.count()

class SupportTicketListSerializer(serializers.ModelSerializer):
    created_by_name = serializers.CharField(source='created_by.username', read_only=True)
    assigned_to_name = serializers.CharField(source='assigned_to.username', read_only=True)
    message_count = serializers.SerializerMethodField()
    last_message = serializers.SerializerMethodField()
    
    class Meta:
        model = SupportTicket
        fields = ['id', 'title', 'status', 'priority', 'created_by_name', 'assigned_to_name', 
                 'message_count', 'last_message', 'created_at', 'updated_at']
    
    def get_message_count(self, obj):
        return obj.messages.count()
    
    def get_last_message(self, obj):
        last_msg = obj.messages.last()
        if last_msg:
            return {
                'message': last_msg.message[:100] + '...' if len(last_msg.message) > 100 else last_msg.message,
                'sender': last_msg.sender.username,
                'created_at': last_msg.created_at
            }
        return None
