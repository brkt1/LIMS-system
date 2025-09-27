from django.db import models
from django.conf import settings
from lab.components.superadmin.models import Tenant

class AccountingEntry(models.Model):
    ENTRY_TYPE_CHOICES = [
        ('income', 'Income'),
        ('expense', 'Expense'),
        ('asset', 'Asset'),
        ('liability', 'Liability'),
        ('equity', 'Equity'),
    ]
    
    CATEGORY_CHOICES = [
        # Income categories
        ('patient_fees', 'Patient Fees'),
        ('insurance_payments', 'Insurance Payments'),
        ('consultation_fees', 'Consultation Fees'),
        ('test_fees', 'Test Fees'),
        ('other_income', 'Other Income'),
        
        # Expense categories
        ('salaries', 'Salaries'),
        ('rent', 'Rent'),
        ('utilities', 'Utilities'),
        ('medical_supplies', 'Medical Supplies'),
        ('equipment', 'Equipment'),
        ('maintenance', 'Maintenance'),
        ('marketing', 'Marketing'),
        ('insurance', 'Insurance'),
        ('other_expenses', 'Other Expenses'),
    ]
    
    PAYMENT_METHOD_CHOICES = [
        ('cash', 'Cash'),
        ('check', 'Check'),
        ('card', 'Card'),
        ('bank_transfer', 'Bank Transfer'),
        ('insurance', 'Insurance'),
        ('other', 'Other'),
    ]
    
    id = models.CharField(primary_key=True, max_length=50)
    description = models.CharField(max_length=255)
    entry_type = models.CharField(max_length=20, choices=ENTRY_TYPE_CHOICES)
    category = models.CharField(max_length=30, choices=CATEGORY_CHOICES)
    amount = models.DecimalField(max_digits=15, decimal_places=2)
    payment_method = models.CharField(max_length=20, choices=PAYMENT_METHOD_CHOICES)
    reference_number = models.CharField(max_length=100, blank=True, null=True)
    account = models.CharField(max_length=100)  # Account name
    date = models.DateField()
    notes = models.TextField(blank=True, null=True)
    receipt_file = models.FileField(upload_to='receipts/', null=True, blank=True)
    tenant = models.ForeignKey(Tenant, on_delete=models.CASCADE, related_name='accounting_entries')
    created_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-date', '-created_at']
    
    def __str__(self):
        return f"{self.description} - {self.amount}"

class FinancialReport(models.Model):
    REPORT_TYPE_CHOICES = [
        ('income_statement', 'Income Statement'),
        ('balance_sheet', 'Balance Sheet'),
        ('cash_flow', 'Cash Flow Statement'),
        ('profit_loss', 'Profit & Loss'),
        ('monthly_summary', 'Monthly Summary'),
        ('yearly_summary', 'Yearly Summary'),
    ]
    
    id = models.CharField(primary_key=True, max_length=50)
    report_type = models.CharField(max_length=20, choices=REPORT_TYPE_CHOICES)
    title = models.CharField(max_length=255)
    start_date = models.DateField()
    end_date = models.DateField()
    data = models.JSONField(default=dict)  # Report data
    total_income = models.DecimalField(max_digits=15, decimal_places=2, default=0)
    total_expenses = models.DecimalField(max_digits=15, decimal_places=2, default=0)
    net_profit = models.DecimalField(max_digits=15, decimal_places=2, default=0)
    generated_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    generated_at = models.DateTimeField(auto_now_add=True)
    tenant = models.ForeignKey(Tenant, on_delete=models.CASCADE, related_name='financial_reports')
    
    class Meta:
        ordering = ['-generated_at']
    
    def __str__(self):
        return f"{self.title} - {self.start_date} to {self.end_date}"
