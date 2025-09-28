from rest_framework import viewsets, status, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from django_filters.rest_framework import DjangoFilterBackend
from django.utils import timezone
from django.db.models import Q, Count, Avg
from django.db import models

from lab.models import (
    Technician, Sample, TestResult, QualityControl, LabWorkflow
)
from .technician_serializers import (
    TechnicianSerializer, TechnicianListSerializer,
    SampleSerializer, SampleListSerializer,
    TestResultSerializer, TestResultListSerializer,
    QualityControlSerializer, QualityControlListSerializer,
    LabWorkflowSerializer, LabWorkflowListSerializer
)


class TechnicianViewSet(viewsets.ModelViewSet):
    """ViewSet for managing technicians"""
    queryset = Technician.objects.all()
    serializer_class = TechnicianSerializer
    permission_classes = [AllowAny]  # Temporarily allow unauthenticated access for testing
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['specialization', 'certification_level', 'status', 'tenant']
    search_fields = ['user__first_name', 'user__last_name', 'employee_id', 'specialization']
    ordering_fields = ['user__last_name', 'hire_date', 'years_experience', 'quality_score']
    ordering = ['user__last_name']

    def get_serializer_class(self):
        if self.action == 'list':
            return TechnicianListSerializer
        return TechnicianSerializer

    def get_queryset(self):
        queryset = super().get_queryset()
        tenant_id = self.request.query_params.get('tenant')
        if tenant_id:
            queryset = queryset.filter(tenant_id=tenant_id)
        return queryset

    @action(detail=True, methods=['post'])
    def update_status(self, request, pk=None):
        """Update technician status"""
        technician = self.get_object()
        new_status = request.data.get('status')
        if new_status not in [choice[0] for choice in Technician.STATUS_CHOICES]:
            return Response({"error": "Invalid status"}, status=status.HTTP_400_BAD_REQUEST)
        
        technician.status = new_status
        technician.save()
        return Response({"message": "Technician status updated successfully"})

    @action(detail=True, methods=['get'])
    def performance_metrics(self, request, pk=None):
        """Get technician performance metrics"""
        technician = self.get_object()
        
        # Calculate metrics
        total_tests = technician.test_results.count()
        completed_tests = technician.test_results.filter(status='completed').count()
        avg_processing_time = technician.test_results.filter(
            completion_date__isnull=False
        ).aggregate(
            avg_time=models.Avg(
                models.F('completion_date') - models.F('analysis_date')
            )
        )['avg_time']
        
        # Quality control metrics
        qc_records = technician.qc_records.count()
        passed_qc = technician.qc_records.filter(status='passed').count()
        qc_pass_rate = (passed_qc / qc_records * 100) if qc_records > 0 else 0
        
        metrics = {
            'total_tests': total_tests,
            'completed_tests': completed_tests,
            'completion_rate': (completed_tests / total_tests * 100) if total_tests > 0 else 0,
            'average_processing_time': avg_processing_time,
            'quality_control_records': qc_records,
            'qc_pass_rate': qc_pass_rate,
            'quality_score': float(technician.quality_score)
        }
        
        return Response(metrics)

    @action(detail=False, methods=['get'])
    def statistics(self, request):
        """Get technician statistics"""
        total_technicians = Technician.objects.count()
        active_technicians = Technician.objects.filter(status='active').count()
        
        # Specialization distribution
        specialization_stats = Technician.objects.values('specialization').annotate(
            count=Count('id')
        ).order_by('-count')
        
        # Certification level distribution
        certification_stats = Technician.objects.values('certification_level').annotate(
            count=Count('id')
        ).order_by('-count')
        
        stats = {
            'total_technicians': total_technicians,
            'active_technicians': active_technicians,
            'specialization_distribution': list(specialization_stats),
            'certification_distribution': list(certification_stats)
        }
        
        return Response(stats)


class SampleViewSet(viewsets.ModelViewSet):
    """ViewSet for managing laboratory samples"""
    queryset = Sample.objects.all()
    serializer_class = SampleSerializer
    permission_classes = [AllowAny]  # Temporarily allow unauthenticated access for testing
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['sample_type', 'status', 'priority', 'technician', 'tenant']
    search_fields = ['id', 'patient_id', 'test_request__test_type', 'collection_notes']
    ordering_fields = ['collection_date', 'received_date', 'priority']
    ordering = ['-collection_date']

    def get_serializer_class(self):
        if self.action == 'list':
            return SampleListSerializer
        return SampleSerializer

    def get_queryset(self):
        queryset = super().get_queryset()
        tenant_id = self.request.query_params.get('tenant')
        if tenant_id:
            queryset = queryset.filter(tenant_id=tenant_id)
        return queryset

    @action(detail=True, methods=['post'])
    def assign_technician(self, request, pk=None):
        """Assign a technician to a sample"""
        sample = self.get_object()
        technician_id = request.data.get('technician_id')
        if not technician_id:
            return Response({"error": "technician_id is required"}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            technician = Technician.objects.get(id=technician_id)
            sample.technician = technician
            sample.status = 'processing'
            sample.save()
            return Response({"message": "Sample assigned to technician successfully"})
        except Technician.DoesNotExist:
            return Response({"error": "Technician not found"}, status=status.HTTP_404_NOT_FOUND)

    @action(detail=True, methods=['post'])
    def update_status(self, request, pk=None):
        """Update sample status"""
        sample = self.get_object()
        new_status = request.data.get('status')
        notes = request.data.get('notes', '')
        
        if new_status not in [choice[0] for choice in Sample.STATUS_CHOICES]:
            return Response({"error": "Invalid status"}, status=status.HTTP_400_BAD_REQUEST)
        
        sample.status = new_status
        if notes:
            sample.processing_notes = notes
        sample.save()
        
        return Response({"message": "Sample status updated successfully"})

    @action(detail=True, methods=['post'])
    def reject_sample(self, request, pk=None):
        """Reject a sample with reason"""
        sample = self.get_object()
        rejection_reason = request.data.get('rejection_reason')
        if not rejection_reason:
            return Response({"error": "rejection_reason is required"}, status=status.HTTP_400_BAD_REQUEST)
        
        sample.status = 'rejected'
        sample.rejection_reason = rejection_reason
        sample.save()
        
        return Response({"message": "Sample rejected successfully"})

    @action(detail=False, methods=['get'])
    def pending_samples(self, request):
        """Get pending samples for processing"""
        pending_samples = Sample.objects.filter(status='received').order_by('priority', 'collection_date')
        serializer = SampleListSerializer(pending_samples, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def statistics(self, request):
        """Get sample statistics"""
        total_samples = Sample.objects.count()
        pending_samples = Sample.objects.filter(status='received').count()
        processing_samples = Sample.objects.filter(status='processing').count()
        completed_samples = Sample.objects.filter(status='completed').count()
        
        # Sample type distribution
        sample_type_stats = Sample.objects.values('sample_type').annotate(
            count=Count('id')
        ).order_by('-count')
        
        # Priority distribution
        priority_stats = Sample.objects.values('priority').annotate(
            count=Count('id')
        ).order_by('-count')
        
        stats = {
            'total_samples': total_samples,
            'pending_samples': pending_samples,
            'processing_samples': processing_samples,
            'completed_samples': completed_samples,
            'sample_type_distribution': list(sample_type_stats),
            'priority_distribution': list(priority_stats)
        }
        
        return Response(stats)


class TestResultViewSet(viewsets.ModelViewSet):
    """ViewSet for managing test results"""
    queryset = TestResult.objects.all()
    serializer_class = TestResultSerializer
    permission_classes = [AllowAny]  # Temporarily allow unauthenticated access for testing
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['status', 'result_type', 'technician', 'is_abnormal', 'critical_value', 'tenant']
    search_fields = ['test_name', 'test_code', 'result_value', 'technician_notes']
    ordering_fields = ['analysis_date', 'completion_date', 'test_name']
    ordering = ['-analysis_date']

    def get_serializer_class(self):
        if self.action == 'list':
            return TestResultListSerializer
        return TestResultSerializer

    def get_queryset(self):
        queryset = super().get_queryset()
        tenant_id = self.request.query_params.get('tenant')
        if tenant_id:
            queryset = queryset.filter(tenant_id=tenant_id)
        return queryset

    @action(detail=True, methods=['post'])
    def complete_result(self, request, pk=None):
        """Mark test result as completed"""
        test_result = self.get_object()
        result_value = request.data.get('result_value')
        technician_notes = request.data.get('technician_notes', '')
        
        if not result_value:
            return Response({"error": "result_value is required"}, status=status.HTTP_400_BAD_REQUEST)
        
        test_result.result_value = result_value
        test_result.status = 'completed'
        test_result.completion_date = timezone.now()
        if technician_notes:
            test_result.technician_notes = technician_notes
        test_result.save()
        
        return Response({"message": "Test result completed successfully"})

    @action(detail=True, methods=['post'])
    def mark_abnormal(self, request, pk=None):
        """Mark test result as abnormal"""
        test_result = self.get_object()
        is_abnormal = request.data.get('is_abnormal', True)
        critical_value = request.data.get('critical_value', False)
        
        test_result.is_abnormal = is_abnormal
        test_result.critical_value = critical_value
        test_result.save()
        
        return Response({"message": "Test result marked as abnormal"})

    @action(detail=True, methods=['post'])
    def review_result(self, request, pk=None):
        """Review test result by doctor"""
        test_result = self.get_object()
        review_notes = request.data.get('review_notes', '')
        doctor_id = request.data.get('doctor_id')
        
        if not doctor_id:
            return Response({"error": "doctor_id is required"}, status=status.HTTP_400_BAD_REQUEST)
        
        test_result.reviewed_by_id = doctor_id
        test_result.review_date = timezone.now()
        test_result.status = 'reviewed'
        if review_notes:
            test_result.review_notes = review_notes
        test_result.save()
        
        return Response({"message": "Test result reviewed successfully"})

    @action(detail=False, methods=['get'])
    def abnormal_results(self, request):
        """Get abnormal test results"""
        abnormal_results = TestResult.objects.filter(is_abnormal=True).order_by('-analysis_date')
        serializer = TestResultListSerializer(abnormal_results, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def critical_results(self, request):
        """Get critical test results"""
        critical_results = TestResult.objects.filter(critical_value=True).order_by('-analysis_date')
        serializer = TestResultListSerializer(critical_results, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def statistics(self, request):
        """Get test result statistics"""
        total_results = TestResult.objects.count()
        completed_results = TestResult.objects.filter(status='completed').count()
        abnormal_results = TestResult.objects.filter(is_abnormal=True).count()
        critical_results = TestResult.objects.filter(critical_value=True).count()
        
        # Test type distribution
        test_type_stats = TestResult.objects.values('test_name').annotate(
            count=Count('id')
        ).order_by('-count')[:10]  # Top 10 test types
        
        stats = {
            'total_results': total_results,
            'completed_results': completed_results,
            'abnormal_results': abnormal_results,
            'critical_results': critical_results,
            'abnormal_rate': (abnormal_results / total_results * 100) if total_results > 0 else 0,
            'top_test_types': list(test_type_stats)
        }
        
        return Response(stats)


class QualityControlViewSet(viewsets.ModelViewSet):
    """ViewSet for managing quality control records"""
    queryset = QualityControl.objects.all()
    serializer_class = QualityControlSerializer
    permission_classes = [AllowAny]  # Temporarily allow unauthenticated access for testing
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['qc_type', 'status', 'technician', 'equipment', 'tenant']
    search_fields = ['test_name', 'lot_number', 'notes']
    ordering_fields = ['performed_date', 'test_name']
    ordering = ['-performed_date']

    def get_serializer_class(self):
        if self.action == 'list':
            return QualityControlListSerializer
        return QualityControlSerializer

    def get_queryset(self):
        queryset = super().get_queryset()
        tenant_id = self.request.query_params.get('tenant')
        if tenant_id:
            queryset = queryset.filter(tenant_id=tenant_id)
        return queryset

    @action(detail=True, methods=['post'])
    def update_status(self, request, pk=None):
        """Update QC status"""
        qc_record = self.get_object()
        new_status = request.data.get('status')
        corrective_action = request.data.get('corrective_action', '')
        
        if new_status not in [choice[0] for choice in QualityControl.STATUS_CHOICES]:
            return Response({"error": "Invalid status"}, status=status.HTTP_400_BAD_REQUEST)
        
        qc_record.status = new_status
        if corrective_action:
            qc_record.corrective_action = corrective_action
        qc_record.save()
        
        return Response({"message": "QC status updated successfully"})

    @action(detail=False, methods=['get'])
    def failed_qc(self, request):
        """Get failed QC records"""
        failed_qc = QualityControl.objects.filter(status='failed').order_by('-performed_date')
        serializer = QualityControlListSerializer(failed_qc, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def statistics(self, request):
        """Get QC statistics"""
        total_qc = QualityControl.objects.count()
        passed_qc = QualityControl.objects.filter(status='passed').count()
        failed_qc = QualityControl.objects.filter(status='failed').count()
        warning_qc = QualityControl.objects.filter(status='warning').count()
        
        # QC type distribution
        qc_type_stats = QualityControl.objects.values('qc_type').annotate(
            count=Count('id')
        ).order_by('-count')
        
        stats = {
            'total_qc_records': total_qc,
            'passed_qc': passed_qc,
            'failed_qc': failed_qc,
            'warning_qc': warning_qc,
            'pass_rate': (passed_qc / total_qc * 100) if total_qc > 0 else 0,
            'qc_type_distribution': list(qc_type_stats)
        }
        
        return Response(stats)


class LabWorkflowViewSet(viewsets.ModelViewSet):
    """ViewSet for managing lab workflows"""
    queryset = LabWorkflow.objects.all()
    serializer_class = LabWorkflowSerializer
    permission_classes = [AllowAny]  # Temporarily allow unauthenticated access for testing
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['workflow_type', 'status', 'assigned_to', 'priority', 'tenant']
    search_fields = ['title', 'description', 'notes']
    ordering_fields = ['created_at', 'due_date', 'priority']
    ordering = ['-created_at']

    def get_serializer_class(self):
        if self.action == 'list':
            return LabWorkflowListSerializer
        return LabWorkflowSerializer

    def get_queryset(self):
        queryset = super().get_queryset()
        tenant_id = self.request.query_params.get('tenant')
        if tenant_id:
            queryset = queryset.filter(tenant_id=tenant_id)
        return queryset

    @action(detail=True, methods=['post'])
    def assign_workflow(self, request, pk=None):
        """Assign workflow to technician"""
        workflow = self.get_object()
        technician_id = request.data.get('technician_id')
        if not technician_id:
            return Response({"error": "technician_id is required"}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            technician = Technician.objects.get(id=technician_id)
            workflow.assigned_to = technician
            workflow.status = 'in_progress'
            workflow.save()
            return Response({"message": "Workflow assigned successfully"})
        except Technician.DoesNotExist:
            return Response({"error": "Technician not found"}, status=status.HTTP_404_NOT_FOUND)

    @action(detail=True, methods=['post'])
    def complete_workflow(self, request, pk=None):
        """Complete workflow"""
        workflow = self.get_object()
        notes = request.data.get('notes', '')
        
        workflow.status = 'completed'
        workflow.completed_date = timezone.now()
        if notes:
            workflow.notes = notes
        workflow.save()
        
        return Response({"message": "Workflow completed successfully"})

    @action(detail=False, methods=['get'])
    def pending_workflows(self, request):
        """Get pending workflows"""
        pending_workflows = LabWorkflow.objects.filter(status='pending').order_by('priority', 'due_date')
        serializer = LabWorkflowListSerializer(pending_workflows, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def statistics(self, request):
        """Get workflow statistics"""
        total_workflows = LabWorkflow.objects.count()
        pending_workflows = LabWorkflow.objects.filter(status='pending').count()
        in_progress_workflows = LabWorkflow.objects.filter(status='in_progress').count()
        completed_workflows = LabWorkflow.objects.filter(status='completed').count()
        
        # Workflow type distribution
        workflow_type_stats = LabWorkflow.objects.values('workflow_type').annotate(
            count=Count('id')
        ).order_by('-count')
        
        stats = {
            'total_workflows': total_workflows,
            'pending_workflows': pending_workflows,
            'in_progress_workflows': in_progress_workflows,
            'completed_workflows': completed_workflows,
            'completion_rate': (completed_workflows / total_workflows * 100) if total_workflows > 0 else 0,
            'workflow_type_distribution': list(workflow_type_stats)
        }
        
        return Response(stats)
