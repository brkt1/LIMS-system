from rest_framework import viewsets, status, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from django.utils import timezone
from django.db import models
from .support_ticket_models import (
    SupportTicket, SupportMessage, SupportAttachment, SupportStaff, 
    SupportTeam, SupportSLA, SupportAnalytics
)
from .support_ticket_serializers import (
    SupportTicketSerializer, SupportTicketListSerializer, SupportMessageSerializer,
    SupportStaffSerializer, SupportTeamSerializer, SupportSLASerializer, SupportAnalyticsSerializer
)

class SupportTicketViewSet(viewsets.ModelViewSet):
    queryset = SupportTicket.objects.all()
    serializer_class = SupportTicketSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['status', 'priority', 'category', 'assigned_to', 'created_by', 'tenant', 'is_escalated']
    search_fields = ['title', 'description', 'reporter_name', 'reporter_email']
    ordering_fields = ['created_at', 'updated_at', 'priority', 'first_response_time', 'actual_resolution_time']
    ordering = ['-created_at']
    
    def get_serializer_class(self):
        if self.action == 'list':
            return SupportTicketListSerializer
        return SupportTicketSerializer
    
    @action(detail=True, methods=['post'])
    def assign(self, request, pk=None):
        ticket = self.get_object()
        assigned_to_id = request.data.get('assigned_to')
        
        if assigned_to_id:
            ticket.assigned_to_id = assigned_to_id
            ticket.status = 'pending'
            ticket.save()
            return Response({'status': 'Ticket assigned successfully'})
        return Response({'error': 'assigned_to field is required'}, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=True, methods=['post'])
    def resolve(self, request, pk=None):
        ticket = self.get_object()
        ticket.status = 'resolved'
        ticket.save()
        return Response({'status': 'Ticket resolved successfully'})
    
    @action(detail=True, methods=['post'])
    def close(self, request, pk=None):
        ticket = self.get_object()
        ticket.status = 'closed'
        ticket.actual_resolution_time = timezone.now()
        ticket.save()
        return Response({'status': 'Ticket closed successfully'})
    
    @action(detail=True, methods=['post'])
    def escalate(self, request, pk=None):
        ticket = self.get_object()
        escalation_reason = request.data.get('escalation_reason', '')
        escalation_level = request.data.get('escalation_level', ticket.escalation_level + 1)
        
        ticket.is_escalated = True
        ticket.escalation_level = escalation_level
        ticket.escalation_reason = escalation_reason
        ticket.save()
        
        return Response({'status': 'Ticket escalated successfully'})
    
    @action(detail=True, methods=['post'])
    def add_satisfaction_rating(self, request, pk=None):
        ticket = self.get_object()
        rating = request.data.get('rating')
        feedback = request.data.get('feedback', '')
        
        if not rating or not 1 <= int(rating) <= 5:
            return Response({'error': 'Rating must be between 1 and 5'}, status=status.HTTP_400_BAD_REQUEST)
        
        ticket.satisfaction_rating = int(rating)
        ticket.satisfaction_feedback = feedback
        ticket.save()
        
        return Response({'status': 'Satisfaction rating added successfully'})
    
    @action(detail=True, methods=['post'])
    def add_message(self, request, pk=None):
        ticket = self.get_object()
        message_text = request.data.get('message')
        is_internal = request.data.get('is_internal', False)
        message_type = request.data.get('message_type', 'support_response')
        
        if not message_text:
            return Response({'error': 'Message is required'}, status=status.HTTP_400_BAD_REQUEST)
        
        # Create message
        message = SupportMessage.objects.create(
            ticket=ticket,
            sender=request.user,
            message=message_text,
            is_internal=is_internal,
            message_type=message_type
        )
        
        # Update first response time if this is the first support response
        if not ticket.first_response_time and not is_internal:
            ticket.first_response_time = timezone.now()
            ticket.save()
        
        serializer = SupportMessageSerializer(message)
        return Response(serializer.data, status=status.HTTP_201_CREATED)


class SupportStaffViewSet(viewsets.ModelViewSet):
    """ViewSet for managing support staff"""
    queryset = SupportStaff.objects.all()
    serializer_class = SupportStaffSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['specialization', 'level', 'tenant', 'is_available']
    search_fields = ['user__first_name', 'user__last_name', 'user__email', 'employee_id']
    ordering_fields = ['user__first_name', 'total_tickets_resolved', 'customer_satisfaction_rating']
    ordering = ['user__first_name']
    
    @action(detail=True, methods=['post'])
    def update_availability(self, request, pk=None):
        staff = self.get_object()
        is_available = request.data.get('is_available', True)
        staff.is_available = is_available
        staff.save()
        return Response({'status': 'Availability updated successfully'})
    
    @action(detail=True, methods=['get'])
    def workload(self, request, pk=None):
        staff = self.get_object()
        return Response({
            'current_tickets': staff.current_ticket_count,
            'max_tickets': staff.max_concurrent_tickets,
            'workload_percentage': staff.workload_percentage,
            'is_overloaded': staff.is_overloaded
        })


class SupportTeamViewSet(viewsets.ModelViewSet):
    """ViewSet for managing support teams"""
    queryset = SupportTeam.objects.all()
    serializer_class = SupportTeamSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['tenant']
    search_fields = ['name', 'description']
    ordering_fields = ['name', 'created_at']
    ordering = ['name']


class SupportSLAViewSet(viewsets.ModelViewSet):
    """ViewSet for managing support SLAs"""
    queryset = SupportSLA.objects.all()
    serializer_class = SupportSLASerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['tenant', 'priority', 'category', 'is_active']
    search_fields = ['name']
    ordering_fields = ['priority', 'category', 'first_response_time']
    ordering = ['priority', 'category']


class SupportAnalyticsViewSet(viewsets.ReadOnlyModelViewSet):
    """ViewSet for support analytics (read-only)"""
    queryset = SupportAnalytics.objects.all()
    serializer_class = SupportAnalyticsSerializer
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    filterset_fields = ['tenant', 'date']
    ordering_fields = ['date']
    ordering = ['-date']
    
    @action(detail=False, methods=['get'])
    def summary(self, request):
        """Get support analytics summary"""
        tenant_id = request.query_params.get('tenant')
        date_from = request.query_params.get('date_from')
        date_to = request.query_params.get('date_to')
        
        queryset = self.get_queryset()
        if tenant_id:
            queryset = queryset.filter(tenant_id=tenant_id)
        if date_from:
            queryset = queryset.filter(date__gte=date_from)
        if date_to:
            queryset = queryset.filter(date__lte=date_to)
        
        # Calculate summary statistics
        total_tickets = queryset.aggregate(total=models.Sum('total_tickets'))['total'] or 0
        avg_response_time = queryset.aggregate(avg=models.Avg('average_response_time'))['avg'] or 0
        avg_resolution_time = queryset.aggregate(avg=models.Avg('average_resolution_time'))['avg'] or 0
        avg_satisfaction = queryset.aggregate(avg=models.Avg('customer_satisfaction'))['avg'] or 0
        
        return Response({
            'total_tickets': total_tickets,
            'average_response_time': round(avg_response_time, 2),
            'average_resolution_time': round(avg_resolution_time, 2),
            'average_satisfaction': round(avg_satisfaction, 2)
        })

class SupportMessageViewSet(viewsets.ModelViewSet):
    queryset = SupportMessage.objects.all()
    serializer_class = SupportMessageSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['ticket', 'sender', 'is_internal']
