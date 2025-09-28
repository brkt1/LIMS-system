from rest_framework import serializers
from django.contrib.auth.models import User
from lab.models import (
    Technician, Sample, TestResult, QualityControl, LabWorkflow
)


class TechnicianSerializer(serializers.ModelSerializer):
    """Serializer for Technician model"""
    full_name = serializers.ReadOnlyField()
    email = serializers.ReadOnlyField()
    is_license_valid = serializers.ReadOnlyField()
    user_name = serializers.CharField(source='user.username', read_only=True)
    user_first_name = serializers.CharField(source='user.first_name', read_only=True)
    user_last_name = serializers.CharField(source='user.last_name', read_only=True)
    tenant_name = serializers.CharField(source='tenant.name', read_only=True)
    
    class Meta:
        model = Technician
        fields = [
            'id', 'user', 'employee_id', 'specialization', 'certification_level',
            'years_experience', 'license_number', 'license_expiry', 'phone',
            'emergency_contact', 'emergency_phone', 'status', 'hire_date', 'notes',
            'tenant', 'total_tests_processed', 'average_processing_time', 'quality_score',
            'created_at', 'updated_at', 'full_name', 'email', 'is_license_valid',
            'user_name', 'user_first_name', 'user_last_name', 'tenant_name'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at', 'total_tests_processed']


class TechnicianListSerializer(serializers.ModelSerializer):
    """Simplified serializer for Technician list views"""
    full_name = serializers.ReadOnlyField()
    email = serializers.ReadOnlyField()
    specialization_display = serializers.CharField(source='get_specialization_display', read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    
    class Meta:
        model = Technician
        fields = [
            'id', 'employee_id', 'full_name', 'email', 'specialization',
            'specialization_display', 'certification_level', 'status', 'status_display',
            'years_experience', 'total_tests_processed', 'quality_score'
        ]


class SampleSerializer(serializers.ModelSerializer):
    """Serializer for Sample model"""
    sample_type_display = serializers.CharField(source='get_sample_type_display', read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    priority_display = serializers.CharField(source='get_priority_display', read_only=True)
    technician_name = serializers.CharField(source='technician.full_name', read_only=True)
    test_request_id = serializers.CharField(source='test_request.id', read_only=True)
    test_type = serializers.CharField(source='test_request.test_type', read_only=True)
    doctor_name = serializers.CharField(source='test_request.doctor.full_name', read_only=True)
    tenant_name = serializers.CharField(source='tenant.name', read_only=True)
    
    class Meta:
        model = Sample
        fields = [
            'id', 'patient_id', 'test_request', 'sample_type', 'sample_type_display',
            'collection_date', 'received_date', 'technician', 'technician_name',
            'status', 'status_display', 'priority', 'priority_display', 'volume',
            'container_type', 'storage_conditions', 'expiry_date', 'collection_notes',
            'processing_notes', 'rejection_reason', 'tenant', 'tenant_name',
            'created_at', 'updated_at', 'test_request_id', 'test_type', 'doctor_name'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']


class SampleListSerializer(serializers.ModelSerializer):
    """Simplified serializer for Sample list views"""
    sample_type_display = serializers.CharField(source='get_sample_type_display', read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    priority_display = serializers.CharField(source='get_priority_display', read_only=True)
    technician_name = serializers.CharField(source='technician.full_name', read_only=True)
    test_type = serializers.CharField(source='test_request.test_type', read_only=True)
    
    class Meta:
        model = Sample
        fields = [
            'id', 'patient_id', 'sample_type', 'sample_type_display', 'status',
            'status_display', 'priority', 'priority_display', 'collection_date',
            'technician_name', 'test_type', 'volume'
        ]


class TestResultSerializer(serializers.ModelSerializer):
    """Serializer for TestResult model"""
    result_type_display = serializers.CharField(source='get_result_type_display', read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    technician_name = serializers.CharField(source='technician.full_name', read_only=True)
    equipment_name = serializers.CharField(source='equipment_used.name', read_only=True)
    reviewed_by_name = serializers.CharField(source='reviewed_by.full_name', read_only=True)
    sample_id = serializers.CharField(source='sample.id', read_only=True)
    patient_id = serializers.CharField(source='sample.patient_id', read_only=True)
    test_request_id = serializers.CharField(source='sample.test_request.id', read_only=True)
    tenant_name = serializers.CharField(source='tenant.name', read_only=True)
    
    class Meta:
        model = TestResult
        fields = [
            'id', 'sample', 'sample_id', 'patient_id', 'test_request_id',
            'test_name', 'test_code', 'result_type', 'result_type_display',
            'result_value', 'result_unit', 'reference_range', 'status', 'status_display',
            'technician', 'technician_name', 'equipment_used', 'equipment_name',
            'analysis_date', 'completion_date', 'reviewed_by', 'reviewed_by_name',
            'review_date', 'review_notes', 'is_abnormal', 'critical_value',
            'technician_notes', 'quality_control_passed', 'tenant', 'tenant_name',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']


class TestResultListSerializer(serializers.ModelSerializer):
    """Simplified serializer for TestResult list views"""
    result_type_display = serializers.CharField(source='get_result_type_display', read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    technician_name = serializers.CharField(source='technician.full_name', read_only=True)
    sample_id = serializers.CharField(source='sample.id', read_only=True)
    patient_id = serializers.CharField(source='sample.patient_id', read_only=True)
    
    class Meta:
        model = TestResult
        fields = [
            'id', 'sample_id', 'patient_id', 'test_name', 'test_code',
            'result_type', 'result_type_display', 'result_value', 'result_unit',
            'status', 'status_display', 'technician_name', 'analysis_date',
            'is_abnormal', 'critical_value'
        ]


class QualityControlSerializer(serializers.ModelSerializer):
    """Serializer for QualityControl model"""
    qc_type_display = serializers.CharField(source='get_qc_type_display', read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    technician_name = serializers.CharField(source='technician.full_name', read_only=True)
    equipment_name = serializers.CharField(source='equipment.name', read_only=True)
    tenant_name = serializers.CharField(source='tenant.name', read_only=True)
    
    class Meta:
        model = QualityControl
        fields = [
            'id', 'test_name', 'qc_type', 'qc_type_display', 'lot_number',
            'expected_value', 'actual_value', 'acceptable_range_min', 'acceptable_range_max',
            'status', 'status_display', 'technician', 'technician_name', 'equipment',
            'equipment_name', 'performed_date', 'notes', 'corrective_action',
            'tenant', 'tenant_name', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']


class QualityControlListSerializer(serializers.ModelSerializer):
    """Simplified serializer for QualityControl list views"""
    qc_type_display = serializers.CharField(source='get_qc_type_display', read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    technician_name = serializers.CharField(source='technician.full_name', read_only=True)
    equipment_name = serializers.CharField(source='equipment.name', read_only=True)
    
    class Meta:
        model = QualityControl
        fields = [
            'id', 'test_name', 'qc_type', 'qc_type_display', 'lot_number',
            'expected_value', 'actual_value', 'status', 'status_display',
            'technician_name', 'equipment_name', 'performed_date'
        ]


class LabWorkflowSerializer(serializers.ModelSerializer):
    """Serializer for LabWorkflow model"""
    workflow_type_display = serializers.CharField(source='get_workflow_type_display', read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    priority_display = serializers.CharField(source='get_priority_display', read_only=True)
    assigned_to_name = serializers.CharField(source='assigned_to.full_name', read_only=True)
    tenant_name = serializers.CharField(source='tenant.name', read_only=True)
    
    class Meta:
        model = LabWorkflow
        fields = [
            'id', 'workflow_type', 'workflow_type_display', 'title', 'description',
            'status', 'status_display', 'assigned_to', 'assigned_to_name', 'priority',
            'priority_display', 'due_date', 'completed_date', 'estimated_duration',
            'actual_duration', 'notes', 'tenant', 'tenant_name', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']


class LabWorkflowListSerializer(serializers.ModelSerializer):
    """Simplified serializer for LabWorkflow list views"""
    workflow_type_display = serializers.CharField(source='get_workflow_type_display', read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    priority_display = serializers.CharField(source='get_priority_display', read_only=True)
    assigned_to_name = serializers.CharField(source='assigned_to.full_name', read_only=True)
    
    class Meta:
        model = LabWorkflow
        fields = [
            'id', 'workflow_type', 'workflow_type_display', 'title', 'status',
            'status_display', 'assigned_to_name', 'priority', 'priority_display',
            'due_date', 'completed_date', 'estimated_duration', 'actual_duration'
        ]
