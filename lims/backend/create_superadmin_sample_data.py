#!/usr/bin/env python
"""
Script to create sample data for superadmin dashboard testing
"""
import os
import django
from django.conf import settings

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from lab.components.superadmin.models import Tenant
from lab.components.Analytics.analytics_models import SystemLog
from lab.components.TenantAccessAuth.Login.models import User
from datetime import datetime, timedelta
import random

def create_sample_tenants():
    """Create sample tenants for testing"""
    print("Creating sample tenants...")
    
    sample_tenants = [
        {
            "company_name": "Demo Lab 1",
            "email": "demo1@lims.com",
            "password": "123",
            "role": "tenant-admin",
            "is_paid": True,
            "created_by": "superadmin@lims.com",
            "billing_period": "monthly"
        },
        {
            "company_name": "Demo Lab 2", 
            "email": "demo2@lims.com",
            "password": "123",
            "role": "tenant-admin",
            "is_paid": True,
            "created_by": "superadmin@lims.com",
            "billing_period": "yearly"
        },
        {
            "company_name": "Demo Lab 3",
            "email": "demo3@lims.com", 
            "password": "123",
            "role": "tenant-admin",
            "is_paid": False,
            "created_by": "superadmin@lims.com",
            "billing_period": "monthly"
        }
    ]
    
    for tenant_data in sample_tenants:
        try:
            tenant = Tenant.objects.get(email=tenant_data["email"])
            print(f"Tenant {tenant_data['email']} already exists")
        except Tenant.DoesNotExist:
            tenant = Tenant.objects.create_user(**tenant_data)
            print(f"Created tenant: {tenant.company_name}")

def create_sample_system_logs():
    """Create sample system logs for testing"""
    print("Creating sample system logs...")
    
    # Get existing users for logs
    users = User.objects.all()[:3]
    if not users:
        print("No users found, creating sample logs with system user")
        users = [None] * 3
    
    sample_logs = [
        {
            "level": "info",
            "action": "User login",
            "details": "User successfully logged into the system",
            "user": users[0].email if users[0] else "system@lims.com",
            "tenant": "Demo Lab 1" if users[0] else None,
            "created_at": datetime.now() - timedelta(hours=1)
        },
        {
            "level": "info", 
            "action": "Tenant created",
            "details": "New tenant 'Demo Lab 1' was created successfully",
            "user": "superadmin@lims.com",
            "tenant": None,
            "created_at": datetime.now() - timedelta(hours=2)
        },
        {
            "level": "warning",
            "action": "Equipment maintenance due",
            "details": "Equipment 'Microscope Olympus CX23' requires maintenance",
            "user": users[1].email if users[1] else "technician@lims.com",
            "tenant": "Demo Lab 1" if users[1] else None,
            "created_at": datetime.now() - timedelta(hours=3)
        },
        {
            "level": "error",
            "action": "Test failed",
            "details": "Blood test failed due to sample contamination",
            "user": users[2].email if users[2] else "technician@lims.com", 
            "tenant": "Demo Lab 2" if users[2] else None,
            "created_at": datetime.now() - timedelta(hours=4)
        },
        {
            "level": "info",
            "action": "System backup completed",
            "details": "Daily system backup completed successfully",
            "user": "system@lims.com",
            "tenant": None,
            "created_at": datetime.now() - timedelta(hours=5)
        },
        {
            "level": "info",
            "action": "User logout",
            "details": "User logged out of the system",
            "user": users[0].email if users[0] else "doctor@lims.com",
            "tenant": "Demo Lab 1" if users[0] else None,
            "created_at": datetime.now() - timedelta(hours=6)
        }
    ]
    
    for log_data in sample_logs:
        try:
            log = SystemLog.objects.create(**log_data)
            print(f"Created system log: {log.action}")
        except Exception as e:
            print(f"Error creating log: {e}")

def main():
    """Main function to create all sample data"""
    print("Creating superadmin sample data...")
    
    try:
        create_sample_tenants()
        create_sample_system_logs()
        print("\n✅ Sample data created successfully!")
        print(f"Total tenants: {Tenant.objects.count()}")
        print(f"Total system logs: {SystemLog.objects.count()}")
        print(f"Total users: {User.objects.count()}")
        
    except Exception as e:
        print(f"❌ Error creating sample data: {e}")

if __name__ == "__main__":
    main()
