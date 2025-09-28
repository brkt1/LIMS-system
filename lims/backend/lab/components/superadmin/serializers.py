from rest_framework import serializers
from .models import (
    Tenant, BillingPlan, TenantPlan, BillingTransaction, UsageMetrics, 
    SystemLog, SystemHealth, SuperAdminUser, UserSession, DatabaseBackup,
    GlobalNotification, NotificationTemplate, NotificationHistory
)


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


# New Serializers for Additional Models
class SuperAdminUserSerializer(serializers.ModelSerializer):
    created_by_name = serializers.CharField(source='created_by.first_name', read_only=True)
    full_name = serializers.SerializerMethodField()

    class Meta:
        model = SuperAdminUser
        fields = [
            'id', 'username', 'email', 'first_name', 'last_name', 'full_name',
            'role', 'status', 'is_active', 'last_login', 'created_at', 'updated_at',
            'created_by', 'created_by_name'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at', 'last_login']

    def get_full_name(self, obj):
        return f"{obj.first_name} {obj.last_name}"


class UserSessionSerializer(serializers.ModelSerializer):
    session_duration = serializers.SerializerMethodField()
    last_activity_ago = serializers.SerializerMethodField()

    class Meta:
        model = UserSession
        fields = [
            'id', 'user_id', 'user_name', 'user_email', 'user_role',
            'tenant_id', 'tenant_name', 'status', 'ip_address', 'user_agent',
            'location', 'device_info', 'session_start', 'last_activity',
            'actions_count', 'is_active', 'session_duration', 'last_activity_ago'
        ]
        read_only_fields = ['id', 'session_start', 'last_activity']

    def get_session_duration(self, obj):
        from django.utils import timezone
        duration = timezone.now() - obj.session_start
        hours = duration.total_seconds() // 3600
        minutes = (duration.total_seconds() % 3600) // 60
        return f"{int(hours)}h {int(minutes)}m"

    def get_last_activity_ago(self, obj):
        from django.utils import timezone
        from django.utils.timesince import timesince
        return timesince(obj.last_activity, timezone.now())


class DatabaseBackupSerializer(serializers.ModelSerializer):
    file_size_mb = serializers.SerializerMethodField()
    created_by_name = serializers.CharField(source='created_by', read_only=True)

    class Meta:
        model = DatabaseBackup
        fields = [
            'id', 'name', 'backup_type', 'status', 'file_path', 'file_size',
            'file_size_mb', 'created_by', 'created_by_name', 'created_at',
            'completed_at', 'scheduled_at', 'is_scheduled', 'schedule_frequency',
            'notes', 'error_message'
        ]
        read_only_fields = ['id', 'created_at', 'completed_at']

    def get_file_size_mb(self, obj):
        if obj.file_size:
            return round(obj.file_size / (1024 * 1024), 2)
        return None


class GlobalNotificationSerializer(serializers.ModelSerializer):
    created_by_name = serializers.CharField(source='created_by', read_only=True)
    delivery_rate = serializers.SerializerMethodField()

    class Meta:
        model = GlobalNotification
        fields = [
            'id', 'title', 'message', 'notification_type', 'priority',
            'target_audience', 'target_tenants', 'target_roles', 'is_scheduled',
            'scheduled_at', 'expires_at', 'is_active', 'created_by', 'created_by_name',
            'created_at', 'sent_at', 'total_recipients', 'delivered_count',
            'read_count', 'delivery_rate'
        ]
        read_only_fields = ['id', 'created_at', 'sent_at', 'total_recipients', 'delivered_count', 'read_count']

    def get_delivery_rate(self, obj):
        if obj.total_recipients > 0:
            return round((obj.delivered_count / obj.total_recipients) * 100, 2)
        return 0


class NotificationTemplateSerializer(serializers.ModelSerializer):
    created_by_name = serializers.CharField(source='created_by', read_only=True)

    class Meta:
        model = NotificationTemplate
        fields = [
            'id', 'name', 'title_template', 'message_template', 'notification_type',
            'is_active', 'created_by', 'created_by_name', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']


class NotificationHistorySerializer(serializers.ModelSerializer):
    notification_title = serializers.CharField(source='notification.title', read_only=True)
    time_since_sent = serializers.SerializerMethodField()

    class Meta:
        model = NotificationHistory
        fields = [
            'id', 'notification', 'notification_title', 'recipient_id', 'recipient_email',
            'recipient_name', 'tenant_id', 'tenant_name', 'sent_at', 'delivered_at',
            'read_at', 'status', 'time_since_sent'
        ]
        read_only_fields = ['id', 'sent_at']

    def get_time_since_sent(self, obj):
        from django.utils import timezone
        from django.utils.timesince import timesince
        return timesince(obj.sent_at, timezone.now())
