from rest_framework import serializers
from .branch_models import Branch

class BranchSerializer(serializers.ModelSerializer):
    class Meta:
        model = Branch
        fields = [
            'id', 'name', 'address', 'city', 'state', 'postal_code', 'country',
            'phone', 'email', 'manager_name', 'manager_email', 'manager_phone',
            'opening_hours', 'services', 'capacity', 'status', 'established_date',
            'tenant', 'created_by', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']
        extra_kwargs = {
            'created_by': {'required': False, 'allow_blank': True, 'allow_null': True}
        }

    def validate_name(self, value):
        # Check if branch name is unique within the tenant
        tenant_id = self.initial_data.get('tenant')
        if tenant_id:
            existing_branch = Branch.objects.filter(
                name=value, 
                tenant_id=tenant_id
            ).exclude(pk=self.instance.pk if self.instance else None)
            if existing_branch.exists():
                raise serializers.ValidationError("A branch with this name already exists in this tenant.")
        return value

    def create(self, validated_data):
        # Set default created_by if not provided
        if 'created_by' not in validated_data:
            validated_data['created_by'] = 'system'
        return super().create(validated_data)

class BranchListSerializer(serializers.ModelSerializer):
    """Simplified serializer for list views"""
    class Meta:
        model = Branch
        fields = [
            'id', 'name', 'city', 'state', 'phone', 'manager_name', 
            'status', 'established_date', 'capacity'
        ]
