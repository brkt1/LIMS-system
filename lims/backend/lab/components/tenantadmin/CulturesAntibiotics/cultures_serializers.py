from rest_framework import serializers
from .cultures_models import Culture, AntibioticSensitivity

class AntibioticSensitivitySerializer(serializers.ModelSerializer):
    class Meta:
        model = AntibioticSensitivity
        fields = [
            'id', 'culture', 'antibiotic_name', 'sensitivity', 'mic_value',
            'zone_diameter', 'notes', 'tested_date', 'tenant', 'created_by',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']
        extra_kwargs = {
            'created_by': {'required': False, 'allow_blank': True, 'allow_null': True}
        }

class CultureSerializer(serializers.ModelSerializer):
    antibiotic_sensitivities = AntibioticSensitivitySerializer(many=True, read_only=True)
    
    class Meta:
        model = Culture
        fields = [
            'id', 'patient_name', 'patient_id', 'specimen_type', 'culture_type',
            'organism', 'collection_date', 'technician', 'notes', 'status',
            'report_date', 'tenant', 'created_by', 'created_at', 'updated_at',
            'antibiotic_sensitivities'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']
        extra_kwargs = {
            'created_by': {'required': False, 'allow_blank': True, 'allow_null': True}
        }

    def create(self, validated_data):
        # Set default created_by if not provided
        if 'created_by' not in validated_data:
            validated_data['created_by'] = 'system'
        return super().create(validated_data)

class CultureListSerializer(serializers.ModelSerializer):
    """Simplified serializer for list views"""
    class Meta:
        model = Culture
        fields = [
            'id', 'patient_name', 'patient_id', 'specimen_type', 'culture_type',
            'organism', 'collection_date', 'status', 'report_date'
        ]

class AntibioticSensitivityListSerializer(serializers.ModelSerializer):
    """Simplified serializer for antibiotic sensitivity list views"""
    class Meta:
        model = AntibioticSensitivity
        fields = [
            'id', 'culture', 'antibiotic_name', 'sensitivity', 'mic_value',
            'zone_diameter', 'tested_date'
        ]
