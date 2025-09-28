from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .patient_views import (
    PatientViewSet, AppointmentViewSet, TestResultViewSet,
    MessageViewSet, SupportTicketViewSet, PatientNotificationViewSet
)

# Create router and register viewsets
router = DefaultRouter()
router.register(r'patients', PatientViewSet, basename='patient')
router.register(r'appointments', AppointmentViewSet, basename='appointment')
router.register(r'test-results', TestResultViewSet, basename='testresult')
router.register(r'messages', MessageViewSet, basename='message')
router.register(r'support-tickets', SupportTicketViewSet, basename='supportticket')
router.register(r'notifications', PatientNotificationViewSet, basename='patientnotification')

urlpatterns = [
    path('', include(router.urls)),
]
