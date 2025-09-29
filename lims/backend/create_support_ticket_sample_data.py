#!/usr/bin/env python
"""
Script to create sample support ticket data for testing
"""
import os
import sys
import django
from datetime import datetime, timedelta
import random

# Setup Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from django.contrib.auth import get_user_model
from lab.components.Support.SupportTicket.support_ticket_models import SupportTicket, SupportMessage
from lab.components.superadmin.models import Tenant

User = get_user_model()

def create_sample_support_tickets():
    """Create sample support tickets for testing"""
    
    # Get or create a test user
    try:
        test_user = User.objects.get(username='admin')
    except User.DoesNotExist:
        print("Creating test user...")
        test_user = User.objects.create_user(
            username='admin',
            email='admin@example.com',
            password='admin123',
            first_name='Admin',
            last_name='User'
        )
    
    # Get or create a tenant
    try:
        tenant = Tenant.objects.get(company_name='Test Lab')
    except Tenant.DoesNotExist:
        print("Creating test tenant...")
        tenant = Tenant.objects.create(
            company_name='Test Lab',
            email='test@lab.com',
            phone='123-456-7890',
            address='123 Test Street',
            is_active=True
        )
    
    # Sample support ticket data
    sample_tickets = [
        {
            'title': 'Login Issues',
            'description': 'Unable to log into the system. Getting authentication error.',
            'status': 'open',
            'priority': 'high',
            'category': 'technical',
            'reporter_name': 'Dr. John Smith',
            'reporter_email': 'john.smith@example.com',
            'reporter_phone': '555-0123',
            'tags': ['login', 'authentication', 'urgent']
        },
        {
            'title': 'Report Generation Problem',
            'description': 'Test reports are not generating properly. PDF format is corrupted.',
            'status': 'in_progress',
            'priority': 'medium',
            'category': 'reports',
            'reporter_name': 'Dr. Sarah Johnson',
            'reporter_email': 'sarah.johnson@example.com',
            'reporter_phone': '555-0124',
            'tags': ['reports', 'pdf', 'generation']
        },
        {
            'title': 'Equipment Calibration Request',
            'description': 'Centrifuge needs calibration. Last calibration was 6 months ago.',
            'status': 'pending',
            'priority': 'medium',
            'category': 'equipment',
            'reporter_name': 'Lab Technician Mike',
            'reporter_email': 'mike.tech@example.com',
            'reporter_phone': '555-0125',
            'tags': ['equipment', 'calibration', 'centrifuge']
        },
        {
            'title': 'Billing Inquiry',
            'description': 'Patient billing shows incorrect charges for lab tests.',
            'status': 'resolved',
            'priority': 'low',
            'category': 'billing',
            'reporter_name': 'Billing Manager Lisa',
            'reporter_email': 'lisa.billing@example.com',
            'reporter_phone': '555-0126',
            'tags': ['billing', 'charges', 'patient']
        },
        {
            'title': 'System Performance Issues',
            'description': 'System is running slowly, especially during peak hours.',
            'status': 'open',
            'priority': 'high',
            'category': 'technical',
            'reporter_name': 'IT Manager Tom',
            'reporter_email': 'tom.it@example.com',
            'reporter_phone': '555-0127',
            'tags': ['performance', 'slow', 'system']
        },
        {
            'title': 'Data Export Request',
            'description': 'Need to export patient data for audit purposes.',
            'status': 'pending',
            'priority': 'medium',
            'category': 'data_export',
            'reporter_name': 'Compliance Officer Jane',
            'reporter_email': 'jane.compliance@example.com',
            'reporter_phone': '555-0128',
            'tags': ['data', 'export', 'audit']
        },
        {
            'title': 'Appointment Scheduling Bug',
            'description': 'Appointment scheduling is not working for next week.',
            'status': 'in_progress',
            'priority': 'high',
            'category': 'appointments',
            'reporter_name': 'Receptionist Anna',
            'reporter_email': 'anna.reception@example.com',
            'reporter_phone': '555-0129',
            'tags': ['appointments', 'scheduling', 'bug']
        },
        {
            'title': 'Notification Settings',
            'description': 'Email notifications are not being sent for test results.',
            'status': 'open',
            'priority': 'medium',
            'category': 'notifications',
            'reporter_name': 'Dr. Robert Brown',
            'reporter_email': 'robert.brown@example.com',
            'reporter_phone': '555-0130',
            'tags': ['notifications', 'email', 'test-results']
        }
    ]
    
    print("Creating sample support tickets...")
    
    for i, ticket_data in enumerate(sample_tickets):
        # Create support ticket
        ticket = SupportTicket.objects.create(
            title=ticket_data['title'],
            description=ticket_data['description'],
            status=ticket_data['status'],
            priority=ticket_data['priority'],
            category=ticket_data['category'],
            created_by=test_user,
            tenant=tenant,
            reporter_name=ticket_data['reporter_name'],
            reporter_email=ticket_data['reporter_email'],
            reporter_phone=ticket_data['reporter_phone'],
            tags=ticket_data['tags'],
            created_at=datetime.now() - timedelta(days=random.randint(1, 30))
        )
        
        # Add some sample messages for some tickets
        if i < 4:  # Add messages to first 4 tickets
            messages = [
                {
                    'message': f"Thank you for reporting this issue. We are looking into it.",
                    'message_type': 'support_response',
                    'is_internal': False
                },
                {
                    'message': f"Can you provide more details about when this issue occurs?",
                    'message_type': 'support_response',
                    'is_internal': False
                }
            ]
            
            for msg_data in messages:
                SupportMessage.objects.create(
                    ticket=ticket,
                    sender=test_user,
                    message=msg_data['message'],
                    message_type=msg_data['message_type'],
                    is_internal=msg_data['is_internal'],
                    created_at=datetime.now() - timedelta(days=random.randint(1, 15))
                )
        
        print(f"Created ticket: {ticket.title} (ID: {ticket.id})")
    
    print(f"\nSuccessfully created {len(sample_tickets)} sample support tickets!")
    print("You can now test the support ticket functionality in the frontend.")

if __name__ == '__main__':
    create_sample_support_tickets()
