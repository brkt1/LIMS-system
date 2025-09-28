from rest_framework import serializers
from django.contrib.auth.models import User
from .patient_models import (
    Patient, Appointment, TestResult, Message, 
    SupportTicket, PatientNotification
)


class PatientSerializer(serializers.ModelSerializer):
    """Serializer for Patient model"""
    full_name = serializers.ReadOnlyField()
    age = serializers.ReadOnlyField()
    
    class Meta:
        model = Patient
        fields = [
            'id', 'patient_id', 'user', 'first_name', 'last_name', 'full_name',
            'email', 'phone', 'date_of_birth', 'age', 'gender', 'blood_type',
            'address', 'city', 'state', 'zip_code', 'country',
            'emergency_contact_name', 'emergency_contact_phone', 'emergency_contact_relationship',
            'insurance_provider', 'insurance_number', 'insurance_group_number',
            'medical_history', 'allergies', 'current_medications', 'chronic_conditions',
            'bio', 'timezone', 'language',
            'email_notifications', 'sms_notifications', 'push_notifications',
            'status', 'last_visit', 'created_at', 'updated_at', 'created_by'
        ]
        read_only_fields = ['id', 'patient_id', 'created_at', 'updated_at', 'full_name', 'age']


class PatientListSerializer(serializers.ModelSerializer):
    """Simplified serializer for Patient list views"""
    full_name = serializers.ReadOnlyField()
    age = serializers.ReadOnlyField()
    
    class Meta:
        model = Patient
        fields = [
            'id', 'patient_id', 'first_name', 'last_name', 'full_name',
            'email', 'phone', 'date_of_birth', 'age', 'gender', 'blood_type',
            'status', 'last_visit', 'created_at'
        ]


class AppointmentSerializer(serializers.ModelSerializer):
    """Serializer for Appointment model"""
    patient_name = serializers.CharField(source='patient.full_name', read_only=True)
    doctor_name = serializers.CharField(source='doctor.get_full_name', read_only=True)
    
    class Meta:
        model = Appointment
        fields = [
            'id', 'appointment_id', 'patient', 'patient_name', 'doctor', 'doctor_name',
            'appointment_date', 'appointment_time', 'duration', 'appointment_type',
            'location', 'room_number', 'video_link',
            'reason', 'notes', 'status',
            'follow_up_required', 'follow_up_date', 'follow_up_notes',
            'created_at', 'updated_at', 'created_by'
        ]
        read_only_fields = ['id', 'appointment_id', 'created_at', 'updated_at', 'patient_name', 'doctor_name']


class AppointmentListSerializer(serializers.ModelSerializer):
    """Simplified serializer for Appointment list views"""
    patient_name = serializers.CharField(source='patient.full_name', read_only=True)
    doctor_name = serializers.CharField(source='doctor.get_full_name', read_only=True)
    
    class Meta:
        model = Appointment
        fields = [
            'id', 'appointment_id', 'patient', 'patient_name', 'doctor', 'doctor_name',
            'appointment_date', 'appointment_time', 'appointment_type', 'status',
            'reason', 'created_at'
        ]


class TestResultSerializer(serializers.ModelSerializer):
    """Serializer for TestResult model"""
    patient_name = serializers.CharField(source='patient.full_name', read_only=True)
    doctor_name = serializers.CharField(source='doctor.get_full_name', read_only=True)
    technician_name = serializers.CharField(source='technician.get_full_name', read_only=True)
    
    class Meta:
        model = TestResult
        fields = [
            'id', 'test_id', 'patient', 'patient_name', 'doctor', 'doctor_name',
            'technician', 'technician_name', 'test_name', 'test_category', 'test_code',
            'test_date', 'result_date', 'status',
            'result_value', 'normal_range', 'units', 'interpretation',
            'notes', 'is_abnormal', 'is_critical', 'result_file',
            'created_at', 'updated_at', 'created_by'
        ]
        read_only_fields = [
            'id', 'test_id', 'created_at', 'updated_at', 
            'patient_name', 'doctor_name', 'technician_name'
        ]


class TestResultListSerializer(serializers.ModelSerializer):
    """Simplified serializer for TestResult list views"""
    patient_name = serializers.CharField(source='patient.full_name', read_only=True)
    doctor_name = serializers.CharField(source='doctor.get_full_name', read_only=True)
    
    class Meta:
        model = TestResult
        fields = [
            'id', 'test_id', 'patient', 'patient_name', 'doctor', 'doctor_name',
            'test_name', 'test_category', 'test_date', 'result_date', 'status',
            'is_abnormal', 'is_critical', 'created_at'
        ]


class MessageSerializer(serializers.ModelSerializer):
    """Serializer for Message model"""
    sender_name = serializers.CharField(source='sender.get_full_name', read_only=True)
    recipient_name = serializers.CharField(source='recipient.get_full_name', read_only=True)
    patient_name = serializers.CharField(source='patient.full_name', read_only=True)
    
    class Meta:
        model = Message
        fields = [
            'id', 'message_id', 'sender', 'sender_name', 'recipient', 'recipient_name',
            'patient', 'patient_name', 'subject', 'message', 'priority',
            'is_read', 'read_at', 'is_archived', 'attachment',
            'created_at', 'updated_at'
        ]
        read_only_fields = [
            'id', 'message_id', 'created_at', 'updated_at',
            'sender_name', 'recipient_name', 'patient_name', 'read_at'
        ]


class MessageListSerializer(serializers.ModelSerializer):
    """Simplified serializer for Message list views"""
    sender_name = serializers.CharField(source='sender.get_full_name', read_only=True)
    recipient_name = serializers.CharField(source='recipient.get_full_name', read_only=True)
    
    class Meta:
        model = Message
        fields = [
            'id', 'message_id', 'sender', 'sender_name', 'recipient', 'recipient_name',
            'subject', 'priority', 'is_read', 'created_at'
        ]


class SupportTicketSerializer(serializers.ModelSerializer):
    """Serializer for SupportTicket model"""
    patient_name = serializers.CharField(source='patient.full_name', read_only=True)
    assigned_to_name = serializers.CharField(source='assigned_to.get_full_name', read_only=True)
    resolved_by_name = serializers.CharField(source='resolved_by.get_full_name', read_only=True)
    
    class Meta:
        model = SupportTicket
        fields = [
            'id', 'ticket_id', 'patient', 'patient_name',
            'subject', 'description', 'category', 'priority', 'status',
            'assigned_to', 'assigned_to_name',
            'resolution', 'resolved_at', 'resolved_by', 'resolved_by_name',
            'attachment', 'created_at', 'updated_at'
        ]
        read_only_fields = [
            'id', 'ticket_id', 'created_at', 'updated_at',
            'patient_name', 'assigned_to_name', 'resolved_by_name', 'resolved_at'
        ]


class SupportTicketListSerializer(serializers.ModelSerializer):
    """Simplified serializer for SupportTicket list views"""
    patient_name = serializers.CharField(source='patient.full_name', read_only=True)
    assigned_to_name = serializers.CharField(source='assigned_to.get_full_name', read_only=True)
    
    class Meta:
        model = SupportTicket
        fields = [
            'id', 'ticket_id', 'patient', 'patient_name',
            'subject', 'category', 'priority', 'status',
            'assigned_to', 'assigned_to_name', 'created_at'
        ]


class PatientNotificationSerializer(serializers.ModelSerializer):
    """Serializer for PatientNotification model"""
    patient_name = serializers.CharField(source='patient.full_name', read_only=True)
    
    class Meta:
        model = PatientNotification
        fields = [
            'id', 'notification_id', 'patient', 'patient_name',
            'title', 'message', 'notification_type',
            'is_read', 'read_at', 'action_url', 'action_text',
            'created_at', 'expires_at'
        ]
        read_only_fields = [
            'id', 'notification_id', 'created_at', 'patient_name', 'read_at'
        ]


class PatientNotificationListSerializer(serializers.ModelSerializer):
    """Simplified serializer for PatientNotification list views"""
    class Meta:
        model = PatientNotification
        fields = [
            'id', 'notification_id', 'title', 'message', 'notification_type',
            'is_read', 'action_url', 'action_text', 'created_at'
        ]


# Nested serializers for detailed views
class PatientDetailSerializer(PatientSerializer):
    """Detailed serializer for Patient with related data"""
    appointments = AppointmentListSerializer(many=True, read_only=True)
    test_results = TestResultListSerializer(many=True, read_only=True)
    messages = MessageListSerializer(many=True, read_only=True)
    support_tickets = SupportTicketListSerializer(many=True, read_only=True)
    notifications = PatientNotificationListSerializer(many=True, read_only=True)
    
    class Meta(PatientSerializer.Meta):
        fields = PatientSerializer.Meta.fields + [
            'appointments', 'test_results', 'messages', 'support_tickets', 'notifications'
        ]


class AppointmentDetailSerializer(AppointmentSerializer):
    """Detailed serializer for Appointment with related data"""
    patient = PatientListSerializer(read_only=True)
    
    class Meta(AppointmentSerializer.Meta):
        fields = AppointmentSerializer.Meta.fields


class TestResultDetailSerializer(TestResultSerializer):
    """Detailed serializer for TestResult with related data"""
    patient = PatientListSerializer(read_only=True)
    
    class Meta(TestResultSerializer.Meta):
        fields = TestResultSerializer.Meta.fields


class MessageDetailSerializer(MessageSerializer):
    """Detailed serializer for Message with related data"""
    patient = PatientListSerializer(read_only=True)
    
    class Meta(MessageSerializer.Meta):
        fields = MessageSerializer.Meta.fields


class SupportTicketDetailSerializer(SupportTicketSerializer):
    """Detailed serializer for SupportTicket with related data"""
    patient = PatientListSerializer(read_only=True)
    
    class Meta(SupportTicketSerializer.Meta):
        fields = SupportTicketSerializer.Meta.fields
