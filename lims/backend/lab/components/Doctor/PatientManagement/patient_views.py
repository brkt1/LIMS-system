from rest_framework import viewsets
from .patient_models import Patient
from .patient_serializers import PatientSerializer

class PatientViewSet(viewsets.ModelViewSet):
    queryset = Patient.objects.all()
    serializer_class = PatientSerializer
