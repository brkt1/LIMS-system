from rest_framework import viewsets
from .appointment_models import Appointment
from .appointment_serializers import AppointmentSerializer

class AppointmentViewSet(viewsets.ModelViewSet):
    queryset = Appointment.objects.all()
    serializer_class = AppointmentSerializer
