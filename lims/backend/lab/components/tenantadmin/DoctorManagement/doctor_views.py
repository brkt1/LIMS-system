import time
from django.utils import timezone
from rest_framework import generics, status, filters, viewsets
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from rest_framework.decorators import action
from django_filters.rest_framework import DjangoFilterBackend
from .doctor_models import Doctor, TestRequest, PatientRecord, TestResult, DoctorAppointment, SPECIALTY_CHOICES, STATUS_CHOICES
from .doctor_serializers import (
    DoctorSerializer, DoctorListSerializer, TestRequestSerializer, 
    PatientRecordSerializer, TestResultSerializer, DoctorAppointmentSerializer
)
from lab.components.superadmin.models import Tenant

class DoctorListCreateView(generics.ListCreateAPIView):
    serializer_class = DoctorSerializer
    queryset = Doctor.objects.all()
    permission_classes = [AllowAny]  # Temporarily allow unauthenticated access for testing
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['specialty', 'status', 'tenant']
    search_fields = ['name', 'email', 'license_number']
    ordering_fields = ['name', 'join_date', 'specialty']
    ordering = ['name']

    def get_serializer_class(self):
        if self.request.method == 'GET':
            return DoctorListSerializer
        return DoctorSerializer

    def get_queryset(self):
        tenant_id = self.request.query_params.get("tenant")
        if tenant_id:
            return Doctor.objects.filter(tenant_id=tenant_id)
        return Doctor.objects.none()

    def create(self, request, *args, **kwargs):
        data = request.data.copy()

        # Required fields check
        required_fields = ["name", "email", "specialty", "license_number", "tenant"]
        for field in required_fields:
            if not data.get(field):
                return Response({"error": f"Field '{field}' is required."}, status=status.HTTP_400_BAD_REQUEST)

        # Validate specialty
        if data["specialty"] not in dict(SPECIALTY_CHOICES):
            return Response({"error": f"Specialty must be one of {list(dict(SPECIALTY_CHOICES).keys())}"}, status=status.HTTP_400_BAD_REQUEST)

        # Validate status if provided
        if data.get("status") and data["status"] not in dict(STATUS_CHOICES):
            return Response({"error": f"Status must be one of {list(dict(STATUS_CHOICES).keys())}"}, status=status.HTTP_400_BAD_REQUEST)

        # Generate unique ID if missing
        if not data.get("id"):
            data["id"] = f"DOC{int(time.time() * 1000)}"

        # Check tenant exists
        try:
            tenant = Tenant.objects.get(id=data["tenant"])
            data["tenant"] = tenant.id
        except Tenant.DoesNotExist:
            return Response({"error": f"Tenant '{data['tenant']}' does not exist"}, status=status.HTTP_400_BAD_REQUEST)

        serializer = self.get_serializer(data=data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        return Response({"doctor": serializer.data}, status=status.HTTP_201_CREATED)


class DoctorRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = DoctorSerializer
    queryset = Doctor.objects.all()
    permission_classes = [AllowAny]  # Temporarily allow unauthenticated access for testing
    lookup_field = 'id'

    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        data = request.data.copy()

        # Validate specialty if provided
        if 'specialty' in data and data['specialty'] not in dict(SPECIALTY_CHOICES):
            return Response({"error": f"Specialty must be one of {list(dict(SPECIALTY_CHOICES).keys())}"}, status=status.HTTP_400_BAD_REQUEST)

        # Validate status if provided
        if 'status' in data and data['status'] not in dict(STATUS_CHOICES):
            return Response({"error": f"Status must be one of {list(dict(STATUS_CHOICES).keys())}"}, status=status.HTTP_400_BAD_REQUEST)

        # Check tenant exists if provided
        if 'tenant' in data:
            try:
                tenant = Tenant.objects.get(id=data["tenant"])
                data["tenant"] = tenant.id
            except Tenant.DoesNotExist:
                return Response({"error": f"Tenant '{data['tenant']}' does not exist"}, status=status.HTTP_400_BAD_REQUEST)

        serializer = self.get_serializer(instance, data=data, partial=True)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        return Response({"doctor": serializer.data}, status=status.HTTP_200_OK)


# Clinical Workflow ViewSets
class TestRequestViewSet(viewsets.ModelViewSet):
    """ViewSet for managing test requests created by doctors"""
    queryset = TestRequest.objects.all()
    serializer_class = TestRequestSerializer
    permission_classes = [AllowAny]  # Temporarily allow unauthenticated access for testing
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['doctor', 'status', 'priority', 'tenant']
    search_fields = ['test_type', 'test_description', 'patient_id']
    ordering_fields = ['requested_date', 'required_date', 'priority']
    ordering = ['-requested_date']

    def get_queryset(self):
        queryset = super().get_queryset()
        doctor_id = self.request.query_params.get('doctor')
        if doctor_id:
            queryset = queryset.filter(doctor_id=doctor_id)
        return queryset

    @action(detail=True, methods=['post'])
    def assign_technician(self, request, pk=None):
        """Assign a technician to a test request"""
        test_request = self.get_object()
        technician_id = request.data.get('technician_id')
        if not technician_id:
            return Response({"error": "technician_id is required"}, status=status.HTTP_400_BAD_REQUEST)
        
        test_request.status = 'assigned'
        test_request.save()
        return Response({"message": "Test request assigned to technician successfully"})

    @action(detail=True, methods=['post'])
    def complete(self, request, pk=None):
        """Mark test request as completed"""
        test_request = self.get_object()
        test_request.status = 'completed'
        test_request.save()
        return Response({"message": "Test request marked as completed"})


class PatientRecordViewSet(viewsets.ModelViewSet):
    """ViewSet for managing patient records"""
    queryset = PatientRecord.objects.all()
    serializer_class = PatientRecordSerializer
    permission_classes = [AllowAny]  # Temporarily allow unauthenticated access for testing
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['doctor', 'patient_id', 'tenant']
    search_fields = ['chief_complaint', 'diagnosis', 'treatment_plan']
    ordering_fields = ['visit_date', 'created_at']
    ordering = ['-visit_date']

    def get_queryset(self):
        queryset = super().get_queryset()
        doctor_id = self.request.query_params.get('doctor')
        patient_id = self.request.query_params.get('patient_id')
        if doctor_id:
            queryset = queryset.filter(doctor_id=doctor_id)
        if patient_id:
            queryset = queryset.filter(patient_id=patient_id)
        return queryset


class TestResultViewSet(viewsets.ModelViewSet):
    """ViewSet for managing test results that doctors can review"""
    queryset = TestResult.objects.all()
    serializer_class = TestResultSerializer
    permission_classes = [AllowAny]  # Temporarily allow unauthenticated access for testing
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['doctor', 'status', 'tenant']
    search_fields = ['result_summary', 'patient_id']
    ordering_fields = ['created_at', 'reviewed_at']
    ordering = ['-created_at']

    def get_queryset(self):
        queryset = super().get_queryset()
        doctor_id = self.request.query_params.get('doctor')
        if doctor_id:
            queryset = queryset.filter(doctor_id=doctor_id)
        return queryset

    @action(detail=True, methods=['post'])
    def review(self, request, pk=None):
        """Review and approve/reject a test result"""
        test_result = self.get_object()
        action_type = request.data.get('action')  # 'approve' or 'reject'
        doctor_notes = request.data.get('doctor_notes', '')
        
        if action_type == 'approve':
            test_result.status = 'approved'
        elif action_type == 'reject':
            test_result.status = 'rejected'
        else:
            return Response({"error": "action must be 'approve' or 'reject'"}, status=status.HTTP_400_BAD_REQUEST)
        
        test_result.doctor_notes = doctor_notes
        test_result.reviewed_at = timezone.now()
        test_result.save()
        
        return Response({"message": f"Test result {action_type}d successfully"})


class DoctorAppointmentViewSet(viewsets.ModelViewSet):
    """ViewSet for managing doctor appointments"""
    queryset = DoctorAppointment.objects.all()
    serializer_class = DoctorAppointmentSerializer
    permission_classes = [AllowAny]  # Temporarily allow unauthenticated access for testing
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['doctor', 'status', 'appointment_type', 'tenant']
    search_fields = ['reason', 'notes', 'patient_id']
    ordering_fields = ['appointment_date', 'created_at']
    ordering = ['appointment_date']

    def get_queryset(self):
        queryset = super().get_queryset()
        doctor_id = self.request.query_params.get('doctor')
        patient_id = self.request.query_params.get('patient_id')
        if doctor_id:
            queryset = queryset.filter(doctor_id=doctor_id)
        if patient_id:
            queryset = queryset.filter(patient_id=patient_id)
        return queryset

    @action(detail=True, methods=['post'])
    def confirm(self, request, pk=None):
        """Confirm an appointment"""
        appointment = self.get_object()
        appointment.status = 'confirmed'
        appointment.save()
        return Response({"message": "Appointment confirmed successfully"})

    @action(detail=True, methods=['post'])
    def complete(self, request, pk=None):
        """Mark appointment as completed"""
        appointment = self.get_object()
        appointment.status = 'completed'
        appointment.save()
        return Response({"message": "Appointment marked as completed"})
