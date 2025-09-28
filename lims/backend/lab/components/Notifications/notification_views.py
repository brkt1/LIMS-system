from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import filters
from django.contrib.auth import get_user_model
from .notification_models import Notification, NotificationPreference
from .notification_serializers import NotificationSerializer, NotificationListSerializer, NotificationPreferenceSerializer
from .notification_service import NotificationService

User = get_user_model()

class NotificationViewSet(viewsets.ModelViewSet):
    queryset = Notification.objects.all()
    serializer_class = NotificationSerializer
    permission_classes = [AllowAny]  # Temporarily allow unauthenticated access for testing
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['notification_type', 'priority', 'is_read', 'is_global', 'tenant', 'recipient']
    search_fields = ['title', 'message']
    ordering_fields = ['created_at', 'priority']
    ordering = ['-created_at']
    
    def get_serializer_class(self):
        if self.action == 'list':
            return NotificationListSerializer
        return NotificationSerializer
    
    @action(detail=True, methods=['post'])
    def mark_read(self, request, pk=None):
        notification = self.get_object()
        notification.is_read = True
        notification.save()
        return Response({'status': 'Notification marked as read'})
    
    @action(detail=False, methods=['post'])
    def mark_all_read(self, request):
        user = request.user
        tenant = request.data.get('tenant')
        
        queryset = Notification.objects.filter(recipient=user, is_read=False)
        if tenant:
            queryset = queryset.filter(tenant=tenant)
        
        queryset.update(is_read=True)
        return Response({'status': 'All notifications marked as read'})
    
    @action(detail=False, methods=['get'])
    def unread_count(self, request):
        user = request.user
        tenant = request.query_params.get('tenant')
        
        queryset = Notification.objects.filter(recipient=user, is_read=False)
        if tenant:
            queryset = queryset.filter(tenant=tenant)
        
        count = queryset.count()
        return Response({'unread_count': count})
    
    @action(detail=False, methods=['post'])
    def send_global(self, request):
        """Send a global notification to all users or specific audiences"""
        try:
            data = request.data
            
            # Validate required fields
            required_fields = ['title', 'message']
            for field in required_fields:
                if not data.get(field):
                    return Response(
                        {'error': f'{field} is required'}, 
                        status=status.HTTP_400_BAD_REQUEST
                    )
            
            # Extract parameters
            title = data['title']
            message = data['message']
            notification_type = data.get('notification_type', 'info')
            priority = data.get('priority', 'medium')
            target_audience = data.get('target_audience', 'all')
            target_roles = data.get('target_roles', [])
            target_tenants = data.get('target_tenants', [])
            action_url = data.get('action_url')
            expires_in_hours = data.get('expires_in_hours', 24)
            created_by = data.get('created_by', request.user.email if request.user.is_authenticated else 'system')
            
            # Send global notification
            result = NotificationService.create_global_notification(
                title=title,
                message=message,
                notification_type=notification_type,
                priority=priority,
                target_audience=target_audience,
                target_roles=target_roles,
                target_tenants=target_tenants,
                action_url=action_url,
                expires_in_hours=expires_in_hours,
                created_by=created_by
            )
            
            if result['success']:
                return Response(result, status=status.HTTP_201_CREATED)
            else:
                return Response(result, status=status.HTTP_400_BAD_REQUEST)
                
        except Exception as e:
            return Response(
                {'error': str(e)}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    
    @action(detail=False, methods=['post'])
    def send_to_roles(self, request):
        """Send notification to specific roles"""
        try:
            data = request.data
            
            # Validate required fields
            required_fields = ['title', 'message', 'roles']
            for field in required_fields:
                if not data.get(field):
                    return Response(
                        {'error': f'{field} is required'}, 
                        status=status.HTTP_400_BAD_REQUEST
                    )
            
            result = NotificationService.send_global_notification_to_roles(
                title=data['title'],
                message=data['message'],
                roles=data['roles'],
                notification_type=data.get('notification_type', 'info'),
                priority=data.get('priority', 'medium'),
                action_url=data.get('action_url'),
                expires_in_hours=data.get('expires_in_hours', 24)
            )
            
            if result['success']:
                return Response(result, status=status.HTTP_201_CREATED)
            else:
                return Response(result, status=status.HTTP_400_BAD_REQUEST)
                
        except Exception as e:
            return Response(
                {'error': str(e)}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    
    @action(detail=False, methods=['post'])
    def send_to_tenants(self, request):
        """Send notification to specific tenants"""
        try:
            data = request.data
            
            # Validate required fields
            required_fields = ['title', 'message', 'tenants']
            for field in required_fields:
                if not data.get(field):
                    return Response(
                        {'error': f'{field} is required'}, 
                        status=status.HTTP_400_BAD_REQUEST
                    )
            
            result = NotificationService.send_global_notification_to_tenants(
                title=data['title'],
                message=data['message'],
                tenants=data['tenants'],
                notification_type=data.get('notification_type', 'info'),
                priority=data.get('priority', 'medium'),
                action_url=data.get('action_url'),
                expires_in_hours=data.get('expires_in_hours', 24)
            )
            
            if result['success']:
                return Response(result, status=status.HTTP_201_CREATED)
            else:
                return Response(result, status=status.HTTP_400_BAD_REQUEST)
                
        except Exception as e:
            return Response(
                {'error': str(e)}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    
    @action(detail=False, methods=['post'])
    def send_maintenance_alert(self, request):
        """Send system maintenance notification"""
        try:
            data = request.data
            
            # Validate required fields
            required_fields = ['title', 'message']
            for field in required_fields:
                if not data.get(field):
                    return Response(
                        {'error': f'{field} is required'}, 
                        status=status.HTTP_400_BAD_REQUEST
                    )
            
            result = NotificationService.send_maintenance_notification(
                title=data['title'],
                message=data['message'],
                maintenance_type=data.get('maintenance_type', 'scheduled'),
                priority=data.get('priority', 'high'),
                affected_services=data.get('affected_services', [])
            )
            
            if result['success']:
                return Response(result, status=status.HTTP_201_CREATED)
            else:
                return Response(result, status=status.HTTP_400_BAD_REQUEST)
                
        except Exception as e:
            return Response(
                {'error': str(e)}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    
    @action(detail=False, methods=['post'])
    def send_security_alert(self, request):
        """Send security alert notification"""
        try:
            data = request.data
            
            # Validate required fields
            required_fields = ['title', 'message']
            for field in required_fields:
                if not data.get(field):
                    return Response(
                        {'error': f'{field} is required'}, 
                        status=status.HTTP_400_BAD_REQUEST
                    )
            
            result = NotificationService.send_security_alert(
                title=data['title'],
                message=data['message'],
                severity=data.get('severity', 'medium'),
                action_required=data.get('action_required', False)
            )
            
            if result['success']:
                return Response(result, status=status.HTTP_201_CREATED)
            else:
                return Response(result, status=status.HTTP_400_BAD_REQUEST)
                
        except Exception as e:
            return Response(
                {'error': str(e)}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    
    def get_queryset(self):
        """Filter notifications based on user and permissions"""
        user = self.request.user
        
        # Handle anonymous users
        if not user.is_authenticated:
            return Notification.objects.none()
        
        # Super admin can see all notifications
        if hasattr(user, 'role') and user.role == 'superadmin':
            return Notification.objects.all()
        
        # Regular users can only see their own notifications
        return Notification.objects.filter(recipient=user)
    

class NotificationPreferenceViewSet(viewsets.ModelViewSet):
    queryset = NotificationPreference.objects.all()
    serializer_class = NotificationPreferenceSerializer
    permission_classes = [AllowAny]  # Temporarily allow unauthenticated access for testing
    
    def get_queryset(self):
        # Users can only see their own preferences
        return NotificationPreference.objects.filter(user=self.request.user)
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
