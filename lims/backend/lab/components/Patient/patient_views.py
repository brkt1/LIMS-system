from rest_framework import viewsets, status, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.conf import settings
from django.db.models import Q
from django.utils import timezone
from datetime import date, timedelta
import uuid

# Import the User model
User = settings.AUTH_USER_MODEL

from .patient_models import (
    Patient, Appointment, TestResult, Message, 
    SupportTicket, PatientNotification
)
from .patient_serializers import (
    PatientSerializer, PatientListSerializer, PatientDetailSerializer,
    AppointmentSerializer, AppointmentListSerializer, AppointmentDetailSerializer,
    TestResultSerializer, TestResultListSerializer, TestResultDetailSerializer,
    MessageSerializer, MessageListSerializer, MessageDetailSerializer,
    SupportTicketSerializer, SupportTicketListSerializer, SupportTicketDetailSerializer,
    PatientNotificationSerializer, PatientNotificationListSerializer
)


class PatientViewSet(viewsets.ModelViewSet):
    """ViewSet for Patient management"""
    queryset = Patient.objects.all()
    permission_classes = [AllowAny]  # AllowAny for testing, change to IsAuthenticated in production
    
    def get_serializer_class(self):
        if self.action == 'list':
            return PatientListSerializer
        elif self.action == 'retrieve':
            return PatientDetailSerializer
        return PatientSerializer
    
    def get_queryset(self):
        """Filter patients based on user role and permissions"""
        user = self.request.user
        
        # Handle anonymous users
        if not user.is_authenticated:
            return Patient.objects.all()  # For testing, return all patients
        
        # Super admin can see all patients
        if hasattr(user, 'role') and user.role == 'superadmin':
            return Patient.objects.all()
        
        # Patient can only see their own profile
        elif hasattr(user, 'role') and user.role == 'patient':
            try:
                return Patient.objects.filter(user=user)
            except Patient.DoesNotExist:
                return Patient.objects.none()
        
        # Other roles can see patients in their tenant
        else:
            # For now, return all patients - in production, filter by tenant
            return Patient.objects.all()
    
    def perform_create(self, serializer):
        """Create a new patient with auto-generated ID"""
        patient_id = f"PAT{str(uuid.uuid4())[:8].upper()}"
        serializer.save(patient_id=patient_id, created_by=self.request.user)
    
    @action(detail=True, methods=['get'])
    def appointments(self, request, pk=None):
        """Get appointments for a specific patient"""
        patient = self.get_object()
        appointments = patient.appointments.all()
        serializer = AppointmentListSerializer(appointments, many=True)
        return Response(serializer.data)
    
    @action(detail=True, methods=['get'])
    def test_results(self, request, pk=None):
        """Get test results for a specific patient"""
        patient = self.get_object()
        test_results = patient.test_results.all()
        serializer = TestResultListSerializer(test_results, many=True)
        return Response(serializer.data)
    
    @action(detail=True, methods=['get'])
    def messages(self, request, pk=None):
        """Get messages for a specific patient"""
        patient = self.get_object()
        messages = patient.messages.all()
        serializer = MessageListSerializer(messages, many=True)
        return Response(serializer.data)
    
    @action(detail=True, methods=['get'])
    def support_tickets(self, request, pk=None):
        """Get support tickets for a specific patient"""
        patient = self.get_object()
        support_tickets = patient.support_tickets.all()
        serializer = SupportTicketListSerializer(support_tickets, many=True)
        return Response(serializer.data)
    
    @action(detail=True, methods=['get'])
    def notifications(self, request, pk=None):
        """Get notifications for a specific patient"""
        patient = self.get_object()
        notifications = patient.notifications.all()
        serializer = PatientNotificationListSerializer(notifications, many=True)
        return Response(serializer.data)
    
    @action(detail=True, methods=['post'])
    def update_profile(self, request, pk=None):
        """Update patient profile"""
        patient = self.get_object()
        serializer = PatientSerializer(patient, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class AppointmentViewSet(viewsets.ModelViewSet):
    """ViewSet for Appointment management"""
    queryset = Appointment.objects.all()
    permission_classes = [AllowAny]  # AllowAny for testing, change to IsAuthenticated in production
    
    def get_serializer_class(self):
        if self.action == 'list':
            return AppointmentListSerializer
        elif self.action == 'retrieve':
            return AppointmentDetailSerializer
        return AppointmentSerializer
    
    def get_queryset(self):
        """Filter appointments based on user role"""
        user = self.request.user
        
        # Handle anonymous users
        if not user.is_authenticated:
            return Appointment.objects.all()  # For testing, return all appointments
        
        # Super admin can see all appointments
        if hasattr(user, 'role') and user.role == 'superadmin':
            return Appointment.objects.all()
        
        # Patient can only see their own appointments
        elif hasattr(user, 'role') and user.role == 'patient':
            try:
                patient = Patient.objects.get(user=user)
                return Appointment.objects.filter(patient=patient)
            except Patient.DoesNotExist:
                return Appointment.objects.none()
        
        # Doctor can see appointments where they are the doctor
        elif hasattr(user, 'role') and user.role == 'doctor':
            return Appointment.objects.filter(doctor=user)
        
        # Other roles can see all appointments in their tenant
        else:
            return Appointment.objects.all()
    
    def perform_create(self, serializer):
        """Create a new appointment with auto-generated ID"""
        appointment_id = f"APT{str(uuid.uuid4())[:8].upper()}"
        serializer.save(appointment_id=appointment_id, created_by=self.request.user)
    
    @action(detail=True, methods=['post'])
    def confirm(self, request, pk=None):
        """Confirm an appointment"""
        appointment = self.get_object()
        appointment.status = 'Confirmed'
        appointment.save()
        return Response({'message': 'Appointment confirmed successfully'})
    
    @action(detail=True, methods=['post'])
    def cancel(self, request, pk=None):
        """Cancel an appointment"""
        appointment = self.get_object()
        appointment.status = 'Cancelled'
        appointment.save()
        return Response({'message': 'Appointment cancelled successfully'})
    
    @action(detail=True, methods=['post'])
    def reschedule(self, request, pk=None):
        """Reschedule an appointment"""
        appointment = self.get_object()
        new_date = request.data.get('appointment_date')
        new_time = request.data.get('appointment_time')
        
        if new_date and new_time:
            appointment.appointment_date = new_date
            appointment.appointment_time = new_time
            appointment.status = 'Rescheduled'
            appointment.save()
            return Response({'message': 'Appointment rescheduled successfully'})
        
        return Response({'error': 'Invalid date or time'}, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=False, methods=['get'])
    def upcoming(self, request):
        """Get upcoming appointments"""
        user = request.user
        today = date.today()
        
        if hasattr(user, "role") and user.role == 'patient':
            try:
                patient = Patient.objects.get(user=user)
                appointments = Appointment.objects.filter(
                    patient=patient,
                    appointment_date__gte=today,
                    status__in=['Scheduled', 'Confirmed']
                ).order_by('appointment_date', 'appointment_time')
            except Patient.DoesNotExist:
                appointments = Appointment.objects.none()
        else:
            appointments = Appointment.objects.filter(
                appointment_date__gte=today,
                status__in=['Scheduled', 'Confirmed']
            ).order_by('appointment_date', 'appointment_time')
        
        serializer = AppointmentListSerializer(appointments, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def today(self, request):
        """Get today's appointments"""
        user = request.user
        today = date.today()
        
        if hasattr(user, "role") and user.role == 'patient':
            try:
                patient = Patient.objects.get(user=user)
                appointments = Appointment.objects.filter(
                    patient=patient,
                    appointment_date=today
                ).order_by('appointment_time')
            except Patient.DoesNotExist:
                appointments = Appointment.objects.none()
        else:
            appointments = Appointment.objects.filter(
                appointment_date=today
            ).order_by('appointment_time')
        
        serializer = AppointmentListSerializer(appointments, many=True)
        return Response(serializer.data)


class TestResultViewSet(viewsets.ModelViewSet):
    """ViewSet for TestResult management"""
    queryset = TestResult.objects.all()
    permission_classes = [AllowAny]  # AllowAny for testing, change to IsAuthenticated in production
    
    def get_serializer_class(self):
        if self.action == 'list':
            return TestResultListSerializer
        elif self.action == 'retrieve':
            return TestResultDetailSerializer
        return TestResultSerializer
    
    def get_queryset(self):
        user = self.request.user
        
        """Filter test results based on user role"""
        user = self.request.user
        
        # Handle anonymous users
        if not user.is_authenticated:
            return TestResult.objects.all()  # For testing, return all test results
        
        # Super admin can see all test results
        if hasattr(user, 'role') and user.role == 'superadmin':
            return TestResult.objects.all()
        
        # Patient can only see their own test results
        elif hasattr(user, 'role') and user.role == 'patient':
            try:
                patient = Patient.objects.get(user=user)
                return TestResult.objects.filter(patient=patient)
            except Patient.DoesNotExist:
                return TestResult.objects.none()
        
        # Doctor can see test results they ordered
        elif hasattr(user, 'role') and user.role == 'doctor':
            return TestResult.objects.filter(doctor=user)
        
        # Technician can see test results they performed
        elif hasattr(user, 'role') and user.role == 'technician':
            return TestResult.objects.filter(technician=user)
        
        # Other roles can see all test results in their tenant
        else:
            return TestResult.objects.all()
    
    def perform_create(self, serializer):
        """Create a new test result with auto-generated ID"""
        test_id = f"TST{str(uuid.uuid4())[:8].upper()}"
        serializer.save(test_id=test_id, created_by=self.request.user)
    
    @action(detail=True, methods=['post'])
    def mark_abnormal(self, request, pk=None):
        """Mark a test result as abnormal"""
        test_result = self.get_object()
        test_result.is_abnormal = True
        test_result.status = 'Abnormal'
        test_result.save()
        return Response({'message': 'Test result marked as abnormal'})
    
    @action(detail=True, methods=['post'])
    def mark_critical(self, request, pk=None):
        """Mark a test result as critical"""
        test_result = self.get_object()
        test_result.is_critical = True
        test_result.status = 'Critical'
        test_result.save()
        return Response({'message': 'Test result marked as critical'})
    
    @action(detail=False, methods=['get'])
    def abnormal(self, request):
        """Get abnormal test results"""
        user = request.user
        
        if hasattr(user, "role") and user.role == 'patient':
            try:
                patient = Patient.objects.get(user=user)
                test_results = TestResult.objects.filter(patient=patient, is_abnormal=True)
            except Patient.DoesNotExist:
                test_results = TestResult.objects.none()
        else:
            test_results = TestResult.objects.filter(is_abnormal=True)
        
        serializer = TestResultListSerializer(test_results, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def critical(self, request):
        """Get critical test results"""
        user = request.user
        
        if hasattr(user, "role") and user.role == 'patient':
            try:
                patient = Patient.objects.get(user=user)
                test_results = TestResult.objects.filter(patient=patient, is_critical=True)
            except Patient.DoesNotExist:
                test_results = TestResult.objects.none()
        else:
            test_results = TestResult.objects.filter(is_critical=True)
        
        serializer = TestResultListSerializer(test_results, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def recent(self, request):
        """Get recent test results"""
        user = request.user
        days = int(request.query_params.get('days', 30))
        start_date = date.today() - timedelta(days=days)
        
        if hasattr(user, "role") and user.role == 'patient':
            try:
                patient = Patient.objects.get(user=user)
                test_results = TestResult.objects.filter(
                    patient=patient,
                    test_date__gte=start_date
                ).order_by('-test_date')
            except Patient.DoesNotExist:
                test_results = TestResult.objects.none()
        else:
            test_results = TestResult.objects.filter(
                test_date__gte=start_date
            ).order_by('-test_date')
        
        serializer = TestResultListSerializer(test_results, many=True)
        return Response(serializer.data)


class MessageViewSet(viewsets.ModelViewSet):
    """ViewSet for Message management"""
    queryset = Message.objects.all()
    permission_classes = [AllowAny]  # AllowAny for testing, change to IsAuthenticated in production
    
    def get_serializer_class(self):
        if self.action == 'list':
            return MessageListSerializer
        elif self.action == 'retrieve':
            return MessageDetailSerializer
        return MessageSerializer
    
    def get_queryset(self):
        user = self.request.user
        
        # Handle anonymous users
        if not user.is_authenticated:
            return Message.objects.all()  # For testing, return all
        """Filter messages based on user role"""
        user = self.request.user
        
        # Super admin can see all messages
        if hasattr(user, "role") and user.role == 'superadmin':
            return Message.objects.all()
        
        # Patient can see messages where they are the patient
        elif hasattr(user, "role") and user.role == 'patient':
            try:
                patient = Patient.objects.get(user=user)
                return Message.objects.filter(patient=patient)
            except Patient.DoesNotExist:
                return Message.objects.none()
        
        # Other roles can see messages where they are sender or recipient
        else:
            return Message.objects.filter(
                Q(sender=user) | Q(recipient=user)
            )
    
    def perform_create(self, serializer):
        """Create a new message with auto-generated ID"""
        message_id = f"MSG{str(uuid.uuid4())[:8].upper()}"
        serializer.save(message_id=message_id, sender=self.request.user)
    
    @action(detail=True, methods=['post'])
    def mark_read(self, request, pk=None):
        """Mark a message as read"""
        message = self.get_object()
        message.is_read = True
        message.read_at = timezone.now()
        message.save()
        return Response({'message': 'Message marked as read'})
    
    @action(detail=True, methods=['post'])
    def archive(self, request, pk=None):
        """Archive a message"""
        message = self.get_object()
        message.is_archived = True
        message.save()
        return Response({'message': 'Message archived'})
    
    @action(detail=False, methods=['get'])
    def unread(self, request):
        """Get unread messages"""
        user = request.user
        
        if hasattr(user, "role") and user.role == 'patient':
            try:
                patient = Patient.objects.get(user=user)
                messages = Message.objects.filter(patient=patient, is_read=False)
            except Patient.DoesNotExist:
                messages = Message.objects.none()
        else:
            messages = Message.objects.filter(
                Q(sender=user) | Q(recipient=user),
                is_read=False
            )
        
        serializer = MessageListSerializer(messages, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def sent(self, request):
        """Get sent messages"""
        user = request.user
        messages = Message.objects.filter(sender=user).order_by('-created_at')
        serializer = MessageListSerializer(messages, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def received(self, request):
        """Get received messages"""
        user = request.user
        messages = Message.objects.filter(recipient=user).order_by('-created_at')
        serializer = MessageListSerializer(messages, many=True)
        return Response(serializer.data)


class SupportTicketViewSet(viewsets.ModelViewSet):
    """ViewSet for SupportTicket management"""
    queryset = SupportTicket.objects.all()
    permission_classes = [AllowAny]  # AllowAny for testing, change to IsAuthenticated in production
    
    def get_serializer_class(self):
        if self.action == 'list':
            return SupportTicketListSerializer
        elif self.action == 'retrieve':
            return SupportTicketDetailSerializer
        return SupportTicketSerializer
    
    def get_queryset(self):
        user = self.request.user
        
        # Handle anonymous users
        if not user.is_authenticated:
            return SupportTicket.objects.all()  # For testing, return all
        """Filter support tickets based on user role"""
        user = self.request.user
        
        # Super admin can see all support tickets
        if hasattr(user, "role") and user.role == 'superadmin':
            return SupportTicket.objects.all()
        
        # Patient can only see their own support tickets
        elif hasattr(user, "role") and user.role == 'patient':
            try:
                patient = Patient.objects.get(user=user)
                return SupportTicket.objects.filter(patient=patient)
            except Patient.DoesNotExist:
                return SupportTicket.objects.none()
        
        # Support staff can see tickets assigned to them or unassigned
        elif hasattr(user, "role") and user.role == 'support':
            return SupportTicket.objects.filter(
                Q(assigned_to=user) | Q(assigned_to__isnull=True)
            )
        
        # Other roles can see all support tickets in their tenant
        else:
            return SupportTicket.objects.all()
    
    def perform_create(self, serializer):
        """Create a new support ticket with auto-generated ID"""
        ticket_id = f"TKT{str(uuid.uuid4())[:8].upper()}"
        serializer.save(ticket_id=ticket_id)
    
    @action(detail=True, methods=['post'])
    def assign(self, request, pk=None):
        """Assign a support ticket"""
        ticket = self.get_object()
        assigned_to_id = request.data.get('assigned_to')
        
        if assigned_to_id:
            try:
                assigned_to = User.objects.get(id=assigned_to_id)
                ticket.assigned_to = assigned_to
                ticket.status = 'In Progress'
                ticket.save()
                return Response({'message': 'Ticket assigned successfully'})
            except User.DoesNotExist:
                return Response({'error': 'User not found'}, status=status.HTTP_400_BAD_REQUEST)
        
        return Response({'error': 'Invalid assigned_to'}, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=True, methods=['post'])
    def resolve(self, request, pk=None):
        """Resolve a support ticket"""
        ticket = self.get_object()
        resolution = request.data.get('resolution', '')
        
        ticket.resolution = resolution
        ticket.status = 'Resolved'
        ticket.resolved_at = timezone.now()
        ticket.resolved_by = self.request.user
        ticket.save()
        
        return Response({'message': 'Ticket resolved successfully'})
    
    @action(detail=True, methods=['post'])
    def close(self, request, pk=None):
        """Close a support ticket"""
        ticket = self.get_object()
        ticket.status = 'Closed'
        ticket.save()
        return Response({'message': 'Ticket closed successfully'})
    
    @action(detail=False, methods=['get'])
    def open(self, request):
        """Get open support tickets"""
        user = request.user
        
        if hasattr(user, "role") and user.role == 'patient':
            try:
                patient = Patient.objects.get(user=user)
                tickets = SupportTicket.objects.filter(patient=patient, status='Open')
            except Patient.DoesNotExist:
                tickets = SupportTicket.objects.none()
        else:
            tickets = SupportTicket.objects.filter(status='Open')
        
        serializer = SupportTicketListSerializer(tickets, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def assigned(self, request):
        """Get support tickets assigned to current user"""
        user = request.user
        tickets = SupportTicket.objects.filter(assigned_to=user)
        serializer = SupportTicketListSerializer(tickets, many=True)
        return Response(serializer.data)


class PatientNotificationViewSet(viewsets.ModelViewSet):
    """ViewSet for PatientNotification management"""
    queryset = PatientNotification.objects.all()
    permission_classes = [AllowAny]  # AllowAny for testing, change to IsAuthenticated in production
    
    def get_serializer_class(self):
        if self.action == 'list':
            return PatientNotificationListSerializer
        return PatientNotificationSerializer
    
    def get_queryset(self):
        user = self.request.user
        
        # Handle anonymous users
        if not user.is_authenticated:
            return PatientNotification.objects.all()  # For testing, return all
        """Filter notifications based on user role"""
        user = self.request.user
        
        # Super admin can see all notifications
        if hasattr(user, "role") and user.role == 'superadmin':
            return PatientNotification.objects.all()
        
        # Patient can only see their own notifications
        elif hasattr(user, "role") and user.role == 'patient':
            try:
                patient = Patient.objects.get(user=user)
                return PatientNotification.objects.filter(patient=patient)
            except Patient.DoesNotExist:
                return PatientNotification.objects.none()
        
        # Other roles can see all notifications in their tenant
        else:
            return PatientNotification.objects.all()
    
    def perform_create(self, serializer):
        """Create a new notification with auto-generated ID"""
        notification_id = f"NOT{str(uuid.uuid4())[:8].upper()}"
        serializer.save(notification_id=notification_id)
    
    @action(detail=True, methods=['post'])
    def mark_read(self, request, pk=None):
        """Mark a notification as read"""
        notification = self.get_object()
        notification.is_read = True
        notification.read_at = timezone.now()
        notification.save()
        return Response({'message': 'Notification marked as read'})
    
    @action(detail=False, methods=['get'])
    def unread(self, request):
        """Get unread notifications"""
        user = request.user
        
        if hasattr(user, "role") and user.role == 'patient':
            try:
                patient = Patient.objects.get(user=user)
                notifications = PatientNotification.objects.filter(patient=patient, is_read=False)
            except Patient.DoesNotExist:
                notifications = PatientNotification.objects.none()
        else:
            notifications = PatientNotification.objects.filter(is_read=False)
        
        serializer = PatientNotificationListSerializer(notifications, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['post'])
    def mark_all_read(self, request):
        """Mark all notifications as read for current patient"""
        user = request.user
        
        if hasattr(user, "role") and user.role == 'patient':
            try:
                patient = Patient.objects.get(user=user)
                PatientNotification.objects.filter(patient=patient, is_read=False).update(
                    is_read=True,
                    read_at=timezone.now()
                )
                return Response({'message': 'All notifications marked as read'})
            except Patient.DoesNotExist:
                return Response({'error': 'Patient profile not found'}, status=status.HTTP_404_NOT_FOUND)
        
        return Response({'error': 'Unauthorized'}, status=status.HTTP_403_FORBIDDEN)
