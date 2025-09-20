from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import filters
from .notification_models import Notification, NotificationPreference
from .notification_serializers import NotificationSerializer, NotificationListSerializer, NotificationPreferenceSerializer

class NotificationViewSet(viewsets.ModelViewSet):
    queryset = Notification.objects.all()
    serializer_class = NotificationSerializer
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
        # Send global notification to all users or specific tenant
        tenant = request.data.get('tenant')
        title = request.data.get('title')
        message = request.data.get('message')
        notification_type = request.data.get('notification_type', 'info')
        priority = request.data.get('priority', 'medium')
        
        notification = Notification.objects.create(
            title=title,
            message=message,
            notification_type=notification_type,
            priority=priority,
            is_global=True,
            tenant=tenant
        )
        
        serializer = NotificationSerializer(notification)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

class NotificationPreferenceViewSet(viewsets.ModelViewSet):
    queryset = NotificationPreference.objects.all()
    serializer_class = NotificationPreferenceSerializer
    
    def get_queryset(self):
        # Users can only see their own preferences
        return NotificationPreference.objects.filter(user=self.request.user)
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
