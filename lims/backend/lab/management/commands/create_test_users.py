from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from django.db import transaction

User = get_user_model()

class Command(BaseCommand):
    help = 'Create test users for all roles'

    def handle(self, *args, **options):
        test_users = [
            {
                'username': 'superadmin',
                'email': 'superadmin@lims.com',
                'password': 'superadmin123',
                'role': 'superadmin',
                'tenant': 'Main Lab',
                'is_staff': True,
                'is_superuser': True
            },
            {
                'username': 'tenantadmin',
                'email': 'tenantadmin@lims.com',
                'password': 'tenantadmin123',
                'role': 'tenant-admin',
                'tenant': 'Lab Corp',
                'is_staff': True,
                'is_superuser': False
            },
            {
                'username': 'doctor',
                'email': 'doctor@lims.com',
                'password': 'doctor123',
                'role': 'doctor',
                'tenant': 'Lab Corp',
                'is_staff': False,
                'is_superuser': False
            },
            {
                'username': 'technician',
                'email': 'technician@lims.com',
                'password': 'technician123',
                'role': 'technician',
                'tenant': 'Lab Corp',
                'is_staff': False,
                'is_superuser': False
            },
            {
                'username': 'support',
                'email': 'support@lims.com',
                'password': 'support123',
                'role': 'support',
                'tenant': 'Lab Corp',
                'is_staff': False,
                'is_superuser': False
            },
            {
                'username': 'patient',
                'email': 'patient@lims.com',
                'password': 'patient123',
                'role': 'patient',
                'tenant': 'Lab Corp',
                'is_staff': False,
                'is_superuser': False
            }
        ]

        with transaction.atomic():
            for user_data in test_users:
                # Check if user already exists
                if User.objects.filter(email=user_data['email']).exists():
                    self.stdout.write(
                        self.style.WARNING(f'User {user_data["email"]} already exists, skipping...')
                    )
                    continue

                # Create user
                user = User.objects.create_user(
                    username=user_data['username'],
                    email=user_data['email'],
                    password=user_data['password'],
                    is_staff=user_data['is_staff'],
                    is_superuser=user_data['is_superuser']
                )

                # Set additional fields if they exist on the model
                if hasattr(user, 'role'):
                    user.role = user_data['role']
                if hasattr(user, 'tenant'):
                    user.tenant = user_data['tenant']
                
                user.save()

                self.stdout.write(
                    self.style.SUCCESS(f'Created user: {user_data["email"]} ({user_data["role"]})')
                )

        self.stdout.write(
            self.style.SUCCESS('\n✅ All test users created successfully!')
        )
        self.stdout.write('\n📋 Test Credentials:')
        self.stdout.write('=' * 50)
        for user_data in test_users:
            self.stdout.write(f'Role: {user_data["role"].upper()}')
            self.stdout.write(f'Email: {user_data["email"]}')
            self.stdout.write(f'Password: {user_data["password"]}')
            self.stdout.write('-' * 30)
