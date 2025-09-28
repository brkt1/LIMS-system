from rest_framework import serializers
from lab.models import TestReport

class TestReportSerializer(serializers.ModelSerializer):
    # Add computed fields for better API response
    patient_name_display = serializers.SerializerMethodField()
    doctor_name_display = serializers.SerializerMethodField()
    
    class Meta:
        model = TestReport
        fields = '__all__'
    
    def get_patient_name_display(self, obj):
        return obj.patient_name or (obj.test_request.patient_name if obj.test_request else "Unknown Patient")
    
    def get_doctor_name_display(self, obj):
        return obj.doctor_name or (getattr(obj.test_request, 'doctor_name', None) if obj.test_request else "Unknown Doctor")
