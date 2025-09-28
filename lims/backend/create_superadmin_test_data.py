#!/usr/bin/env python3
"""
Script to create test data for superadmin models
"""

import os
import sys
import django
from datetime import datetime, timedelta
import random

# Add the project directory to the Python path
sys.path.append('/home/becky/Desktop/LIMS-system/lims/backend')

# Set up Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from lab.components.superadmin.models import (
    SuperAdminUser, UserSession, DatabaseBackup, GlobalNotification,
    NotificationTemplate, NotificationHistory, Tenant, BillingPlan
)
from django.utils import timezone

def create_superadmin_users():
    """Create test superadmin users"""
    print("Creating SuperAdmin users...")
    
    users_data = [
        {
            'username': 'superadmin',
            'email': 'superadmin@lims.com',
            'first_name': 'Super',
            'last_name': 'Admin',
            'role': 'super_admin',
            'status': 'active',
        },
        {
            'username': 'systemadmin',
            'email': 'system@lims.com',
            'first_name': 'System',
            'last_name': 'Administrator',
            'role': 'system_admin',
            'status': 'active',
        },
        {
            'username': 'supportadmin',
            'email': 'support@lims.com',
            'first_name': 'Support',
            'last_name': 'Admin',
            'role': 'support_admin',
            'status': 'active',
        }
    ]
    
    for user_data in users_data:
        user, created = SuperAdminUser.objects.get_or_create(
            username=user_data['username'],
            defaults=user_data
        )
        if created:
            print(f"Created SuperAdmin user: {user.username}")
        else:
            print(f"SuperAdmin user already exists: {user.username}")

def create_user_sessions():
    """Create test user sessions"""
    print("Creating user sessions...")
    
    # Get some tenants for realistic data
    tenants = list(Tenant.objects.all()[:5])
    
    session_data = [
        {
            'user_id': '1',
            'user_name': 'John Smith',
            'user_email': 'john.smith@example.com',
            'user_role': 'Doctor',
            'tenant_id': str(tenants[0].id) if tenants else '1',
            'tenant_name': tenants[0].company_name if tenants else 'Test Hospital',
            'status': 'online',
            'ip_address': '192.168.1.100',
            'user_agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
            'location': 'New York, US',
            'device_info': 'Chrome on Windows',
            'actions_count': random.randint(10, 200),
        },
        {
            'user_id': '2',
            'user_name': 'Sarah Johnson',
            'user_email': 'sarah.johnson@example.com',
            'user_role': 'Technician',
            'tenant_id': str(tenants[1].id) if len(tenants) > 1 else '2',
            'tenant_name': tenants[1].company_name if len(tenants) > 1 else 'City Lab',
            'status': 'idle',
            'ip_address': '192.168.1.101',
            'user_agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
            'location': 'Los Angeles, US',
            'device_info': 'Safari on Mac',
            'actions_count': random.randint(5, 150),
        },
        {
            'user_id': '3',
            'user_name': 'Mike Wilson',
            'user_email': 'mike.wilson@example.com',
            'user_role': 'Tenant Admin',
            'tenant_id': str(tenants[2].id) if len(tenants) > 2 else '3',
            'tenant_name': tenants[2].company_name if len(tenants) > 2 else 'MedLab Solutions',
            'status': 'away',
            'ip_address': '192.168.1.102',
            'user_agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36',
            'location': 'Chicago, US',
            'device_info': 'Firefox on Linux',
            'actions_count': random.randint(20, 300),
        }
    ]
    
    for session_info in session_data:
        session, created = UserSession.objects.get_or_create(
            user_id=session_info['user_id'],
            defaults=session_info
        )
        if created:
            print(f"Created user session: {session.user_name}")
        else:
            print(f"User session already exists: {session.user_name}")

def create_database_backups():
    """Create test database backups"""
    print("Creating database backups...")
    
    backup_data = [
        {
            'name': 'Daily Backup - 2025-01-20',
            'backup_type': 'full',
            'status': 'completed',
            'file_path': '/backups/daily_2025_01_20.sql',
            'file_size': 1024 * 1024 * 50,  # 50MB
            'created_by': 'superadmin',
            'completed_at': timezone.now() - timedelta(hours=2),
        },
        {
            'name': 'Weekly Backup - 2025-01-19',
            'backup_type': 'full',
            'status': 'completed',
            'file_path': '/backups/weekly_2025_01_19.sql',
            'file_size': 1024 * 1024 * 100,  # 100MB
            'created_by': 'systemadmin',
            'completed_at': timezone.now() - timedelta(days=1),
        },
        {
            'name': 'Incremental Backup - 2025-01-20',
            'backup_type': 'incremental',
            'status': 'in_progress',
            'created_by': 'superadmin',
        },
        {
            'name': 'Scheduled Backup - 2025-01-21',
            'backup_type': 'full',
            'status': 'pending',
            'is_scheduled': True,
            'scheduled_at': timezone.now() + timedelta(hours=6),
            'schedule_frequency': 'daily',
            'created_by': 'systemadmin',
        }
    ]
    
    for backup_info in backup_data:
        backup, created = DatabaseBackup.objects.get_or_create(
            name=backup_info['name'],
            defaults=backup_info
        )
        if created:
            print(f"Created backup: {backup.name}")
        else:
            print(f"Backup already exists: {backup.name}")

def create_notification_templates():
    """Create test notification templates"""
    print("Creating notification templates...")
    
    templates_data = [
        {
            'name': 'System Maintenance Notice',
            'title_template': 'Scheduled System Maintenance - {date}',
            'message_template': 'We will be performing scheduled maintenance on {date} from {start_time} to {end_time}. The system may be temporarily unavailable during this time.',
            'notification_type': 'maintenance',
            'created_by': 'superadmin',
        },
        {
            'name': 'Security Alert',
            'title_template': 'Security Notice: {action_required}',
            'message_template': 'For security reasons, we require you to {action_required}. Please complete this action within 24 hours.',
            'notification_type': 'warning',
            'created_by': 'systemadmin',
        },
        {
            'name': 'Feature Update',
            'title_template': 'New Features Available: {feature_name}',
            'message_template': 'We are excited to announce new features in your dashboard: {feature_name}. Check them out in your account settings.',
            'notification_type': 'info',
            'created_by': 'superadmin',
        }
    ]
    
    for template_info in templates_data:
        template, created = NotificationTemplate.objects.get_or_create(
            name=template_info['name'],
            defaults=template_info
        )
        if created:
            print(f"Created notification template: {template.name}")
        else:
            print(f"Notification template already exists: {template.name}")

def create_global_notifications():
    """Create test global notifications"""
    print("Creating global notifications...")
    
    notifications_data = [
        {
            'title': 'System Maintenance Scheduled',
            'message': 'We will be performing scheduled maintenance on January 25th from 2:00 AM to 4:00 AM EST. The system may be temporarily unavailable during this time.',
            'notification_type': 'maintenance',
            'priority': 'medium',
            'target_audience': 'all',
            'created_by': 'superadmin',
            'sent_at': timezone.now() - timedelta(hours=1),
            'total_recipients': 150,
            'delivered_count': 145,
            'read_count': 120,
        },
        {
            'title': 'New Dashboard Features Available',
            'message': 'We have added new analytics features to your dashboard. Check out the enhanced reporting capabilities in your account.',
            'notification_type': 'info',
            'priority': 'low',
            'target_audience': 'all',
            'created_by': 'systemadmin',
            'sent_at': timezone.now() - timedelta(days=1),
            'total_recipients': 150,
            'delivered_count': 148,
            'read_count': 95,
        },
        {
            'title': 'Security Update Required',
            'message': 'Please update your password to maintain account security. This is a mandatory security update.',
            'notification_type': 'warning',
            'priority': 'high',
            'target_audience': 'all',
            'created_by': 'superadmin',
            'is_active': True,
        }
    ]
    
    for notification_info in notifications_data:
        notification, created = GlobalNotification.objects.get_or_create(
            title=notification_info['title'],
            defaults=notification_info
        )
        if created:
            print(f"Created global notification: {notification.title}")
        else:
            print(f"Global notification already exists: {notification.title}")

def main():
    """Main function to create all test data"""
    print("Creating superadmin test data...")
    print("=" * 50)
    
    try:
        create_superadmin_users()
        print()
        
        create_user_sessions()
        print()
        
        create_database_backups()
        print()
        
        create_notification_templates()
        print()
        
        create_global_notifications()
        print()
        
        print("=" * 50)
        print("✅ All superadmin test data created successfully!")
        
    except Exception as e:
        print(f"❌ Error creating test data: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    main()
