import time
from rest_framework import generics, status, filters
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from django_filters.rest_framework import DjangoFilterBackend
from .test_pricing_models import TestPricing, TestPricingDiscount, TEST_CATEGORY_CHOICES, PRICING_TYPE_CHOICES
from .test_pricing_serializers import TestPricingSerializer, TestPricingListSerializer, TestPricingDiscountSerializer
from lab.components.superadmin.models import Tenant

class TestPricingListCreateView(generics.ListCreateAPIView):
    serializer_class = TestPricingSerializer
    queryset = TestPricing.objects.all()
    permission_classes = [AllowAny]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['category', 'pricing_type', 'is_active', 'tenant']
    search_fields = ['test_name', 'test_code', 'description']
    ordering_fields = ['test_name', 'base_price', 'effective_date']
    ordering = ['test_name']

    def get_serializer_class(self):
        if self.request.method == 'GET':
            return TestPricingListSerializer
        return TestPricingSerializer

    def get_queryset(self):
        tenant_id = self.request.query_params.get("tenant")
        if tenant_id:
            return TestPricing.objects.filter(tenant_id=tenant_id)
        return TestPricing.objects.all()

    def create(self, request, *args, **kwargs):
        data = request.data.copy()

        # Required fields check
        required_fields = ["test_name", "test_code", "category", "base_price", "effective_date", "tenant"]
        for field in required_fields:
            value = data.get(field)
            if value is None or value == "":
                return Response({"error": f"Field '{field}' is required."}, status=status.HTTP_400_BAD_REQUEST)
            # Special validation for base_price - must be a valid number
            if field == "base_price" and (not isinstance(value, (int, float)) or value < 0):
                return Response({"error": f"Field '{field}' must be a valid positive number."}, status=status.HTTP_400_BAD_REQUEST)

        # Validate category
        if data["category"] not in dict(TEST_CATEGORY_CHOICES):
            return Response({"error": f"Category must be one of {list(dict(TEST_CATEGORY_CHOICES).keys())}"}, status=status.HTTP_400_BAD_REQUEST)

        # Validate pricing type if provided
        if data.get("pricing_type") and data["pricing_type"] not in dict(PRICING_TYPE_CHOICES):
            return Response({"error": f"Pricing type must be one of {list(dict(PRICING_TYPE_CHOICES).keys())}"}, status=status.HTTP_400_BAD_REQUEST)

        # Generate unique ID if missing
        if not data.get("id"):
            data["id"] = f"TP{int(time.time() * 1000)}"

        # Set default values
        data.setdefault("currency", "USD")
        data.setdefault("pricing_type", "standard")
        data.setdefault("is_active", True)

        # Check tenant exists
        try:
            tenant = Tenant.objects.get(id=data["tenant"])
            data["tenant"] = tenant.id
        except Tenant.DoesNotExist:
            return Response({"error": f"Tenant '{data['tenant']}' does not exist"}, status=status.HTTP_400_BAD_REQUEST)

        serializer = self.get_serializer(data=data)
        
        if not serializer.is_valid():
            return Response({"error": "Validation failed", "details": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)
        
        self.perform_create(serializer)
        return Response({"test_pricing": serializer.data}, status=status.HTTP_201_CREATED)
    
    def perform_create(self, serializer):
        # The ID should already be set in the data from the create method
        serializer.save()

class TestPricingRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = TestPricingSerializer
    queryset = TestPricing.objects.all()
    permission_classes = [AllowAny]
    lookup_field = 'id'

    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        data = request.data.copy()

        # Validate category if provided
        if 'category' in data and data['category'] not in dict(TEST_CATEGORY_CHOICES):
            return Response({"error": f"Category must be one of {list(dict(TEST_CATEGORY_CHOICES).keys())}"}, status=status.HTTP_400_BAD_REQUEST)

        # Validate pricing type if provided
        if 'pricing_type' in data and data['pricing_type'] not in dict(PRICING_TYPE_CHOICES):
            return Response({"error": f"Pricing type must be one of {list(dict(PRICING_TYPE_CHOICES).keys())}"}, status=status.HTTP_400_BAD_REQUEST)

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
        return Response({"test_pricing": serializer.data}, status=status.HTTP_200_OK)

class TestPricingDiscountListCreateView(generics.ListCreateAPIView):
    serializer_class = TestPricingDiscountSerializer
    queryset = TestPricingDiscount.objects.all()
    permission_classes = [AllowAny]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['test_pricing', 'discount_type', 'is_active', 'tenant']
    search_fields = ['discount_name']
    ordering_fields = ['discount_name', 'discount_value', 'valid_from']
    ordering = ['-valid_from']

    def get_queryset(self):
        tenant_id = self.request.query_params.get("tenant")
        if tenant_id:
            return TestPricingDiscount.objects.filter(tenant_id=tenant_id)
        return TestPricingDiscount.objects.all()

    def create(self, request, *args, **kwargs):
        data = request.data.copy()

        # Required fields check
        required_fields = ["test_pricing", "discount_name", "discount_type", "discount_value", "valid_from", "tenant"]
        for field in required_fields:
            if not data.get(field):
                return Response({"error": f"Field '{field}' is required."}, status=status.HTTP_400_BAD_REQUEST)

        # Generate unique ID if missing
        if not data.get("id"):
            data["id"] = f"TD{int(time.time() * 1000)}"

        # Set default values
        data.setdefault("is_active", True)
        data.setdefault("minimum_quantity", 1)

        # Check tenant exists
        try:
            tenant = Tenant.objects.get(id=data["tenant"])
            data["tenant"] = tenant.id
        except Tenant.DoesNotExist:
            return Response({"error": f"Tenant '{data['tenant']}' does not exist"}, status=status.HTTP_400_BAD_REQUEST)

        serializer = self.get_serializer(data=data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        return Response({"discount": serializer.data}, status=status.HTTP_201_CREATED)
