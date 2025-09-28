import time
from rest_framework import generics, status, filters
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from django_filters.rest_framework import DjangoFilterBackend
from .branch_models import Branch, BRANCH_STATUS_CHOICES
from .branch_serializers import BranchSerializer, BranchListSerializer
from lab.components.superadmin.models import Tenant

class BranchListCreateView(generics.ListCreateAPIView):
    serializer_class = BranchSerializer
    queryset = Branch.objects.all()
    permission_classes = [AllowAny]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['status', 'city', 'state', 'tenant']
    search_fields = ['name', 'city', 'state', 'manager_name']
    ordering_fields = ['name', 'established_date', 'city']
    ordering = ['name']

    def get_serializer_class(self):
        if self.request.method == 'GET':
            return BranchListSerializer
        return BranchSerializer

    def get_queryset(self):
        tenant_id = self.request.query_params.get("tenant")
        if tenant_id:
            return Branch.objects.filter(tenant_id=tenant_id)
        return Branch.objects.all()

    def create(self, request, *args, **kwargs):
        data = request.data.copy()

        # Required fields check
        required_fields = [
            "name", "address", "city", "state", "postal_code", "phone", 
            "email", "manager_name", "manager_email", "manager_phone", 
            "established_date", "tenant"
        ]
        for field in required_fields:
            if not data.get(field):
                return Response({"error": f"Field '{field}' is required."}, status=status.HTTP_400_BAD_REQUEST)

        # Validate status if provided
        if data.get("status") and data["status"] not in dict(BRANCH_STATUS_CHOICES):
            return Response({"error": f"Status must be one of {list(dict(BRANCH_STATUS_CHOICES).keys())}"}, status=status.HTTP_400_BAD_REQUEST)

        # Generate unique ID if missing
        if not data.get("id"):
            data["id"] = f"BR{int(time.time() * 1000)}"

        # Set default values
        data.setdefault("status", "active")
        data.setdefault("country", "United States")

        # Check tenant exists
        try:
            tenant = Tenant.objects.get(id=data["tenant"])
            data["tenant"] = tenant.id
        except Tenant.DoesNotExist:
            return Response({"error": f"Tenant '{data['tenant']}' does not exist"}, status=status.HTTP_400_BAD_REQUEST)

        serializer = self.get_serializer(data=data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        return Response({"branch": serializer.data}, status=status.HTTP_201_CREATED)

class BranchRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = BranchSerializer
    queryset = Branch.objects.all()
    permission_classes = [AllowAny]
    lookup_field = 'id'

    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        data = request.data.copy()

        # Validate status if provided
        if 'status' in data and data['status'] not in dict(BRANCH_STATUS_CHOICES):
            return Response({"error": f"Status must be one of {list(dict(BRANCH_STATUS_CHOICES).keys())}"}, status=status.HTTP_400_BAD_REQUEST)

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
        return Response({"branch": serializer.data}, status=status.HTTP_200_OK)
