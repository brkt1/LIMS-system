from rest_framework import serializers
from .accounting_models import AccountingEntry, FinancialReport

class AccountingEntrySerializer(serializers.ModelSerializer):
    class Meta:
        model = AccountingEntry
        fields = '__all__'
        read_only_fields = ['id', 'created_at', 'updated_at', 'tenant', 'created_by']

class AccountingEntryListSerializer(serializers.ModelSerializer):
    class Meta:
        model = AccountingEntry
        fields = [
            'id', 'description', 'entry_type', 'category', 'amount', 
            'payment_method', 'reference_number', 'account', 'date', 'created_at'
        ]

class FinancialReportSerializer(serializers.ModelSerializer):
    class Meta:
        model = FinancialReport
        fields = '__all__'
        read_only_fields = ['generated_at']

class FinancialReportListSerializer(serializers.ModelSerializer):
    class Meta:
        model = FinancialReport
        fields = [
            'id', 'report_type', 'title', 'start_date', 'end_date', 
            'total_income', 'total_expenses', 'net_profit', 'generated_at'
        ]
