from rest_framework import serializers
from lab.models import Sample, Technician
from .sample_model import TestRequest

class TestRequestSerializer(serializers.ModelSerializer):
    class Meta:
        model = TestRequest
        fields = '__all__'

class SampleSerializer(serializers.ModelSerializer):
    sample_type_display = serializers.CharField(source='get_sample_type_display', read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    priority_display = serializers.CharField(source='get_priority_display', read_only=True)
    technician_name = serializers.CharField(source='technician.full_name', read_only=True)
    
    class Meta:
        model = Sample
        fields = [
            'id', 'patient_id', 'test_request_id', 'sample_type', 'sample_type_display',
            'collection_date', 'received_date', 'technician', 'technician_name',
            'status', 'status_display', 'priority', 'priority_display', 'volume',
            'container_type', 'storage_conditions', 'expiry_date', 'collection_notes',
            'processing_notes', 'rejection_reason', 'tenant_id', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']
