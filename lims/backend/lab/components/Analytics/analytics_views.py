from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import filters
from django.db.models import Avg, Count, Sum
from datetime import datetime, timedelta
from .analytics_models import LabAnalytics, TestCategoryAnalytics, SystemLog
from .analytics_serializers import (
    LabAnalyticsSerializer, TestCategoryAnalyticsSerializer, 
    SystemLogSerializer, SystemLogListSerializer, AnalyticsSummarySerializer
)

class LabAnalyticsViewSet(viewsets.ModelViewSet):
    queryset = LabAnalytics.objects.all()
    serializer_class = LabAnalyticsSerializer
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    filterset_fields = ['tenant', 'date']
    ordering_fields = ['date', 'total_tests', 'success_rate']
    ordering = ['-date']
    
    @action(detail=False, methods=['get'])
    def summary(self, request):
        tenant = request.query_params.get('tenant')
        days = int(request.query_params.get('days', 30))
        
        end_date = datetime.now().date()
        start_date = end_date - timedelta(days=days)
        
        queryset = self.get_queryset()
        if tenant:
            queryset = queryset.filter(tenant=tenant)
        
        queryset = queryset.filter(date__range=[start_date, end_date])
        
        # Calculate summary statistics
        total_tests = queryset.aggregate(total=Sum('total_tests'))['total'] or 0
        avg_success_rate = queryset.aggregate(avg=Avg('success_rate'))['avg'] or 0
        critical_failures = queryset.aggregate(total=Sum('failed_tests'))['total'] or 0
        
        # Equipment status
        latest_analytics = queryset.order_by('-date').first()
        equipment_status = {
            'operational': latest_analytics.equipment_operational if latest_analytics else 0,
            'maintenance': latest_analytics.equipment_maintenance if latest_analytics else 0,
            'out_of_service': latest_analytics.equipment_out_of_service if latest_analytics else 0,
        }
        
        # Test categories
        category_analytics = TestCategoryAnalytics.objects.filter(
            tenant=tenant, date__range=[start_date, end_date]
        ).values('category').annotate(
            total_tests=Sum('total_tests'),
            avg_success_rate=Avg('success_rate'),
            failures=Sum('failures')
        ).order_by('-total_tests')[:10]
        
        summary_data = {
            'total_tests': total_tests,
            'success_rate': float(avg_success_rate),
            'avg_turnaround_time': None,  # Would need to calculate from actual test data
            'critical_failures': critical_failures,
            'equipment_status': equipment_status,
            'test_categories': list(category_analytics)
        }
        
        serializer = AnalyticsSummarySerializer(summary_data)
        return Response(serializer.data)

class TestCategoryAnalyticsViewSet(viewsets.ModelViewSet):
    queryset = TestCategoryAnalytics.objects.all()
    serializer_class = TestCategoryAnalyticsSerializer
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    filterset_fields = ['tenant', 'category', 'date']
    ordering_fields = ['date', 'total_tests', 'success_rate']
    ordering = ['-date']

class SystemLogViewSet(viewsets.ModelViewSet):
    queryset = SystemLog.objects.all()
    serializer_class = SystemLogSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['level', 'tenant', 'user']
    search_fields = ['action', 'details', 'user']
    ordering_fields = ['created_at', 'level']
    ordering = ['-created_at']
    
    def get_serializer_class(self):
        if self.action == 'list':
            return SystemLogListSerializer
        return SystemLogSerializer
    
    @action(detail=False, methods=['get'])
    def export(self, request):
        # Export logs functionality
        queryset = self.filter_queryset(self.get_queryset())
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)
