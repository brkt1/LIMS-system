import time
from rest_framework import generics, status, filters
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from django_filters.rest_framework import DjangoFilterBackend
from .equipment_models import Equipment, EQUIPMENT_TYPE_CHOICES, EQUIPMENT_STATUS_CHOICES, EQUIPMENT_CONDITION_CHOICES
from .equipment_serializers import EquipmentSerializer, EquipmentListSerializer
from lab.components.superadmin.models import Tenant

class EquipmentListCreateView(generics.ListCreateAPIView):
    serializer_class = EquipmentSerializer
    queryset = Equipment.objects.all()
    permission_classes = [AllowAny]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['type', 'status', 'condition', 'tenant']
    search_fields = ['name', 'serial_number', 'manufacturer', 'model']
    ordering_fields = ['name', 'purchase_date', 'cost']
    ordering = ['name']

    def get_serializer_class(self):
        if self.request.method == 'GET':
            return EquipmentListSerializer
        return EquipmentSerializer

    def get_queryset(self):
        tenant_id = self.request.query_params.get("tenant")
        if tenant_id:
            return Equipment.objects.filter(tenant_id=tenant_id)
        return Equipment.objects.all()

    def create(self, request, *args, **kwargs):
        data = request.data.copy()

        # Required fields check
        required_fields = ["name", "type", "category", "serial_number", "manufacturer", "model", "location", "purchase_date", "tenant"]
        for field in required_fields:
            if not data.get(field):
                return Response({"error": f"Field '{field}' is required."}, status=status.HTTP_400_BAD_REQUEST)

        # Validate type
        if data["type"] not in dict(EQUIPMENT_TYPE_CHOICES):
            return Response({"error": f"Type must be one of {list(dict(EQUIPMENT_TYPE_CHOICES).keys())}"}, status=status.HTTP_400_BAD_REQUEST)

        # Validate status if provided
        if data.get("status") and data["status"] not in dict(EQUIPMENT_STATUS_CHOICES):
            return Response({"error": f"Status must be one of {list(dict(EQUIPMENT_STATUS_CHOICES).keys())}"}, status=status.HTTP_400_BAD_REQUEST)

        # Validate condition if provided
        if data.get("condition") and data["condition"] not in dict(EQUIPMENT_CONDITION_CHOICES):
            return Response({"error": f"Condition must be one of {list(dict(EQUIPMENT_CONDITION_CHOICES).keys())}"}, status=status.HTTP_400_BAD_REQUEST)

        # Generate unique ID if missing
        if not data.get("id"):
            data["id"] = f"EQ{int(time.time() * 1000)}"

        # Set default values
        data.setdefault("status", "operational")
        data.setdefault("condition", "good")

        # Check tenant exists
        try:
            tenant = Tenant.objects.get(id=data["tenant"])
            data["tenant"] = tenant.id
        except Tenant.DoesNotExist:
            return Response({"error": f"Tenant '{data['tenant']}' does not exist"}, status=status.HTTP_400_BAD_REQUEST)

        serializer = self.get_serializer(data=data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        return Response({"equipment": serializer.data}, status=status.HTTP_201_CREATED)

class EquipmentRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = EquipmentSerializer
    queryset = Equipment.objects.all()
    permission_classes = [AllowAny]
    lookup_field = 'id'

    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        data = request.data.copy()

        # Validate type if provided
        if 'type' in data and data['type'] not in dict(EQUIPMENT_TYPE_CHOICES):
            return Response({"error": f"Type must be one of {list(dict(EQUIPMENT_TYPE_CHOICES).keys())}"}, status=status.HTTP_400_BAD_REQUEST)

        # Validate status if provided
        if 'status' in data and data['status'] not in dict(EQUIPMENT_STATUS_CHOICES):
            return Response({"error": f"Status must be one of {list(dict(EQUIPMENT_STATUS_CHOICES).keys())}"}, status=status.HTTP_400_BAD_REQUEST)

        # Validate condition if provided
        if 'condition' in data and data['condition'] not in dict(EQUIPMENT_CONDITION_CHOICES):
            return Response({"error": f"Condition must be one of {list(dict(EQUIPMENT_CONDITION_CHOICES).keys())}"}, status=status.HTTP_400_BAD_REQUEST)

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
        return Response({"equipment": serializer.data}, status=status.HTTP_200_OK)
