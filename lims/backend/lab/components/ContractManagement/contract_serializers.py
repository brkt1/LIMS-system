from rest_framework import serializers
from .contract_models import Contract, ContractRenewal

class ContractSerializer(serializers.ModelSerializer):
    class Meta:
        model = Contract
        fields = '__all__'
        read_only_fields = ['id', 'created_at', 'updated_at', 'tenant', 'created_by']

class ContractListSerializer(serializers.ModelSerializer):
    class Meta:
        model = Contract
        fields = [
            'id', 'title', 'type', 'vendor', 'vendor_contact', 'vendor_email', 
            'vendor_phone', 'start_date', 'end_date', 'value', 'currency', 
            'status', 'renewal_date', 'auto_renewal', 'created_at'
        ]

class ContractRenewalSerializer(serializers.ModelSerializer):
    contract_title = serializers.CharField(source='contract.title', read_only=True)
    vendor_name = serializers.CharField(source='contract.vendor', read_only=True)
    
    class Meta:
        model = ContractRenewal
        fields = '__all__'
        read_only_fields = ['approved_at']

class ContractRenewalListSerializer(serializers.ModelSerializer):
    contract_title = serializers.CharField(source='contract.title', read_only=True)
    vendor_name = serializers.CharField(source='contract.vendor', read_only=True)
    
    class Meta:
        model = ContractRenewal
        fields = [
            'id', 'contract_title', 'vendor_name', 'renewal_date', 
            'new_end_date', 'new_value', 'approved_at'
        ]
