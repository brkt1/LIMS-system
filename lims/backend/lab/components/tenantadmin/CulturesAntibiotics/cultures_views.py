import time
from rest_framework import generics, status, filters
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from rest_framework.decorators import api_view
from django_filters.rest_framework import DjangoFilterBackend
from .cultures_models import Culture, AntibioticSensitivity, SPECIMEN_TYPE_CHOICES, CULTURE_TYPE_CHOICES, STATUS_CHOICES, SENSITIVITY_CHOICES
from .cultures_serializers import CultureSerializer, CultureListSerializer, AntibioticSensitivitySerializer, AntibioticSensitivityListSerializer
from lab.components.superadmin.models import Tenant

@api_view(['GET'])
def test_api(request):
    """Simple test endpoint to verify API is working"""
    return Response({"message": "Cultures & Antibiotics API is working!", "status": "success"})

class CultureListCreateView(generics.ListCreateAPIView):
    serializer_class = CultureSerializer
    queryset = Culture.objects.all()
    permission_classes = [AllowAny]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['specimen_type', 'culture_type', 'status', 'tenant']
    search_fields = ['patient_name', 'patient_id', 'organism']
    ordering_fields = ['collection_date', 'patient_name', 'report_date']
    ordering = ['-collection_date']

    def get_serializer_class(self):
        if self.request.method == 'GET':
            return CultureListSerializer
        return CultureSerializer

    def get_queryset(self):
        tenant_id = self.request.query_params.get("tenant")
        if tenant_id:
            return Culture.objects.filter(tenant_id=tenant_id)
        return Culture.objects.all()

    def create(self, request, *args, **kwargs):
        data = request.data.copy()

        # Required fields check
        required_fields = ["patient_name", "patient_id", "specimen_type", "culture_type", "collection_date", "tenant"]
        for field in required_fields:
            if not data.get(field):
                return Response({"error": f"Field '{field}' is required."}, status=status.HTTP_400_BAD_REQUEST)

        # Validate specimen type
        if data["specimen_type"] not in dict(SPECIMEN_TYPE_CHOICES):
            return Response({"error": f"Specimen type must be one of {list(dict(SPECIMEN_TYPE_CHOICES).keys())}"}, status=status.HTTP_400_BAD_REQUEST)

        # Validate culture type
        if data["culture_type"] not in dict(CULTURE_TYPE_CHOICES):
            return Response({"error": f"Culture type must be one of {list(dict(CULTURE_TYPE_CHOICES).keys())}"}, status=status.HTTP_400_BAD_REQUEST)

        # Generate unique ID if missing
        if not data.get("id"):
            data["id"] = f"CULT{int(time.time() * 1000)}"

        # Set default values
        data.setdefault("status", "pending")

        # Check tenant exists
        try:
            tenant = Tenant.objects.get(id=data["tenant"])
            data["tenant"] = tenant.id
        except Tenant.DoesNotExist:
            return Response({"error": f"Tenant '{data['tenant']}' does not exist"}, status=status.HTTP_400_BAD_REQUEST)

        serializer = self.get_serializer(data=data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        return Response({"culture": serializer.data}, status=status.HTTP_201_CREATED)

class CultureRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = CultureSerializer
    queryset = Culture.objects.all()
    permission_classes = [AllowAny]
    lookup_field = 'id'

    def update(self, request, *args, **kwargs):
        try:
            instance = self.get_object()
            data = request.data.copy()
            
            print(f"Updating culture {instance.id} with data: {data}")

            # Validate specimen type if provided
            if 'specimen_type' in data and data['specimen_type'] not in dict(SPECIMEN_TYPE_CHOICES):
                return Response({"error": f"Specimen type must be one of {list(dict(SPECIMEN_TYPE_CHOICES).keys())}"}, status=status.HTTP_400_BAD_REQUEST)

            # Validate culture type if provided
            if 'culture_type' in data and data['culture_type'] not in dict(CULTURE_TYPE_CHOICES):
                return Response({"error": f"Culture type must be one of {list(dict(CULTURE_TYPE_CHOICES).keys())}"}, status=status.HTTP_400_BAD_REQUEST)

            # Validate status if provided
            if 'status' in data and data['status'] not in dict(STATUS_CHOICES):
                return Response({"error": f"Status must be one of {list(dict(STATUS_CHOICES).keys())}"}, status=status.HTTP_400_BAD_REQUEST)

            # Remove tenant from data to avoid validation issues
            if 'tenant' in data:
                del data['tenant']

            serializer = self.get_serializer(instance, data=data, partial=True)
            if serializer.is_valid():
                self.perform_update(serializer)
                print(f"Successfully updated culture {instance.id}")
                return Response({"culture": serializer.data}, status=status.HTTP_200_OK)
            else:
                print(f"Serializer errors: {serializer.errors}")
                return Response({"error": "Validation failed", "details": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)
                
        except Exception as e:
            print(f"Error updating culture: {str(e)}")
            return Response({"error": f"Update failed: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class AntibioticSensitivityListCreateView(generics.ListCreateAPIView):
    serializer_class = AntibioticSensitivitySerializer
    queryset = AntibioticSensitivity.objects.all()
    permission_classes = [AllowAny]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['culture', 'sensitivity', 'tenant']
    search_fields = ['antibiotic_name']
    ordering_fields = ['antibiotic_name', 'tested_date']
    ordering = ['antibiotic_name']

    def get_serializer_class(self):
        if self.request.method == 'GET':
            return AntibioticSensitivityListSerializer
        return AntibioticSensitivitySerializer

    def get_queryset(self):
        tenant_id = self.request.query_params.get("tenant")
        if tenant_id:
            return AntibioticSensitivity.objects.filter(tenant_id=tenant_id)
        return AntibioticSensitivity.objects.all()

    def create(self, request, *args, **kwargs):
        data = request.data.copy()

        # Required fields check
        required_fields = ["culture", "antibiotic_name", "sensitivity", "tested_date", "tenant"]
        for field in required_fields:
            if not data.get(field):
                return Response({"error": f"Field '{field}' is required."}, status=status.HTTP_400_BAD_REQUEST)

        # Validate sensitivity
        if data["sensitivity"] not in dict(SENSITIVITY_CHOICES):
            return Response({"error": f"Sensitivity must be one of {list(dict(SENSITIVITY_CHOICES).keys())}"}, status=status.HTTP_400_BAD_REQUEST)

        # Generate unique ID if missing
        if not data.get("id"):
            data["id"] = f"AS{int(time.time() * 1000)}"

        # Check tenant exists
        try:
            tenant = Tenant.objects.get(id=data["tenant"])
            data["tenant"] = tenant.id
        except Tenant.DoesNotExist:
            return Response({"error": f"Tenant '{data['tenant']}' does not exist"}, status=status.HTTP_400_BAD_REQUEST)

        serializer = self.get_serializer(data=data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        return Response({"antibiotic_sensitivity": serializer.data}, status=status.HTTP_201_CREATED)
