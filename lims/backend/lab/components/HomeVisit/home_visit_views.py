import time
from django.utils import timezone
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import filters
from .home_visit_models import HomeVisitRequest, HomeVisitSchedule
from .home_visit_serializers import (
    HomeVisitRequestSerializer, HomeVisitRequestListSerializer,
    HomeVisitScheduleSerializer, HomeVisitScheduleListSerializer
)

class HomeVisitRequestViewSet(viewsets.ModelViewSet):
    queryset = HomeVisitRequest.objects.all().order_by('-created_at')
    serializer_class = HomeVisitRequestSerializer
    permission_classes = [AllowAny]  # Temporarily allow unauthenticated access for testing
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['status', 'priority', 'service_type', 'tenant', 'doctor']
    search_fields = ['patient_name', 'patient_id', 'id']
    ordering_fields = ['created_at', 'requested_date', 'priority']
    ordering = ['-created_at']
    
    def get_serializer_class(self):
        if self.action == 'list':
            return HomeVisitRequestListSerializer
        return HomeVisitRequestSerializer
    
    def create(self, request, *args, **kwargs):
        data = request.data.copy()
        
        # Generate unique ID if missing
        if not data.get('id'):
            data['id'] = f"HVR{int(time.time() * 1000)}"
        
        # Set default values - use existing tenant if available, otherwise use tenant 2
        if not data.get('tenant'):
            data['tenant'] = 2  # Use tenant 2 (City Hospital Lab) as default
        
        # Only set created_by if user is authenticated
        if not data.get('created_by') and request.user.is_authenticated:
            data['created_by'] = request.user.id
        elif not data.get('created_by'):
            # For unauthenticated requests, don't set created_by (let it be null)
            pass
        
        serializer = self.get_serializer(data=data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)
    
    @action(detail=True, methods=['post'])
    def approve(self, request, pk=None):
        visit_request = self.get_object()
        visit_request.status = 'approved'
        if request.user.is_authenticated:
            visit_request.approved_by = request.user
        visit_request.approved_at = timezone.now()
        visit_request.save()
        return Response({'status': 'Home visit request approved successfully'})
    
    @action(detail=True, methods=['post'])
    def reject(self, request, pk=None):
        visit_request = self.get_object()
        visit_request.status = 'rejected'
        visit_request.save()
        return Response({'status': 'Home visit request rejected'})
    
    @action(detail=True, methods=['post'])
    def schedule(self, request, pk=None):
        visit_request = self.get_object()
        scheduled_date = request.data.get('scheduled_date')
        scheduled_time = request.data.get('scheduled_time')
        
        if scheduled_date and scheduled_time:
            visit_request.scheduled_date = scheduled_date
            visit_request.scheduled_time = scheduled_time
            visit_request.status = 'scheduled'
            visit_request.save()
            return Response({'status': 'Home visit scheduled successfully'})
        return Response({'error': 'Scheduled date and time are required'}, status=status.HTTP_400_BAD_REQUEST)

class HomeVisitScheduleViewSet(viewsets.ModelViewSet):
    queryset = HomeVisitSchedule.objects.all().order_by('scheduled_date', 'scheduled_time')
    serializer_class = HomeVisitScheduleSerializer
    permission_classes = [AllowAny]  # Temporarily allow unauthenticated access for testing
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['status', 'doctor', 'tenant', 'scheduled_date']
    search_fields = ['visit_request__patient_name', 'visit_request__patient_id', 'id']
    ordering_fields = ['scheduled_date', 'scheduled_time', 'created_at']
    ordering = ['scheduled_date', 'scheduled_time']
    
    def get_serializer_class(self):
        if self.action == 'list':
            return HomeVisitScheduleListSerializer
        return HomeVisitScheduleSerializer
    
    def create(self, request, *args, **kwargs):
        data = request.data.copy()
        
        # Generate unique ID if missing
        if not data.get('id'):
            data['id'] = f"HVS{int(time.time() * 1000)}"
        
        # Set default values
        if not data.get('tenant'):
            data['tenant'] = 1  # Default tenant
        
        if not data.get('created_by'):
            data['created_by'] = 1  # Default user
        
        serializer = self.get_serializer(data=data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)
    
    @action(detail=True, methods=['post'])
    def start_visit(self, request, pk=None):
        schedule = self.get_object()
        schedule.status = 'in_progress'
        schedule.started_at = timezone.now()
        schedule.save()
        return Response({'status': 'Home visit started successfully'})
    
    @action(detail=True, methods=['post'])
    def complete_visit(self, request, pk=None):
        schedule = self.get_object()
        schedule.status = 'completed'
        schedule.completed_at = timezone.now()
        schedule.save()
        return Response({'status': 'Home visit completed successfully'})
