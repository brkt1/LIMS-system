from rest_framework import serializers
from .doctor_models import Doctor, TestRequest, PatientRecord, TestResult, DoctorAppointment

class DoctorSerializer(serializers.ModelSerializer):
    supervisor_name = serializers.CharField(source='supervisor.name', read_only=True)
    is_available_today = serializers.ReadOnlyField()
    current_patient_load = serializers.ReadOnlyField()
    
    class Meta:
        model = Doctor
        fields = [
            'id', 'name', 'email', 'specialty', 'license_number', 'phone',
            'experience', 'education', 'schedule', 'status', 'total_patients',
            'rating', 'join_date', 'tenant', 'created_by', 'created_at', 'updated_at',
            'certification_level', 'years_experience', 'languages_spoken', 'consultation_fee',
            'max_daily_appointments', 'emergency_contact', 'notes', 'can_prescribe',
            'can_order_tests', 'can_review_results', 'requires_supervision', 'supervisor',
            'supervisor_name', 'is_available_today', 'current_patient_load'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at', 'join_date', 'total_patients', 'rating']
        extra_kwargs = {
            'created_by': {'required': False, 'allow_blank': True, 'allow_null': True}
        }

    def validate_email(self, value):
        # Check if email is unique within the tenant
        tenant_id = self.initial_data.get('tenant')
        if tenant_id:
            existing_doctor = Doctor.objects.filter(email=value, tenant_id=tenant_id).exclude(pk=self.instance.pk if self.instance else None)
            if existing_doctor.exists():
                raise serializers.ValidationError("A doctor with this email already exists in this tenant.")
        return value

    def create(self, validated_data):
        # Set default created_by if not provided
        if 'created_by' not in validated_data:
            validated_data['created_by'] = 'system'  # Default value
        return super().create(validated_data)

    def validate_license_number(self, value):
        # Check if license number is unique
        existing_doctor = Doctor.objects.filter(license_number=value).exclude(pk=self.instance.pk if self.instance else None)
        if existing_doctor.exists():
            raise serializers.ValidationError("A doctor with this license number already exists.")
        return value

class DoctorListSerializer(serializers.ModelSerializer):
    """Simplified serializer for list views"""
    supervisor_name = serializers.CharField(source='supervisor.name', read_only=True)
    is_available_today = serializers.ReadOnlyField()
    
    class Meta:
        model = Doctor
        fields = [
            'id', 'name', 'email', 'specialty', 'license_number', 'phone',
            'status', 'total_patients', 'rating', 'join_date', 'certification_level',
            'years_experience', 'consultation_fee', 'supervisor_name', 'is_available_today'
        ]


class TestRequestSerializer(serializers.ModelSerializer):
    doctor_name = serializers.CharField(source='doctor.name', read_only=True)
    
    class Meta:
        model = TestRequest
        fields = [
            'id', 'doctor', 'doctor_name', 'patient_id', 'test_type', 'test_description',
            'priority', 'status', 'requested_date', 'required_date', 'technician_notes',
            'doctor_notes', 'tenant', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at', 'requested_date']


class PatientRecordSerializer(serializers.ModelSerializer):
    doctor_name = serializers.CharField(source='doctor.name', read_only=True)
    
    class Meta:
        model = PatientRecord
        fields = [
            'id', 'patient_id', 'doctor', 'doctor_name', 'visit_date', 'chief_complaint',
            'diagnosis', 'treatment_plan', 'prescriptions', 'follow_up_required',
            'follow_up_date', 'notes', 'tenant', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']


class TestResultSerializer(serializers.ModelSerializer):
    doctor_name = serializers.CharField(source='doctor.name', read_only=True)
    test_type = serializers.CharField(source='test_request.test_type', read_only=True)
    
    class Meta:
        model = TestResult
        fields = [
            'id', 'test_request', 'patient_id', 'doctor', 'doctor_name', 'test_type',
            'result_data', 'result_summary', 'status', 'reviewed_at', 'doctor_notes',
            'tenant', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']


class DoctorAppointmentSerializer(serializers.ModelSerializer):
    doctor_name = serializers.CharField(source='doctor.name', read_only=True)
    
    class Meta:
        model = DoctorAppointment
        fields = [
            'id', 'doctor', 'doctor_name', 'patient_id', 'appointment_date',
            'duration_minutes', 'appointment_type', 'status', 'reason', 'notes',
            'tenant', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']
