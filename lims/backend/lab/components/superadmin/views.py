from rest_framework import generics, status, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.db.models import Count, Sum, Avg, Q
from django.utils import timezone
from datetime import datetime, timedelta
import random

from .models import (
    Tenant, BillingPlan, TenantPlan, BillingTransaction, UsageMetrics, 
    SystemLog, SystemHealth, SuperAdminUser, UserSession, DatabaseBackup,
    GlobalNotification, NotificationTemplate, NotificationHistory
)
from .serializers import (
    TenantSerializer, BillingPlanSerializer, TenantPlanSerializer,
    BillingTransactionSerializer, UsageMetricsSerializer, SystemLogSerializer,
    SystemHealthSerializer, TenantDashboardSerializer, UsageAnalysisSerializer,
    BillingAnalyticsSerializer, SuperAdminUserSerializer, UserSessionSerializer,
    DatabaseBackupSerializer, GlobalNotificationSerializer, NotificationTemplateSerializer,
    NotificationHistorySerializer
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

    def update(self, request, *args, **kwargs):
        """Custom update method to handle partial updates properly"""
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        
        # Log the request data for debugging
        print("Update request data: {}".format(request.data))
        print("Instance data: {}".format(instance.__dict__))
        
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        else:
            print("Serializer errors: {}".format(serializer.errors))
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def partial_update(self, request, *args, **kwargs):
        """Handle PATCH requests for partial updates"""
        kwargs['partial'] = True
        return self.update(request, *args, **kwargs)

    def destroy(self, request, *args, **kwargs):
        """Custom delete method to handle tenant deletion with proper error handling"""
        try:
            tenant = self.get_object()
            tenant_id = tenant.id
            tenant_name = tenant.company_name
            
            # Use Django's built-in CASCADE deletion with proper error handling
            from django.db import transaction, IntegrityError, DatabaseError
            
            try:
                with transaction.atomic():
                    # Let Django handle the CASCADE deletion
                    tenant.delete()
                    
                return Response({
                    'message': 'Tenant "{}" deleted successfully'.format(tenant_name),
                    'deleted_tenant_id': tenant_id
                }, status=status.HTTP_200_OK)
                
            except (IntegrityError, DatabaseError) as e:
                # Handle database constraint errors or missing table errors
                error_msg = str(e)
                if "no such table" in error_msg:
                    return Response({
                        'error': 'Database schema issue detected',
                        'details': 'Some related tables are missing from the database. Please run migrations or contact system administrator.',
                        'technical_details': error_msg
                    }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
                else:
                    return Response({
                        'error': 'Cannot delete tenant due to database constraints: {}'.format(error_msg),
                        'details': 'The tenant has related data that prevents deletion. Please delete related records first.'
                    }, status=status.HTTP_400_BAD_REQUEST)
                
        except Exception as e:
            return Response({
                'error': 'Failed to delete tenant: {}'.format(str(e)),
                'details': 'An unexpected error occurred while deleting the tenant'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

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


# New ViewSets for Additional Functionality
class SuperAdminUserViewSet(viewsets.ModelViewSet):
    queryset = SuperAdminUser.objects.all().order_by('-created_at')
    serializer_class = SuperAdminUserSerializer
    permission_classes = [AllowAny]  # Temporarily allow unauthenticated access for testing

    def get_queryset(self):
        queryset = super().get_queryset()
        
        # Filter by status
        status = self.request.query_params.get('status')
        if status:
            queryset = queryset.filter(status=status)
        
        # Filter by role
        role = self.request.query_params.get('role')
        if role:
            queryset = queryset.filter(role=role)
        
        # Search by name or email
        search = self.request.query_params.get('search')
        if search:
            queryset = queryset.filter(
                Q(first_name__icontains=search) | 
                Q(last_name__icontains=search) |
                Q(email__icontains=search) |
                Q(username__icontains=search)
            )
        
        return queryset

    @action(detail=True, methods=['post'])
    def suspend(self, request, pk=None):
        user = self.get_object()
        user.status = 'suspended'
        user.is_active = False
        user.save()
        return Response({'message': 'User suspended successfully'})

    @action(detail=True, methods=['post'])
    def activate(self, request, pk=None):
        user = self.get_object()
        user.status = 'active'
        user.is_active = True
        user.save()
        return Response({'message': 'User activated successfully'})


class UserSessionViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = UserSession.objects.all().order_by('-last_activity')
    serializer_class = UserSessionSerializer
    permission_classes = [AllowAny]  # Temporarily allow unauthenticated access for testing

    def get_queryset(self):
        queryset = super().get_queryset()
        
        # Filter by status
        status = self.request.query_params.get('status')
        if status:
            queryset = queryset.filter(status=status)
        
        # Filter by role
        role = self.request.query_params.get('role')
        if role:
            queryset = queryset.filter(user_role__icontains=role)
        
        # Filter by tenant
        tenant = self.request.query_params.get('tenant')
        if tenant:
            queryset = queryset.filter(tenant_id=tenant)
        
        # Search by user name or email
        search = self.request.query_params.get('search')
        if search:
            queryset = queryset.filter(
                Q(user_name__icontains=search) | 
                Q(user_email__icontains=search) |
                Q(tenant_name__icontains=search)
            )
        
        return queryset

    @action(detail=False, methods=['get'])
    def stats(self, request):
        """Get user session statistics"""
        queryset = self.get_queryset()
        
        total_sessions = queryset.count()
        online_users = queryset.filter(status='online').count()
        idle_users = queryset.filter(status='idle').count()
        away_users = queryset.filter(status='away').count()
        
        return Response({
            'total_sessions': total_sessions,
            'online_users': online_users,
            'idle_users': idle_users,
            'away_users': away_users
        })

    @action(detail=False, methods=['get'])
    def recent_activity(self, request):
        """Get recent user activity based on session data"""
        queryset = self.get_queryset().order_by('-last_activity')[:10]
        
        # Define activity types based on user actions and status changes
        activity_types = [
            'logged in',
            'created new test request', 
            'completed test report',
            'updated patient record',
            'viewed dashboard',
            'sent message',
            'uploaded file',
            'generated report',
            'went idle',
            'went away',
            'came back online'
        ]
        
        activities = []
        for i, session in enumerate(queryset):
            # Determine activity type based on session status and actions
            if session.status == 'online' and session.actions_count > 0:
                # Active user - assign activity based on actions count
                activity_type = activity_types[session.actions_count % len(activity_types)]
            elif session.status == 'idle':
                activity_type = 'went idle'
            elif session.status == 'away':
                activity_type = 'went away'
            else:
                activity_type = 'logged in'
            
            # Calculate last activity ago manually
            from django.utils import timezone
            from django.utils.timesince import timesince
            last_activity_ago = timesince(session.last_activity, timezone.now())
            
            # Create activity entry
            activity = {
                'id': f"activity_{session.id}",
                'user_name': session.user_name,
                'user_id': session.user_id,
                'activity_type': activity_type,
                'tenant_name': session.tenant_name or 'System',
                'last_activity_ago': last_activity_ago,
                'status': session.status,
                'actions_count': session.actions_count,
                'timestamp': session.last_activity.isoformat()
            }
            activities.append(activity)
        
        return Response(activities)


class DatabaseBackupViewSet(viewsets.ModelViewSet):
    queryset = DatabaseBackup.objects.all().order_by('-created_at')
    serializer_class = DatabaseBackupSerializer
    permission_classes = [AllowAny]  # Temporarily allow unauthenticated access for testing

    def get_queryset(self):
        queryset = super().get_queryset()
        
        # Filter by status
        status = self.request.query_params.get('status')
        if status:
            queryset = queryset.filter(status=status)
        
        # Filter by backup type
        backup_type = self.request.query_params.get('backup_type')
        if backup_type:
            queryset = queryset.filter(backup_type=backup_type)
        
        return queryset

    @action(detail=True, methods=['post'])
    def start_backup(self, request, pk=None):
        backup = self.get_object()
        backup.status = 'in_progress'
        backup.save()
        
        # Here you would implement actual backup logic
        # For now, we'll simulate it
        import threading
        def simulate_backup():
            import time
            time.sleep(5)  # Simulate backup time
            backup.status = 'completed'
            backup.completed_at = timezone.now()
            backup.file_path = "/backups/{}_{}.sql".format(backup.name, backup.id)
            backup.file_size = 1024 * 1024 * 50  # 50MB
            backup.save()
        
        thread = threading.Thread(target=simulate_backup)
        thread.start()
        
        return Response({'message': 'Backup started successfully'})

    @action(detail=True, methods=['post'])
    def download(self, request, pk=None):
        backup = self.get_object()
        if backup.status != 'completed':
            return Response({'error': 'Backup not completed'}, status=status.HTTP_400_BAD_REQUEST)
        
        # Here you would implement actual file download
        return Response({'message': 'Download started', 'file_path': backup.file_path})


class GlobalNotificationViewSet(viewsets.ModelViewSet):
    queryset = GlobalNotification.objects.all().order_by('-created_at')
    serializer_class = GlobalNotificationSerializer
    permission_classes = [AllowAny]  # Temporarily allow unauthenticated access for testing

    def get_queryset(self):
        queryset = super().get_queryset()
        
        # Filter by notification type
        notification_type = self.request.query_params.get('notification_type')
        if notification_type:
            queryset = queryset.filter(notification_type=notification_type)
        
        # Filter by priority
        priority = self.request.query_params.get('priority')
        if priority:
            queryset = queryset.filter(priority=priority)
        
        # Filter by status
        is_active = self.request.query_params.get('is_active')
        if is_active is not None:
            queryset = queryset.filter(is_active=is_active.lower() == 'true')
        
        return queryset

    @action(detail=True, methods=['post'])
    def send(self, request, pk=None):
        notification = self.get_object()
        
        # Here you would implement actual notification sending logic
        # For now, we'll simulate it
        notification.sent_at = timezone.now()
        notification.total_recipients = 100  # Mock data
        notification.delivered_count = 95    # Mock data
        notification.read_count = 80         # Mock data
        notification.save()
        
        return Response({'message': 'Notification sent successfully'})

    @action(detail=False, methods=['get'])
    def templates(self, request):
        """Get available notification templates"""
        templates = NotificationTemplate.objects.filter(is_active=True)
        serializer = NotificationTemplateSerializer(templates, many=True)
        return Response(serializer.data)


class NotificationTemplateViewSet(viewsets.ModelViewSet):
    queryset = NotificationTemplate.objects.all().order_by('-created_at')
    serializer_class = NotificationTemplateSerializer
    permission_classes = [AllowAny]  # Temporarily allow unauthenticated access for testing

    @action(detail=True, methods=['post'])
    def use_template(self, request, pk=None):
        template = self.get_object()
        
        # Create a new notification from template
        notification_data = {
            'title': template.title_template,
            'message': template.message_template,
            'notification_type': template.notification_type,
            'created_by': request.data.get('created_by', 'system')
        }
        
        serializer = GlobalNotificationSerializer(data=notification_data)
        if serializer.is_valid():
            notification = serializer.save()
            return Response({
                'message': 'Notification created from template',
                'notification': GlobalNotificationSerializer(notification).data
            })
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class NotificationHistoryViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = NotificationHistory.objects.all().order_by('-sent_at')
    serializer_class = NotificationHistorySerializer
    permission_classes = [AllowAny]  # Temporarily allow unauthenticated access for testing

    def get_queryset(self):
        queryset = super().get_queryset()
        
        # Filter by notification
        notification = self.request.query_params.get('notification')
        if notification:
            queryset = queryset.filter(notification_id=notification)
        
        # Filter by status
        status = self.request.query_params.get('status')
        if status:
            queryset = queryset.filter(status=status)
        
        # Filter by tenant
        tenant = self.request.query_params.get('tenant')
        if tenant:
            queryset = queryset.filter(tenant_id=tenant)
        
        return queryset


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
