from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from lab.components.superadmin.models import Tenant
from lab.components.Receipts.receipts_models import Receipt, BillingTransaction
from lab.components.HomeVisit.home_visit_models import HomeVisitRequest, HomeVisitSchedule
from lab.components.BranchManagement.branch_models import Branch, BranchStaff
from lab.components.ContractManagement.contract_models import Contract, ContractRenewal
from lab.components.Accounting.accounting_models import AccountingEntry, FinancialReport
from decimal import Decimal
import random
from datetime import date, time, datetime, timedelta

User = get_user_model()

class Command(BaseCommand):
    help = 'Create sample data for all new APIs'

    def handle(self, *args, **options):
        self.stdout.write('Creating sample data...')
        
        # Get or create default tenant and user
        tenant, created = Tenant.objects.get_or_create(
            id=1,
            defaults={
                'company_name': 'MediCare Clinic',
                'contact_email': 'admin@medicareclinic.com',
                'contact_phone': '+1 (555) 123-4567',
                'address': '123 Medical Center Dr, Health City, HC 12345',
                'status': 'active',
                'plan_name': 'Professional',
                'max_users': 50,
                'current_users': 10,
            }
        )
        
        user, created = User.objects.get_or_create(
            id=1,
            defaults={
                'username': 'admin',
                'email': 'admin@medicareclinic.com',
                'first_name': 'Admin',
                'last_name': 'User',
            }
        )
        
        # Create sample receipts
        self.create_receipts(tenant, user)
        
        # Create sample home visit requests
        self.create_home_visit_requests(tenant, user)
        
        # Create sample branches
        self.create_branches(tenant, user)
        
        # Create sample contracts
        self.create_contracts(tenant, user)
        
        # Create sample accounting entries
        self.create_accounting_entries(tenant, user)
        
        self.stdout.write(
            self.style.SUCCESS('Successfully created sample data!')
        )

    def create_receipts(self, tenant, user):
        receipts_data = [
            {
                'id': 'RCP001',
                'patient_name': 'John Smith',
                'patient_id': 'P001',
                'amount': Decimal('150.00'),
                'status': 'printed',
                'services': ['Blood Test', 'Consultation'],
                'doctor': 'Dr. Sarah Johnson',
                'payment_method': 'insurance',
                'print_count': 2,
            },
            {
                'id': 'RCP002',
                'patient_name': 'Sarah Johnson',
                'patient_id': 'P002',
                'amount': Decimal('75.50'),
                'status': 'generated',
                'services': ['X-Ray'],
                'doctor': 'Dr. Mike Davis',
                'payment_method': 'card',
                'print_count': 0,
            },
            {
                'id': 'RCP003',
                'patient_name': 'Mike Davis',
                'patient_id': 'P003',
                'amount': Decimal('200.00'),
                'status': 'draft',
                'services': ['MRI', 'Consultation'],
                'doctor': 'Dr. Lisa Wilson',
                'payment_method': 'cash',
                'print_count': 0,
            },
        ]
        
        for data in receipts_data:
            Receipt.objects.get_or_create(
                id=data['id'],
                defaults={
                    **data,
                    'tenant': tenant,
                    'created_by': user,
                }
            )

    def create_home_visit_requests(self, tenant, user):
        requests_data = [
            {
                'id': 'HVR001',
                'patient_name': 'John Smith',
                'patient_id': 'P001',
                'address': '123 Main St, City, State 12345',
                'phone': '+1 (555) 123-4567',
                'requested_date': date.today() + timedelta(days=1),
                'requested_time': time(10, 0),
                'service_type': 'consultation',
                'doctor': 'Dr. Sarah Johnson',
                'priority': 'normal',
                'status': 'approved',
            },
            {
                'id': 'HVR002',
                'patient_name': 'Sarah Johnson',
                'patient_id': 'P002',
                'address': '456 Oak Ave, City, State 12345',
                'phone': '+1 (555) 234-5678',
                'requested_date': date.today() + timedelta(days=2),
                'requested_time': time(14, 30),
                'service_type': 'sample_collection',
                'doctor': 'Dr. Mike Davis',
                'priority': 'high',
                'status': 'pending',
            },
        ]
        
        for data in requests_data:
            HomeVisitRequest.objects.get_or_create(
                id=data['id'],
                defaults={
                    **data,
                    'tenant': tenant,
                    'created_by': user,
                }
            )

    def create_branches(self, tenant, user):
        branches_data = [
            {
                'id': 'BR001',
                'name': 'Main Branch',
                'address': '123 Medical Center Dr, Health City, HC 12345',
                'phone': '+1 (555) 123-4567',
                'email': 'main@medicareclinic.com',
                'city': 'Health City',
                'state': 'HC',
                'zip_code': '12345',
                'manager': 'Dr. Sarah Johnson',
                'established_date': date(2020, 1, 1),
                'total_staff': 15,
                'total_patients': 500,
                'services': ['General Medicine', 'Laboratory', 'Radiology'],
                'status': 'active',
            },
            {
                'id': 'BR002',
                'name': 'West Branch',
                'address': '456 West St, Health City, HC 12346',
                'phone': '+1 (555) 234-5678',
                'email': 'west@medicareclinic.com',
                'city': 'Health City',
                'state': 'HC',
                'zip_code': '12346',
                'manager': 'Dr. Mike Davis',
                'established_date': date(2021, 6, 1),
                'total_staff': 8,
                'total_patients': 250,
                'services': ['General Medicine', 'Laboratory'],
                'status': 'active',
            },
        ]
        
        for data in branches_data:
            Branch.objects.get_or_create(
                id=data['id'],
                defaults={
                    **data,
                    'tenant': tenant,
                    'created_by': user,
                }
            )

    def create_contracts(self, tenant, user):
        contracts_data = [
            {
                'id': 'CT001',
                'title': 'Medical Equipment Maintenance',
                'type': 'maintenance',
                'vendor': 'MedTech Solutions',
                'vendor_contact': 'John Smith',
                'vendor_email': 'john@medtech.com',
                'vendor_phone': '+1 (555) 345-6789',
                'start_date': date(2024, 1, 1),
                'end_date': date(2024, 12, 31),
                'value': Decimal('50000.00'),
                'currency': 'USD',
                'terms': 'Monthly maintenance of all medical equipment',
                'description': 'Comprehensive maintenance contract for all medical equipment',
                'status': 'active',
            },
            {
                'id': 'CT002',
                'title': 'Medical Supplies Contract',
                'type': 'supply',
                'vendor': 'Health Supply Co',
                'vendor_contact': 'Jane Doe',
                'vendor_email': 'jane@healthsupply.com',
                'vendor_phone': '+1 (555) 456-7890',
                'start_date': date(2024, 3, 1),
                'end_date': date(2025, 2, 28),
                'value': Decimal('25000.00'),
                'currency': 'USD',
                'terms': 'Monthly delivery of medical supplies',
                'description': 'Regular supply of medical consumables and equipment',
                'status': 'active',
            },
        ]
        
        for data in contracts_data:
            Contract.objects.get_or_create(
                id=data['id'],
                defaults={
                    **data,
                    'tenant': tenant,
                    'created_by': user,
                }
            )

    def create_accounting_entries(self, tenant, user):
        entries_data = [
            {
                'id': 'AE001',
                'description': 'Patient consultation fees',
                'entry_type': 'income',
                'category': 'consultation_fees',
                'amount': Decimal('5000.00'),
                'payment_method': 'insurance',
                'account': 'Revenue - Consultations',
                'date': date.today(),
            },
            {
                'id': 'AE002',
                'description': 'Laboratory test fees',
                'entry_type': 'income',
                'category': 'test_fees',
                'amount': Decimal('3000.00'),
                'payment_method': 'insurance',
                'account': 'Revenue - Laboratory',
                'date': date.today(),
            },
            {
                'id': 'AE003',
                'description': 'Staff salaries',
                'entry_type': 'expense',
                'category': 'salaries',
                'amount': Decimal('15000.00'),
                'payment_method': 'bank_transfer',
                'account': 'Expenses - Salaries',
                'date': date.today(),
            },
            {
                'id': 'AE004',
                'description': 'Medical supplies',
                'entry_type': 'expense',
                'category': 'medical_supplies',
                'amount': Decimal('2000.00'),
                'payment_method': 'card',
                'account': 'Expenses - Supplies',
                'date': date.today(),
            },
        ]
        
        for data in entries_data:
            AccountingEntry.objects.get_or_create(
                id=data['id'],
                defaults={
                    **data,
                    'tenant': tenant,
                    'created_by': user,
                }
            )
