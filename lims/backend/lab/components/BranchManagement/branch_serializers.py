from rest_framework import serializers
from .branch_models import Branch, BranchStaff

class BranchSerializer(serializers.ModelSerializer):
    class Meta:
        model = Branch
        fields = '__all__'
        read_only_fields = ['created_at', 'updated_at']

class BranchListSerializer(serializers.ModelSerializer):
    class Meta:
        model = Branch
        fields = [
            'id', 'name', 'address', 'phone', 'email', 'city', 'state', 
            'zip_code', 'manager', 'established_date', 'total_staff', 
            'total_patients', 'status', 'created_at'
        ]

class BranchStaffSerializer(serializers.ModelSerializer):
    branch_name = serializers.CharField(source='branch.name', read_only=True)
    
    class Meta:
        model = BranchStaff
        fields = '__all__'
        read_only_fields = ['created_at', 'updated_at']

class BranchStaffListSerializer(serializers.ModelSerializer):
    branch_name = serializers.CharField(source='branch.name', read_only=True)
    
    class Meta:
        model = BranchStaff
        fields = [
            'id', 'name', 'email', 'phone', 'role', 'hire_date', 
            'is_active', 'branch_name', 'created_at'
        ]
