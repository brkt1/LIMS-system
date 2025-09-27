from rest_framework import serializers
from .receipts_models import Receipt, BillingTransaction

class ReceiptSerializer(serializers.ModelSerializer):
    class Meta:
        model = Receipt
        fields = '__all__'
        read_only_fields = ['created_at', 'updated_at', 'generated_date', 'generated_time']

class ReceiptListSerializer(serializers.ModelSerializer):
    class Meta:
        model = Receipt
        fields = [
            'id', 'patient_name', 'patient_id', 'amount', 'status', 
            'generated_date', 'generated_time', 'services', 'doctor', 
            'payment_method', 'print_count', 'created_at'
        ]

class BillingTransactionSerializer(serializers.ModelSerializer):
    class Meta:
        model = BillingTransaction
        fields = '__all__'
        read_only_fields = ['processed_at']
