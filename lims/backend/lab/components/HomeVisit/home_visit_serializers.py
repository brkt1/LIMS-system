from rest_framework import serializers
from .home_visit_models import HomeVisitRequest, HomeVisitSchedule

class HomeVisitRequestSerializer(serializers.ModelSerializer):
    class Meta:
        model = HomeVisitRequest
        fields = '__all__'
        read_only_fields = ['created_at', 'updated_at', 'approved_at', 'completed_at']

class HomeVisitRequestListSerializer(serializers.ModelSerializer):
    class Meta:
        model = HomeVisitRequest
        fields = [
            'id', 'patient_name', 'patient_id', 'address', 'phone', 
            'requested_date', 'requested_time', 'service_type', 'doctor', 
            'priority', 'status', 'created_at'
        ]

class HomeVisitScheduleSerializer(serializers.ModelSerializer):
    class Meta:
        model = HomeVisitSchedule
        fields = '__all__'
        read_only_fields = ['created_at', 'updated_at', 'started_at', 'completed_at']

class HomeVisitScheduleListSerializer(serializers.ModelSerializer):
    patient_name = serializers.CharField(source='visit_request.patient_name', read_only=True)
    patient_id = serializers.CharField(source='visit_request.patient_id', read_only=True)
    address = serializers.CharField(source='visit_request.address', read_only=True)
    phone = serializers.CharField(source='visit_request.phone', read_only=True)
    service_type = serializers.CharField(source='visit_request.service_type', read_only=True)
    
    class Meta:
        model = HomeVisitSchedule
        fields = [
            'id', 'patient_name', 'patient_id', 'address', 'phone', 
            'doctor', 'scheduled_date', 'scheduled_time', 'estimated_duration', 
            'status', 'service_type', 'created_at'
        ]
