from rest_framework import serializers
from .test_pricing_models import TestPricing, TestPricingDiscount

class TestPricingSerializer(serializers.ModelSerializer):
    class Meta:
        model = TestPricing
        fields = [
            'id', 'test_name', 'test_code', 'category', 'description', 'base_price',
            'currency', 'pricing_type', 'turnaround_time', 'sample_type', 
            'preparation_instructions', 'is_active', 'effective_date', 'expiry_date',
            'tenant', 'created_by', 'created_at', 'updated_at'
        ]
        read_only_fields = ['created_at', 'updated_at']
        extra_kwargs = {
            'created_by': {'required': False, 'allow_blank': True, 'allow_null': True}
        }

    def validate_test_code(self, value):
        # Check if test code is unique within the tenant
        tenant_id = self.initial_data.get('tenant')
        if tenant_id:
            existing_pricing = TestPricing.objects.filter(
                test_code=value, 
                tenant_id=tenant_id
            ).exclude(pk=self.instance.pk if self.instance else None)
            if existing_pricing.exists():
                raise serializers.ValidationError("A test with this code already exists in this tenant.")
        return value

    def create(self, validated_data):
        # Set default created_by if not provided
        if 'created_by' not in validated_data:
            validated_data['created_by'] = 'system'
        return super().create(validated_data)

class TestPricingListSerializer(serializers.ModelSerializer):
    """Simplified serializer for list views"""
    class Meta:
        model = TestPricing
        fields = [
            'id', 'test_name', 'test_code', 'category', 'base_price', 
            'currency', 'pricing_type', 'turnaround_time', 'is_active'
        ]

class TestPricingDiscountSerializer(serializers.ModelSerializer):
    class Meta:
        model = TestPricingDiscount
        fields = [
            'id', 'test_pricing', 'discount_name', 'discount_type', 'discount_value',
            'minimum_quantity', 'valid_from', 'valid_until', 'is_active',
            'tenant', 'created_by', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']
        extra_kwargs = {
            'created_by': {'required': False, 'allow_blank': True, 'allow_null': True}
        }

    def create(self, validated_data):
        # Set default created_by if not provided
        if 'created_by' not in validated_data:
            validated_data['created_by'] = 'system'
        return super().create(validated_data)
