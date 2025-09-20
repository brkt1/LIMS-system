from rest_framework import serializers
from .analytics_models import LabAnalytics, TestCategoryAnalytics, SystemLog

class LabAnalyticsSerializer(serializers.ModelSerializer):
    class Meta:
        model = LabAnalytics
        fields = ['id', 'tenant', 'date', 'total_tests', 'completed_tests', 'pending_tests', 
                 'failed_tests', 'avg_turnaround_time', 'success_rate', 'equipment_operational', 
                 'equipment_maintenance', 'equipment_out_of_service', 'created_at', 'updated_at']

class TestCategoryAnalyticsSerializer(serializers.ModelSerializer):
    class Meta:
        model = TestCategoryAnalytics
        fields = ['id', 'tenant', 'category', 'date', 'total_tests', 'success_rate', 
                 'avg_turnaround_time', 'failures', 'created_at', 'updated_at']

class SystemLogSerializer(serializers.ModelSerializer):
    class Meta:
        model = SystemLog
        fields = ['id', 'user', 'action', 'level', 'ip_address', 'details', 'tenant', 'created_at']

class SystemLogListSerializer(serializers.ModelSerializer):
    class Meta:
        model = SystemLog
        fields = ['id', 'user', 'action', 'level', 'ip_address', 'created_at']

class AnalyticsSummarySerializer(serializers.Serializer):
    total_tests = serializers.IntegerField()
    success_rate = serializers.DecimalField(max_digits=5, decimal_places=2)
    avg_turnaround_time = serializers.DurationField()
    critical_failures = serializers.IntegerField()
    equipment_status = serializers.DictField()
    test_categories = serializers.ListField()
