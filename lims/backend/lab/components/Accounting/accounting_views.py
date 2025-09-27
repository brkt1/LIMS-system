import time
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import filters
from django.db.models import Sum, Q
from .accounting_models import AccountingEntry, FinancialReport
from .accounting_serializers import (
    AccountingEntrySerializer, AccountingEntryListSerializer,
    FinancialReportSerializer, FinancialReportListSerializer
)

class AccountingEntryViewSet(viewsets.ModelViewSet):
    queryset = AccountingEntry.objects.all().order_by('-date', '-created_at')
    serializer_class = AccountingEntrySerializer
    permission_classes = [AllowAny]  # Temporarily allow unauthenticated access for testing
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['entry_type', 'category', 'payment_method', 'tenant', 'date']
    search_fields = ['description', 'reference_number', 'account']
    ordering_fields = ['date', 'amount', 'created_at']
    ordering = ['-date', '-created_at']
    
    def get_serializer_class(self):
        if self.action == 'list':
            return AccountingEntryListSerializer
        return AccountingEntrySerializer
    
    def create(self, request, *args, **kwargs):
        data = request.data.copy()
        
        # Generate unique ID if missing
        if not data.get('id'):
            data['id'] = f"AE{int(time.time() * 1000)}"
        
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
    
    @action(detail=False, methods=['get'])
    def summary(self, request):
        """Get financial summary for a date range"""
        start_date = request.query_params.get('start_date')
        end_date = request.query_params.get('end_date')
        
        queryset = self.get_queryset()
        if start_date:
            queryset = queryset.filter(date__gte=start_date)
        if end_date:
            queryset = queryset.filter(date__lte=end_date)
        
        total_income = queryset.filter(entry_type='income').aggregate(
            total=Sum('amount')
        )['total'] or 0
        
        total_expenses = queryset.filter(entry_type='expense').aggregate(
            total=Sum('amount')
        )['total'] or 0
        
        net_profit = total_income - total_expenses
        
        return Response({
            'total_income': total_income,
            'total_expenses': total_expenses,
            'net_profit': net_profit,
            'entry_count': queryset.count()
        })

class FinancialReportViewSet(viewsets.ModelViewSet):
    queryset = FinancialReport.objects.all().order_by('-generated_at')
    serializer_class = FinancialReportSerializer
    permission_classes = [AllowAny]  # Temporarily allow unauthenticated access for testing
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['report_type', 'tenant']
    search_fields = ['title']
    ordering_fields = ['generated_at', 'start_date', 'end_date']
    ordering = ['-generated_at']
    
    def get_serializer_class(self):
        if self.action == 'list':
            return FinancialReportListSerializer
        return FinancialReportSerializer
    
    def create(self, request, *args, **kwargs):
        data = request.data.copy()
        
        # Generate unique ID if missing
        if not data.get('id'):
            data['id'] = f"FR{int(time.time() * 1000)}"
        
        # Set default values
        if not data.get('tenant'):
            data['tenant'] = 1  # Default tenant
        
        if not data.get('generated_by'):
            data['generated_by'] = 1  # Default user
        
        # Calculate financial data
        start_date = data.get('start_date')
        end_date = data.get('end_date')
        
        if start_date and end_date:
            entries = AccountingEntry.objects.filter(
                date__gte=start_date,
                date__lte=end_date,
                tenant=data.get('tenant', 1)
            )
            
            total_income = entries.filter(entry_type='income').aggregate(
                total=Sum('amount')
            )['total'] or 0
            
            total_expenses = entries.filter(entry_type='expense').aggregate(
                total=Sum('amount')
            )['total'] or 0
            
            data['total_income'] = total_income
            data['total_expenses'] = total_expenses
            data['net_profit'] = total_income - total_expenses
        
        serializer = self.get_serializer(data=data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)
