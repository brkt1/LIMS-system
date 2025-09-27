from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager
from django.utils import timezone

# Custom Tenant Manager
class TenantManager(BaseUserManager):
    def create_user(self, email, company_name, password=None, **extra_fields):
        if not email:
            raise ValueError('Email must be set')
        email = self.normalize_email(email)
        tenant = self.model(email=email, company_name=company_name, **extra_fields)
        tenant.set_password(password)
        tenant.save(using=self._db)
        return tenant

    def create_superuser(self, email, company_name, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        return self.create_user(email, company_name, password, **extra_fields)


class Tenant(AbstractBaseUser):
    STATUS_CHOICES = [
        ('active', 'Active'),
        ('suspended', 'Suspended'),
        ('pending', 'Pending'),
        ('inactive', 'Inactive'),
    ]
    
    BILLING_CHOICES = [
        ('monthly', 'Monthly'),
        ('yearly', 'Yearly'),
    ]

    id = models.BigAutoField(primary_key=True)
    company_name = models.CharField(max_length=255, unique=True)
    domain = models.CharField(max_length=255, unique=True, help_text="Subdomain for tenant")
    email = models.EmailField(unique=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='active')
    billing_period = models.CharField(max_length=10, choices=BILLING_CHOICES, default='monthly')
    max_users = models.IntegerField(default=10)
    current_users = models.IntegerField(default=0)
    created_by = models.CharField(max_length=255)
    created_at = models.DateTimeField(auto_now_add=True)
    last_active = models.DateTimeField(auto_now=True)
    is_paid = models.BooleanField(default=True)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)

    objects = TenantManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['company_name', 'domain']

    def __str__(self):
        return self.company_name

    class Meta:
        db_table = 'superadmin_tenants'


class BillingPlan(models.Model):
    PLAN_TYPES = [
        ('basic', 'Basic'),
        ('professional', 'Professional'),
        ('enterprise', 'Enterprise'),
        ('custom', 'Custom'),
    ]

    name = models.CharField(max_length=100, unique=True)
    plan_type = models.CharField(max_length=20, choices=PLAN_TYPES)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    billing_cycle = models.CharField(max_length=10, choices=Tenant.BILLING_CHOICES, default='monthly')
    max_users = models.IntegerField()
    features = models.JSONField(default=list, help_text="List of features included in this plan")
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.name} - ${self.price}/{self.billing_cycle}"

    class Meta:
        db_table = 'superadmin_billing_plans'


class TenantPlan(models.Model):
    tenant = models.OneToOneField(Tenant, on_delete=models.CASCADE, related_name='plan')
    billing_plan = models.ForeignKey(BillingPlan, on_delete=models.CASCADE)
    start_date = models.DateTimeField(auto_now_add=True)
    end_date = models.DateTimeField(null=True, blank=True)
    is_active = models.BooleanField(default=True)
    auto_renew = models.BooleanField(default=True)

    def __str__(self):
        return f"{self.tenant.company_name} - {self.billing_plan.name}"

    class Meta:
        db_table = 'superadmin_tenant_plans'


class BillingTransaction(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('paid', 'Paid'),
        ('failed', 'Failed'),
        ('refunded', 'Refunded'),
        ('cancelled', 'Cancelled'),
    ]

    PAYMENT_METHODS = [
        ('credit_card', 'Credit Card'),
        ('bank_transfer', 'Bank Transfer'),
        ('paypal', 'PayPal'),
        ('stripe', 'Stripe'),
        ('other', 'Other'),
    ]

    tenant = models.ForeignKey(Tenant, on_delete=models.CASCADE, related_name='transactions')
    billing_plan = models.ForeignKey(BillingPlan, on_delete=models.CASCADE)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    payment_method = models.CharField(max_length=20, choices=PAYMENT_METHODS)
    transaction_id = models.CharField(max_length=255, unique=True)
    payment_reference = models.CharField(max_length=255, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    paid_at = models.DateTimeField(null=True, blank=True)
    notes = models.TextField(blank=True, null=True)

    def __str__(self):
        return f"{self.tenant.company_name} - ${self.amount} - {self.status}"

    class Meta:
        db_table = 'superadmin_billing_transactions'


class UsageMetrics(models.Model):
    tenant = models.ForeignKey(Tenant, on_delete=models.CASCADE, related_name='usage_metrics')
    date = models.DateField()
    active_users = models.IntegerField(default=0)
    total_tests = models.IntegerField(default=0)
    total_reports = models.IntegerField(default=0)
    api_calls = models.IntegerField(default=0)
    storage_used = models.BigIntegerField(default=0, help_text="Storage used in bytes")
    bandwidth_used = models.BigIntegerField(default=0, help_text="Bandwidth used in bytes")
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.tenant.company_name} - {self.date}"

    class Meta:
        db_table = 'superadmin_usage_metrics'
        unique_together = ['tenant', 'date']


class SystemLog(models.Model):
    LOG_LEVELS = [
        ('debug', 'Debug'),
        ('info', 'Info'),
        ('warning', 'Warning'),
        ('error', 'Error'),
        ('critical', 'Critical'),
    ]

    level = models.CharField(max_length=10, choices=LOG_LEVELS)
    message = models.TextField()
    action = models.CharField(max_length=255, blank=True, null=True)
    user = models.CharField(max_length=255, blank=True, null=True)
    tenant = models.ForeignKey(Tenant, on_delete=models.SET_NULL, null=True, blank=True, related_name='logs')
    ip_address = models.GenericIPAddressField(blank=True, null=True)
    user_agent = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.level.upper()} - {self.message[:50]}"

    class Meta:
        db_table = 'superadmin_system_logs'
        ordering = ['-created_at']


class SystemHealth(models.Model):
    service_name = models.CharField(max_length=100)
    status = models.CharField(max_length=20, default='healthy')
    response_time = models.FloatField(default=0.0, help_text="Response time in milliseconds")
    uptime_percentage = models.FloatField(default=100.0)
    last_check = models.DateTimeField(auto_now=True)
    error_message = models.TextField(blank=True, null=True)

    def __str__(self):
        return f"{self.service_name} - {self.status}"

    class Meta:
        db_table = 'superadmin_system_health'
