from rest_framework import serializers
from .models import Tenant, BillingPlan, TenantPlan, BillingTransaction, UsageMetrics, SystemLog, SystemHealth


class TenantSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    plan_name = serializers.CharField(source='plan.billing_plan.name', read_only=True)
    plan_price = serializers.DecimalField(source='plan.billing_plan.price', max_digits=10, decimal_places=2, read_only=True)
    revenue = serializers.SerializerMethodField()
    growth = serializers.SerializerMethodField()

    class Meta:
        model = Tenant
        fields = [
            'id', 'company_name', 'domain', 'email', 'password',
            'status', 'billing_period', 'max_users', 'current_users',
            'created_by', 'created_at', 'last_active', 'is_paid',
            'plan_name', 'plan_price', 'revenue', 'growth'
        ]
        read_only_fields = ['id', 'created_at', 'last_active', 'current_users']

    def create(self, validated_data):
        password = validated_data.pop('password')
        tenant = Tenant.objects.create_user(password=password, **validated_data)
        return tenant

    def get_revenue(self, obj):
        # Calculate monthly revenue based on plan
        try:
            plan = obj.plan.billing_plan
            return float(plan.price)
        except:
            return 0.0

    def get_growth(self, obj):
        # Calculate growth percentage (mock data for now)
        import random
        return round(random.uniform(-5, 20), 1)


class BillingPlanSerializer(serializers.ModelSerializer):
    active_tenants = serializers.SerializerMethodField()
    monthly_revenue = serializers.SerializerMethodField()

    class Meta:
        model = BillingPlan
        fields = [
            'id', 'name', 'plan_type', 'price', 'billing_cycle',
            'max_users', 'features', 'is_active', 'created_at',
            'updated_at', 'active_tenants', 'monthly_revenue'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']

    def get_active_tenants(self, obj):
        return obj.tenantplan_set.filter(is_active=True).count()

    def get_monthly_revenue(self, obj):
        active_tenants = obj.tenantplan_set.filter(is_active=True).count()
        return float(obj.price) * active_tenants


class TenantPlanSerializer(serializers.ModelSerializer):
    tenant_name = serializers.CharField(source='tenant.company_name', read_only=True)
    plan_name = serializers.CharField(source='billing_plan.name', read_only=True)

    class Meta:
        model = TenantPlan
        fields = [
            'id', 'tenant', 'tenant_name', 'billing_plan', 'plan_name',
            'start_date', 'end_date', 'is_active', 'auto_renew'
        ]


class BillingTransactionSerializer(serializers.ModelSerializer):
    tenant_name = serializers.CharField(source='tenant.company_name', read_only=True)
    plan_name = serializers.CharField(source='billing_plan.name', read_only=True)

    class Meta:
        model = BillingTransaction
        fields = [
            'id', 'tenant', 'tenant_name', 'billing_plan', 'plan_name',
            'amount', 'status', 'payment_method', 'transaction_id',
            'payment_reference', 'created_at', 'paid_at', 'notes'
        ]
        read_only_fields = ['id', 'created_at', 'transaction_id']


class UsageMetricsSerializer(serializers.ModelSerializer):
    tenant_name = serializers.CharField(source='tenant.company_name', read_only=True)

    class Meta:
        model = UsageMetrics
        fields = [
            'id', 'tenant', 'tenant_name', 'date', 'active_users',
            'total_tests', 'total_reports', 'api_calls', 'storage_used',
            'bandwidth_used', 'created_at'
        ]
        read_only_fields = ['id', 'created_at']


class SystemLogSerializer(serializers.ModelSerializer):
    tenant_name = serializers.CharField(source='tenant.company_name', read_only=True)

    class Meta:
        model = SystemLog
        fields = [
            'id', 'level', 'message', 'action', 'user', 'tenant',
            'tenant_name', 'ip_address', 'user_agent', 'created_at'
        ]
        read_only_fields = ['id', 'created_at']


class SystemHealthSerializer(serializers.ModelSerializer):
    class Meta:
        model = SystemHealth
        fields = [
            'id', 'service_name', 'status', 'response_time',
            'uptime_percentage', 'last_check', 'error_message'
        ]
        read_only_fields = ['id', 'last_check']


# Dashboard and Analytics Serializers
class TenantDashboardSerializer(serializers.Serializer):
    total_tenants = serializers.IntegerField()
    active_tenants = serializers.IntegerField()
    total_users = serializers.IntegerField()
    total_revenue = serializers.DecimalField(max_digits=12, decimal_places=2)
    system_health = serializers.FloatField()


class UsageAnalysisSerializer(serializers.Serializer):
    total_users = serializers.IntegerField()
    active_users = serializers.IntegerField()
    total_tenants = serializers.IntegerField()
    active_tenants = serializers.IntegerField()
    total_tests = serializers.IntegerField()
    total_reports = serializers.IntegerField()
    system_uptime = serializers.FloatField()
    avg_response_time = serializers.FloatField()


class BillingAnalyticsSerializer(serializers.Serializer):
    total_revenue = serializers.DecimalField(max_digits=12, decimal_places=2)
    monthly_recurring = serializers.DecimalField(max_digits=12, decimal_places=2)
    annual_recurring = serializers.DecimalField(max_digits=12, decimal_places=2)
    churn_rate = serializers.FloatField()
    average_revenue_per_user = serializers.DecimalField(max_digits=10, decimal_places=2)
    total_customers = serializers.IntegerField()
