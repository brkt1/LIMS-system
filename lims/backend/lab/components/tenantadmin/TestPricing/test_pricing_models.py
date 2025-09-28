from django.db import models
from lab.components.superadmin.models import Tenant

TEST_CATEGORY_CHOICES = [
    ('blood_tests', 'Blood Tests'),
    ('urine_tests', 'Urine Tests'),
    ('imaging', 'Imaging'),
    ('microbiology', 'Microbiology'),
    ('pathology', 'Pathology'),
    ('cardiology', 'Cardiology'),
    ('neurology', 'Neurology'),
    ('pulmonology', 'Pulmonology'),
    ('endocrinology', 'Endocrinology'),
    ('immunology', 'Immunology'),
]

PRICING_TYPE_CHOICES = [
    ('standard', 'Standard'),
    ('premium', 'Premium'),
    ('express', 'Express'),
    ('bulk', 'Bulk'),
    ('insurance', 'Insurance'),
]

class TestPricing(models.Model):
    id = models.CharField(primary_key=True, max_length=50)
    test_name = models.CharField(max_length=255)
    test_code = models.CharField(max_length=50, unique=True)
    category = models.CharField(max_length=50, choices=TEST_CATEGORY_CHOICES)
    description = models.TextField(null=True, blank=True)
    base_price = models.DecimalField(max_digits=10, decimal_places=2)
    currency = models.CharField(max_length=3, default='USD')
    pricing_type = models.CharField(max_length=20, choices=PRICING_TYPE_CHOICES, default='standard')
    turnaround_time = models.CharField(max_length=100, null=True, blank=True)
    sample_type = models.CharField(max_length=100, null=True, blank=True)
    preparation_instructions = models.TextField(null=True, blank=True)
    is_active = models.BooleanField(default=True)
    effective_date = models.DateField()
    expiry_date = models.DateField(null=True, blank=True)
    tenant = models.ForeignKey(Tenant, to_field="id", on_delete=models.CASCADE, related_name="test_pricing")
    created_by = models.EmailField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['test_name']
        unique_together = ['test_code', 'tenant']

    def __str__(self):
        return f"{self.test_name} ({self.test_code})"

class TestPricingDiscount(models.Model):
    id = models.CharField(primary_key=True, max_length=50)
    test_pricing = models.ForeignKey(TestPricing, on_delete=models.CASCADE, related_name='discounts')
    discount_name = models.CharField(max_length=255)
    discount_type = models.CharField(max_length=20, choices=[
        ('percentage', 'Percentage'),
        ('fixed_amount', 'Fixed Amount'),
    ])
    discount_value = models.DecimalField(max_digits=10, decimal_places=2)
    minimum_quantity = models.IntegerField(default=1)
    valid_from = models.DateField()
    valid_until = models.DateField(null=True, blank=True)
    is_active = models.BooleanField(default=True)
    tenant = models.ForeignKey(Tenant, to_field="id", on_delete=models.CASCADE, related_name="test_discounts")
    created_by = models.EmailField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-valid_from']

    def __str__(self):
        return f"{self.discount_name} - {self.test_pricing.test_name}"
