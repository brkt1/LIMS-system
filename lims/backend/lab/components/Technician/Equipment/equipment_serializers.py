from rest_framework import serializers
from .equipment_models import Equipment, EquipmentCalibration, EquipmentMaintenance

class EquipmentCalibrationSerializer(serializers.ModelSerializer):
    class Meta:
        model = EquipmentCalibration
        fields = ['id', 'calibration_date', 'next_calibration_date', 'calibrated_by', 
                 'notes', 'certificate_number', 'created_at']

class EquipmentMaintenanceSerializer(serializers.ModelSerializer):
    class Meta:
        model = EquipmentMaintenance
        fields = ['id', 'maintenance_date', 'maintenance_type', 'performed_by', 
                 'description', 'parts_replaced', 'cost', 'next_maintenance_due', 'created_at']

class EquipmentSerializer(serializers.ModelSerializer):
    calibrations = EquipmentCalibrationSerializer(many=True, read_only=True)
    maintenance_records = EquipmentMaintenanceSerializer(many=True, read_only=True)
    last_calibration = serializers.SerializerMethodField()
    last_maintenance = serializers.SerializerMethodField()
    
    class Meta:
        model = Equipment
        fields = ['id', 'name', 'model', 'serial_number', 'department', 'status', 
                 'priority', 'location', 'supplier', 'notes', 'tenant', 
                 'last_calibration', 'last_maintenance', 'calibrations', 
                 'maintenance_records', 'created_at', 'updated_at']
    
    def get_last_calibration(self, obj):
        last_cal = obj.calibrations.first()
        if last_cal:
            return {
                'calibration_date': last_cal.calibration_date,
                'next_calibration_date': last_cal.next_calibration_date,
                'calibrated_by': last_cal.calibrated_by
            }
        return None
    
    def get_last_maintenance(self, obj):
        last_maint = obj.maintenance_records.first()
        if last_maint:
            return {
                'maintenance_date': last_maint.maintenance_date,
                'maintenance_type': last_maint.maintenance_type,
                'performed_by': last_maint.performed_by
            }
        return None

class EquipmentListSerializer(serializers.ModelSerializer):
    last_calibration = serializers.SerializerMethodField()
    last_maintenance = serializers.SerializerMethodField()
    
    class Meta:
        model = Equipment
        fields = ['id', 'name', 'model', 'serial_number', 'department', 'status', 
                 'priority', 'location', 'last_calibration', 'last_maintenance', 'created_at']
    
    def get_last_calibration(self, obj):
        last_cal = obj.calibrations.first()
        if last_cal:
            return {
                'calibration_date': last_cal.calibration_date,
                'next_calibration_date': last_cal.next_calibration_date
            }
        return None
    
    def get_last_maintenance(self, obj):
        last_maint = obj.maintenance_records.first()
        if last_maint:
            return {
                'maintenance_date': last_maint.maintenance_date,
                'maintenance_type': last_maint.maintenance_type
            }
        return None
