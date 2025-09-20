from rest_framework import viewsets, status, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from .support_ticket_models import SupportTicket, SupportMessage, SupportAttachment
from .support_ticket_serializers import SupportTicketSerializer, SupportTicketListSerializer, SupportMessageSerializer

class SupportTicketViewSet(viewsets.ModelViewSet):
    queryset = SupportTicket.objects.all()
    serializer_class = SupportTicketSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['status', 'priority', 'assigned_to', 'created_by', 'tenant']
    search_fields = ['title', 'description']
    ordering_fields = ['created_at', 'updated_at', 'priority']
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
        ticket.save()
        return Response({'status': 'Ticket closed successfully'})
    
    @action(detail=True, methods=['get'])
    def messages(self, request, pk=None):
        ticket = self.get_object()
        messages = ticket.messages.all()
        serializer = SupportMessageSerializer(messages, many=True)
        return Response(serializer.data)
    
    @action(detail=True, methods=['post'])
    def add_message(self, request, pk=None):
        ticket = self.get_object()
        message_data = {
            'ticket': ticket.id,
            'sender': request.user.id,
            'message': request.data.get('message'),
            'is_internal': request.data.get('is_internal', False)
        }
        
        serializer = SupportMessageSerializer(data=message_data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class SupportMessageViewSet(viewsets.ModelViewSet):
    queryset = SupportMessage.objects.all()
    serializer_class = SupportMessageSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['ticket', 'sender', 'is_internal']
