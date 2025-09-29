#!/usr/bin/env python
"""
Script to create test users for the LIMS system
Run this with: python manage.py shell < create_test_users.py
"""

from django.contrib.auth import get_user_model
from django.core.management.base import BaseCommand

User = get_user_model()

# Test users data
test_users = [
    {
        'email': 'superadmin@lims.com',
        'password': '123',
        'role': 'superadmin',
        'first_name': 'Super',
        'last_name': 'Admin',
        'is_staff': True,
        'is_superuser': True,
    },
    {
        'email': 'tenantadmin@lims.com',
        'password': '123',
        'role': 'tenant-admin',
        'first_name': 'Tenant',
        'last_name': 'Admin',
        'is_staff': True,
    },
    {
        'email': 'doctor@lims.com',
        'password': '123',
        'role': 'doctor',
        'first_name': 'Dr. John',
        'last_name': 'Smith',
    },
    {
        'email': 'technician@lims.com',
        'password': '123',
        'role': 'technician',
        'first_name': 'Mike',
        'last_name': 'Davis',
    },
    {
        'email': 'support@lims.com',
        'password': '123',
        'role': 'support',
        'first_name': 'Sarah',
        'last_name': 'Wilson',
    },
    {
        'email': 'patient@lims.com',
        'password': '123',
        'role': 'patient',
        'first_name': 'Jane',
        'last_name': 'Doe',
    },
]

def create_test_users():
    """Create test users for development"""
    created_count = 0
    updated_count = 0
    
    for user_data in test_users:
        email = user_data['email']
        password = user_data['password']
        role = user_data['role']
        
        # Remove password and role from user_data for User creation
        user_creation_data = {k: v for k, v in user_data.items() if k not in ['password', 'role']}
        
        # Add username field (required by Django's AbstractUser)
        user_creation_data['username'] = email  # Use email as username
        
        try:
            # Try to get existing user
            user = User.objects.get(email=email)
            print(f"User {email} already exists, updating...")
            
            # Update user data
            for key, value in user_creation_data.items():
                setattr(user, key, value)
            # Set the role explicitly
            user.role = role
            user.set_password(password)
            user.save()
            updated_count += 1
            
        except User.DoesNotExist:
            # Create new user
            user = User.objects.create_user(**user_creation_data)
            user.role = role
            user.set_password(password)
            user.save()
            print(f"Created user: {email} with role: {role}")
            created_count += 1
    
    print(f"\nSummary:")
    print(f"Created: {created_count} users")
    print(f"Updated: {updated_count} users")
    print(f"Total: {created_count + updated_count} users")

if __name__ == "__main__":
    create_test_users()
