from rest_framework import serializers
from .equipment_models import Equipment

class EquipmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Equipment
        fields = [
            'id', 'name', 'type', 'category', 'serial_number', 'manufacturer', 'model',
            'status', 'location', 'purchase_date', 'warranty_expiry', 'last_maintenance',
            'next_maintenance', 'maintenance_interval', 'responsible', 'cost', 'condition',
            'tenant', 'created_by', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']
        extra_kwargs = {
            'created_by': {'required': False, 'allow_blank': True, 'allow_null': True}
        }

    def validate_serial_number(self, value):
        # Check if serial number is unique within the tenant
        tenant_id = self.initial_data.get('tenant')
        if tenant_id:
            existing_equipment = Equipment.objects.filter(
                serial_number=value, 
                tenant_id=tenant_id
            ).exclude(pk=self.instance.pk if self.instance else None)
            if existing_equipment.exists():
                raise serializers.ValidationError("Equipment with this serial number already exists in this tenant.")
        return value

    def create(self, validated_data):
        # Set default created_by if not provided
        if 'created_by' not in validated_data:
            validated_data['created_by'] = 'system'
        return super().create(validated_data)

class EquipmentListSerializer(serializers.ModelSerializer):
    """Simplified serializer for list views"""
    class Meta:
        model = Equipment
        fields = [
            'id', 'name', 'type', 'category', 'serial_number', 'manufacturer', 'model',
            'status', 'location', 'condition', 'cost'
        ]
