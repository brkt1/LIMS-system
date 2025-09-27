from rest_framework import generics, status, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.db.models import Count, Sum, Avg, Q
from django.utils import timezone
from datetime import datetime, timedelta
import random

from .models import Tenant, BillingPlan, TenantPlan, BillingTransaction, UsageMetrics, SystemLog, SystemHealth
from .serializers import (
    TenantSerializer, BillingPlanSerializer, TenantPlanSerializer,
    BillingTransactionSerializer, UsageMetricsSerializer, SystemLogSerializer,
    SystemHealthSerializer, TenantDashboardSerializer, UsageAnalysisSerializer,
    BillingAnalyticsSerializer
)


class TenantViewSet(viewsets.ModelViewSet):
    queryset = Tenant.objects.all().order_by('-created_at')
    serializer_class = TenantSerializer
    permission_classes = [AllowAny]  # Temporarily allow unauthenticated access for testing

    def get_queryset(self):
        queryset = super().get_queryset()
        
        # Filter by status
        status = self.request.query_params.get('status')
        if status:
            queryset = queryset.filter(status=status)
        
        # Search by name or domain
        search = self.request.query_params.get('search')
        if search:
            queryset = queryset.filter(
                Q(company_name__icontains=search) | 
                Q(domain__icontains=search) |
                Q(email__icontains=search)
            )
        
        return queryset

    @action(detail=True, methods=['post'])
    def suspend(self, request, pk=None):
        tenant = self.get_object()
        tenant.status = 'suspended'
        tenant.save()
        return Response({'message': 'Tenant suspended successfully'})

    @action(detail=True, methods=['post'])
    def activate(self, request, pk=None):
        tenant = self.get_object()
        tenant.status = 'active'
        tenant.save()
        return Response({'message': 'Tenant activated successfully'})

    @action(detail=False, methods=['get'])
    def count(self, request):
        count = self.get_queryset().count()
        return Response({'count': count})

    @action(detail=False, methods=['get'])
    def dashboard_stats(self, request):
        queryset = self.get_queryset()
        
        total_tenants = queryset.count()
        active_tenants = queryset.filter(status='active').count()
        total_users = queryset.aggregate(total=Sum('current_users'))['total'] or 0
        
        # Calculate total revenue
        total_revenue = 0
        for tenant in queryset.filter(status='active'):
            try:
                plan = tenant.plan.billing_plan
                total_revenue += float(plan.price)
            except:
                pass
        
        # System health (mock data)
        system_health = 99.9
        
        data = {
            'total_tenants': total_tenants,
            'active_tenants': active_tenants,
            'total_users': total_users,
            'total_revenue': total_revenue,
            'system_health': system_health
        }
        
        serializer = TenantDashboardSerializer(data)
        return Response(serializer.data)


class BillingPlanViewSet(viewsets.ModelViewSet):
    queryset = BillingPlan.objects.all().order_by('price')
    serializer_class = BillingPlanSerializer
    permission_classes = [AllowAny]  # Temporarily allow unauthenticated access for testing

    @action(detail=False, methods=['get'])
    def analytics(self, request):
        # Calculate billing analytics
        total_revenue = 0
        monthly_recurring = 0
        total_customers = 0
        
        for plan in self.get_queryset():
            active_tenants = plan.tenantplan_set.filter(is_active=True).count()
            total_customers += active_tenants
            plan_revenue = float(plan.price) * active_tenants
            total_revenue += plan_revenue
            
            if plan.billing_cycle == 'monthly':
                monthly_recurring += plan_revenue
            else:  # yearly
                monthly_recurring += plan_revenue / 12
        
        annual_recurring = monthly_recurring * 12
        churn_rate = 2.1  # Mock data
        arpu = total_revenue / total_customers if total_customers > 0 else 0
        
        data = {
            'total_revenue': total_revenue,
            'monthly_recurring': monthly_recurring,
            'annual_recurring': annual_recurring,
            'churn_rate': churn_rate,
            'average_revenue_per_user': arpu,
            'total_customers': total_customers
        }
        
        serializer = BillingAnalyticsSerializer(data)
        return Response(serializer.data)


class BillingTransactionViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = BillingTransaction.objects.all().order_by('-created_at')
    serializer_class = BillingTransactionSerializer
    permission_classes = [AllowAny]  # Temporarily allow unauthenticated access for testing

    def get_queryset(self):
        queryset = super().get_queryset()
        
        # Filter by status
        status = self.request.query_params.get('status')
        if status:
            queryset = queryset.filter(status=status)
        
        # Filter by tenant
        tenant = self.request.query_params.get('tenant')
        if tenant:
            queryset = queryset.filter(tenant_id=tenant)
        
        return queryset


class UsageMetricsViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = UsageMetrics.objects.all().order_by('-date')
    serializer_class = UsageMetricsSerializer
    permission_classes = [AllowAny]  # Temporarily allow unauthenticated access for testing

    @action(detail=False, methods=['get'])
    def analysis(self, request):
        # Get time range
        days = int(request.query_params.get('days', 30))
        end_date = timezone.now().date()
        start_date = end_date - timedelta(days=days)
        
        # Aggregate usage data
        metrics = UsageMetrics.objects.filter(date__range=[start_date, end_date])
        
        total_users = Tenant.objects.aggregate(total=Sum('current_users'))['total'] or 0
        active_users = int(total_users * 0.7)  # Mock: 70% active
        total_tenants = Tenant.objects.filter(status='active').count()
        active_tenants = total_tenants
        
        total_tests = metrics.aggregate(total=Sum('total_tests'))['total'] or 0
        total_reports = metrics.aggregate(total=Sum('total_reports'))['total'] or 0
        
        # System metrics (mock data)
        system_uptime = 99.9
        avg_response_time = 245.0
        
        data = {
            'total_users': total_users,
            'active_users': active_users,
            'total_tenants': total_tenants,
            'active_tenants': active_tenants,
            'total_tests': total_tests,
            'total_reports': total_reports,
            'system_uptime': system_uptime,
            'avg_response_time': avg_response_time
        }
        
        serializer = UsageAnalysisSerializer(data)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def tenant_usage(self, request):
        # Get usage by tenant
        tenants = Tenant.objects.filter(status='active')
        usage_data = []
        
        for tenant in tenants:
            # Get recent usage metrics
            recent_metrics = UsageMetrics.objects.filter(
                tenant=tenant
            ).order_by('-date').first()
            
            if recent_metrics:
                usage_data.append({
                    'tenant_name': tenant.company_name,
                    'users': recent_metrics.active_users,
                    'tests': recent_metrics.total_tests,
                    'reports': recent_metrics.total_reports,
                    'growth': round(random.uniform(-5, 20), 1)  # Mock growth
                })
        
        return Response(usage_data)

    @action(detail=False, methods=['get'])
    def feature_usage(self, request):
        # Mock feature usage data
        feature_usage = [
            {'feature': 'Test Management', 'usage': 95, 'users': 1180},
            {'feature': 'Report Generation', 'usage': 88, 'users': 1097},
            {'feature': 'Analytics Dashboard', 'usage': 76, 'users': 947},
            {'feature': 'API Access', 'usage': 45, 'users': 561},
            {'feature': 'Custom Branding', 'usage': 32, 'users': 399},
            {'feature': 'Data Export', 'usage': 28, 'users': 349},
        ]
        
        return Response(feature_usage)


class SystemLogViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = SystemLog.objects.all().order_by('-created_at')
    serializer_class = SystemLogSerializer
    permission_classes = [AllowAny]  # Temporarily allow unauthenticated access for testing

    def get_queryset(self):
        queryset = super().get_queryset()
        
        # Filter by level
        level = self.request.query_params.get('level')
        if level:
            queryset = queryset.filter(level=level)
        
        # Filter by tenant
        tenant = self.request.query_params.get('tenant')
        if tenant:
            queryset = queryset.filter(tenant_id=tenant)
        
        # Limit to recent logs
        limit = int(self.request.query_params.get('limit', 100))
        queryset = queryset[:limit]
        
        return queryset

    @action(detail=False, methods=['get'])
    def recent_activity(self, request):
        # Get recent system activity
        logs = self.get_queryset()[:10]
        serializer = self.get_serializer(logs, many=True)
        return Response(serializer.data)


class SystemHealthViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = SystemHealth.objects.all()
    serializer_class = SystemHealthSerializer
    permission_classes = [AllowAny]  # Temporarily allow unauthenticated access for testing

    @action(detail=False, methods=['get'])
    def overall_status(self, request):
        # Get overall system health
        services = self.get_queryset()
        total_services = services.count()
        healthy_services = services.filter(status='healthy').count()
        
        overall_uptime = (healthy_services / total_services * 100) if total_services > 0 else 100
        avg_response_time = services.aggregate(avg=Avg('response_time'))['avg'] or 0
        
        return Response({
            'overall_status': 'healthy' if overall_uptime > 95 else 'degraded',
            'uptime_percentage': round(overall_uptime, 2),
            'avg_response_time': round(avg_response_time, 2),
            'total_services': total_services,
            'healthy_services': healthy_services
        })


# Legacy views for backward compatibility
class TenantListCreateView(generics.ListCreateAPIView):
    queryset = Tenant.objects.all().order_by('-created_at')
    serializer_class = TenantSerializer
    permission_classes = [AllowAny]  # Temporarily allow unauthenticated access for testing

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        tenant = serializer.save()
        return Response({
            'message': 'Tenant created successfully',
            'tenant': TenantSerializer(tenant).data
        }, status=status.HTTP_201_CREATED)
