#!/usr/bin/env python3
"""
Script to create a Django superadmin account for the LIMS system
Run this with: python manage.py shell < create_superadmin.py
"""

import os
import sys
import django

# Add the project directory to the Python path
sys.path.append('/home/becky/Desktop/LIMS-system/lims/backend')

# Set up Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from django.contrib.auth import get_user_model

User = get_user_model()

def create_superadmin():
    """Create a superadmin user"""
    print("Creating Django Superadmin Account")
    print("=" * 40)
    
    # Default superadmin data
    superadmin_data = {
        'username': 'admin',
        'email': 'admin@lims.com',
        'password': 'admin123',
        'first_name': 'Super',
        'last_name': 'Admin',
        'role': 'superadmin',
        'is_staff': True,
        'is_superuser': True,
        'is_active': True
    }
    
    try:
        # Check if superadmin already exists
        if User.objects.filter(username=superadmin_data['username']).exists():
            print(f"Superadmin with username '{superadmin_data['username']}' already exists!")
            return
        
        if User.objects.filter(email=superadmin_data['email']).exists():
            print(f"Superadmin with email '{superadmin_data['email']}' already exists!")
            return
        
        # Create the superadmin user
        user = User.objects.create_user(**superadmin_data)
        
        print("✅ Successfully created superadmin account!")
        print(f"Username: {user.username}")
        print(f"Email: {user.email}")
        print(f"Password: {superadmin_data['password']}")
        print(f"Role: {user.get_role_display()}")
        print(f"Is Staff: {user.is_staff}")
        print(f"Is Superuser: {user.is_superuser}")
        print("\nYou can now login to the Django admin panel and the LIMS system.")
        
    except Exception as e:
        print(f"❌ Error creating superadmin: {str(e)}")

if __name__ == "__main__":
    create_superadmin()
