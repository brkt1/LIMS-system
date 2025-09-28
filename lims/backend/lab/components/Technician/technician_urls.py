from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .technician_views import (
    TechnicianViewSet, SampleViewSet, TestResultViewSet, 
    QualityControlViewSet, LabWorkflowViewSet
)

# Create router and register ViewSets
router = DefaultRouter()
router.register(r'technicians', TechnicianViewSet)
router.register(r'samples', SampleViewSet)
router.register(r'test-results', TestResultViewSet)
router.register(r'quality-controls', QualityControlViewSet)
router.register(r'workflows', LabWorkflowViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
