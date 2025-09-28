from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from lab.components.superadmin.models import Tenant
from lab.components.BranchManagement.branch_models import Branch, BranchStaff
from datetime import date
import json

User = get_user_model()

class Command(BaseCommand):
    help = 'Create sample branch data for testing'

    def handle(self, *args, **options):
        # Get or create a default tenant
        tenant, created = Tenant.objects.get_or_create(
            id=1,
            defaults={
                'name': 'Default Health Center',
                'domain': 'default.healthcenter.com',
                'is_active': True,
            }
        )
        
        # Get or create a default user
        user, created = User.objects.get_or_create(
            id=1,
            defaults={
                'username': 'admin',
                'email': 'admin@healthcenter.com',
                'first_name': 'Admin',
                'last_name': 'User',
            }
        )
        
        # Create sample branches
        branches_data = [
            {
                'id': 'BR001',
                'name': 'Main Health Center',
                'address': '123 Health Street',
                'phone': '+1-555-0101',
                'email': 'main@healthcenter.com',
                'city': 'Health City',
                'state': 'HC',
                'zip_code': '12345',
                'manager': 'Dr. Sarah Johnson',
                'established_date': date(2020, 1, 15),
                'total_staff': 25,
                'total_patients': 1500,
                'services': ['General Medicine', 'Laboratory', 'Radiology', 'Emergency Care'],
                'operating_hours': {
                    'monday': '8:00 AM - 6:00 PM',
                    'tuesday': '8:00 AM - 6:00 PM',
                    'wednesday': '8:00 AM - 6:00 PM',
                    'thursday': '8:00 AM - 6:00 PM',
                    'friday': '8:00 AM - 6:00 PM',
                    'saturday': '9:00 AM - 2:00 PM',
                    'sunday': 'Closed'
                },
                'status': 'active',
                'notes': 'Main branch with full services',
            },
            {
                'id': 'BR002',
                'name': 'Downtown Clinic',
                'address': '456 Business Ave',
                'phone': '+1-555-0102',
                'email': 'downtown@healthcenter.com',
                'city': 'Downtown',
                'state': 'DT',
                'zip_code': '67890',
                'manager': 'Dr. Michael Chen',
                'established_date': date(2021, 3, 20),
                'total_staff': 18,
                'total_patients': 1200,
                'services': ['General Medicine', 'Laboratory', 'Cardiology'],
                'operating_hours': {
                    'monday': '7:00 AM - 7:00 PM',
                    'tuesday': '7:00 AM - 7:00 PM',
                    'wednesday': '7:00 AM - 7:00 PM',
                    'thursday': '7:00 AM - 7:00 PM',
                    'friday': '7:00 AM - 7:00 PM',
                    'saturday': '8:00 AM - 4:00 PM',
                    'sunday': 'Closed'
                },
                'status': 'active',
                'notes': 'Downtown location with extended hours',
            },
            {
                'id': 'BR003',
                'name': 'Suburban Medical Center',
                'address': '789 Suburb Lane',
                'phone': '+1-555-0103',
                'email': 'suburban@healthcenter.com',
                'city': 'Suburbia',
                'state': 'SB',
                'zip_code': '54321',
                'manager': 'Dr. Emily Rodriguez',
                'established_date': date(2022, 6, 10),
                'total_staff': 32,
                'total_patients': 2100,
                'services': ['General Medicine', 'Laboratory', 'Radiology', 'Pediatrics', 'Dermatology'],
                'operating_hours': {
                    'monday': '8:00 AM - 5:00 PM',
                    'tuesday': '8:00 AM - 5:00 PM',
                    'wednesday': '8:00 AM - 5:00 PM',
                    'thursday': '8:00 AM - 5:00 PM',
                    'friday': '8:00 AM - 5:00 PM',
                    'saturday': '9:00 AM - 1:00 PM',
                    'sunday': 'Closed'
                },
                'status': 'active',
                'notes': 'Family-focused suburban location',
            },
            {
                'id': 'BR004',
                'name': 'Urgent Care Center',
                'address': '321 Emergency Blvd',
                'phone': '+1-555-0104',
                'email': 'urgent@healthcenter.com',
                'city': 'Urgent City',
                'state': 'UC',
                'zip_code': '98765',
                'manager': 'Dr. James Wilson',
                'established_date': date(2023, 2, 14),
                'total_staff': 15,
                'total_patients': 800,
                'services': ['Urgent Care', 'Emergency Medicine', 'Laboratory'],
                'operating_hours': {
                    'monday': '24/7',
                    'tuesday': '24/7',
                    'wednesday': '24/7',
                    'thursday': '24/7',
                    'friday': '24/7',
                    'saturday': '24/7',
                    'sunday': '24/7'
                },
                'status': 'active',
                'notes': '24/7 urgent care facility',
            },
            {
                'id': 'BR005',
                'name': 'Specialty Clinic',
                'address': '654 Specialist Way',
                'phone': '+1-555-0105',
                'email': 'specialty@healthcenter.com',
                'city': 'Expert City',
                'state': 'EC',
                'zip_code': '13579',
                'manager': 'Dr. Lisa Thompson',
                'established_date': date(2023, 8, 5),
                'total_staff': 12,
                'total_patients': 600,
                'services': ['Cardiology', 'Neurology', 'Oncology', 'Laboratory'],
                'operating_hours': {
                    'monday': '9:00 AM - 4:00 PM',
                    'tuesday': '9:00 AM - 4:00 PM',
                    'wednesday': '9:00 AM - 4:00 PM',
                    'thursday': '9:00 AM - 4:00 PM',
                    'friday': '9:00 AM - 4:00 PM',
                    'saturday': 'Closed',
                    'sunday': 'Closed'
                },
                'status': 'active',
                'notes': 'Specialized medical services',
            }
        ]
        
        created_count = 0
        for branch_data in branches_data:
            branch, created = Branch.objects.get_or_create(
                id=branch_data['id'],
                defaults={
                    **branch_data,
                    'tenant': tenant,
                    'created_by': user,
                }
            )
            if created:
                created_count += 1
                self.stdout.write(
                    self.style.SUCCESS(f'Created branch: {branch.name}')
                )
            else:
                self.stdout.write(
                    self.style.WARNING(f'Branch already exists: {branch.name}')
                )
        
        self.stdout.write(
            self.style.SUCCESS(f'Successfully created {created_count} new branches')
        )
