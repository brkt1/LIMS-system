from rest_framework import serializers
from .support_ticket_models import (
    SupportTicket, SupportMessage, SupportAttachment, SupportStaff, 
    SupportTeam, SupportSLA, SupportAnalytics
)

class SupportAttachmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = SupportAttachment
        fields = ['id', 'filename', 'file_size', 'file', 'created_at']

class SupportMessageSerializer(serializers.ModelSerializer):
    attachments = SupportAttachmentSerializer(many=True, read_only=True)
    sender_name = serializers.CharField(source='sender.username', read_only=True)
    
    class Meta:
        model = SupportMessage
        fields = ['id', 'message', 'sender', 'sender_name', 'is_internal', 'is_auto_generated', 
                 'message_type', 'attachments', 'created_at']

class SupportTicketSerializer(serializers.ModelSerializer):
    messages = SupportMessageSerializer(many=True, read_only=True)
    created_by_name = serializers.CharField(source='created_by.username', read_only=True)
    assigned_to_name = serializers.CharField(source='assigned_to.username', read_only=True)
    message_count = serializers.SerializerMethodField()
    response_time_hours = serializers.ReadOnlyField()
    resolution_time_hours = serializers.ReadOnlyField()
    
    class Meta:
        model = SupportTicket
        fields = [
            'id', 'title', 'description', 'status', 'priority', 'category', 'created_by', 'created_by_name', 
            'assigned_to', 'assigned_to_name', 'tenant', 'reporter_name', 'reporter_email', 'reporter_phone',
            'tags', 'estimated_resolution_time', 'actual_resolution_time', 'first_response_time',
            'satisfaction_rating', 'satisfaction_feedback', 'escalation_level', 'is_escalated',
            'escalation_reason', 'resolution_notes', 'internal_notes', 'message_count', 'messages',
            'response_time_hours', 'resolution_time_hours', 'created_at', 'updated_at'
        ]
    
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
                 'message_count', 'last_message', 'tags', 'created_at', 'updated_at']
    
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


class SupportStaffSerializer(serializers.ModelSerializer):
    user_name = serializers.CharField(source='user.get_full_name', read_only=True)
    user_email = serializers.CharField(source='user.email', read_only=True)
    workload_percentage = serializers.ReadOnlyField()
    is_overloaded = serializers.ReadOnlyField()
    
    class Meta:
        model = SupportStaff
        fields = [
            'id', 'user', 'user_name', 'user_email', 'employee_id', 'specialization', 'level', 'tenant',
            'total_tickets_resolved', 'average_resolution_time', 'customer_satisfaction_rating', 'escalation_rate',
            'max_concurrent_tickets', 'current_ticket_count', 'is_available', 'working_hours_start', 'working_hours_end',
            'timezone', 'skills', 'certifications', 'languages_spoken', 'phone', 'emergency_contact',
            'workload_percentage', 'is_overloaded', 'created_at', 'updated_at'
        ]


class SupportTeamSerializer(serializers.ModelSerializer):
    team_lead_name = serializers.CharField(source='team_lead.user.get_full_name', read_only=True)
    member_count = serializers.SerializerMethodField()
    members = SupportStaffSerializer(many=True, read_only=True)
    
    class Meta:
        model = SupportTeam
        fields = [
            'id', 'name', 'description', 'tenant', 'team_lead', 'team_lead_name', 'members', 'member_count',
            'team_sla_target', 'team_satisfaction_target', 'created_at', 'updated_at'
        ]
    
    def get_member_count(self, obj):
        return obj.members.count()


class SupportSLASerializer(serializers.ModelSerializer):
    class Meta:
        model = SupportSLA
        fields = [
            'id', 'name', 'tenant', 'priority', 'category', 'first_response_time', 'resolution_time',
            'escalation_time', 'escalation_level', 'is_active', 'created_at', 'updated_at'
        ]


class SupportAnalyticsSerializer(serializers.ModelSerializer):
    class Meta:
        model = SupportAnalytics
        fields = [
            'id', 'tenant', 'date', 'total_tickets', 'open_tickets', 'resolved_tickets', 'closed_tickets',
            'average_response_time', 'average_resolution_time', 'customer_satisfaction', 'escalation_rate',
            'active_support_staff', 'total_support_hours', 'created_at'
        ]
