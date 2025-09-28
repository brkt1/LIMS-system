from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .equipment_views import EquipmentViewSet, EquipmentCalibrationViewSet, EquipmentMaintenanceViewSet

router = DefaultRouter()
router.register(r'', EquipmentViewSet, basename='equipment')
router.register(r'calibrations', EquipmentCalibrationViewSet)
router.register(r'maintenance', EquipmentMaintenanceViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
