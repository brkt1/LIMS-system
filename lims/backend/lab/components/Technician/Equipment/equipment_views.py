from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import filters
from .equipment_models import Equipment, EquipmentCalibration, EquipmentMaintenance
from .equipment_serializers import EquipmentSerializer, EquipmentListSerializer, EquipmentCalibrationSerializer, EquipmentMaintenanceSerializer

class EquipmentViewSet(viewsets.ModelViewSet):
    queryset = Equipment.objects.all()
    serializer_class = EquipmentSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['status', 'priority', 'department', 'tenant']
    search_fields = ['name', 'model', 'serial_number', 'location']
    ordering_fields = ['name', 'created_at', 'status']
    ordering = ['name']
    
    def get_serializer_class(self):
        if self.action == 'list':
            return EquipmentListSerializer
        return EquipmentSerializer
    
    @action(detail=True, methods=['post'])
    def calibrate(self, request, pk=None):
        equipment = self.get_object()
        calibration_data = {
            'equipment': equipment.id,
            'calibration_date': request.data.get('calibration_date'),
            'next_calibration_date': request.data.get('next_calibration_date'),
            'calibrated_by': request.data.get('calibrated_by'),
            'notes': request.data.get('notes', ''),
            'certificate_number': request.data.get('certificate_number', '')
        }
        
        serializer = EquipmentCalibrationSerializer(data=calibration_data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=True, methods=['post'])
    def maintain(self, request, pk=None):
        equipment = self.get_object()
        maintenance_data = {
            'equipment': equipment.id,
            'maintenance_date': request.data.get('maintenance_date'),
            'maintenance_type': request.data.get('maintenance_type'),
            'performed_by': request.data.get('performed_by'),
            'description': request.data.get('description'),
            'parts_replaced': request.data.get('parts_replaced', ''),
            'cost': request.data.get('cost'),
            'next_maintenance_due': request.data.get('next_maintenance_due')
        }
        
        serializer = EquipmentMaintenanceSerializer(data=maintenance_data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=True, methods=['post'])
    def update_status(self, request, pk=None):
        equipment = self.get_object()
        new_status = request.data.get('status')
        
        if new_status in dict(Equipment.STATUS_CHOICES):
            equipment.status = new_status
            equipment.save()
            return Response({'status': 'Equipment status updated successfully'})
        return Response({'error': 'Invalid status'}, status=status.HTTP_400_BAD_REQUEST)

class EquipmentCalibrationViewSet(viewsets.ModelViewSet):
    queryset = EquipmentCalibration.objects.all()
    serializer_class = EquipmentCalibrationSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['equipment', 'calibrated_by']

class EquipmentMaintenanceViewSet(viewsets.ModelViewSet):
    queryset = EquipmentMaintenance.objects.all()
    serializer_class = EquipmentMaintenanceSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['equipment', 'maintenance_type', 'performed_by']
