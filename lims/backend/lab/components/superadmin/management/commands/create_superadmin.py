from django.core.management.base import BaseCommand, CommandError
from django.contrib.auth import get_user_model
from django.db import transaction
import getpass

class Command(BaseCommand):
    help = 'Create a Django superadmin account for the LIMS system'

    def add_arguments(self, parser):
        parser.add_argument(
            '--username',
            type=str,
            help='Username for the superadmin',
        )
        parser.add_argument(
            '--email',
            type=str,
            help='Email for the superadmin',
        )
        parser.add_argument(
            '--password',
            type=str,
            help='Password for the superadmin (will prompt if not provided)',
        )
        parser.add_argument(
            '--first-name',
            type=str,
            default='Super',
            help='First name for the superadmin',
        )
        parser.add_argument(
            '--last-name',
            type=str,
            default='Admin',
            help='Last name for the superadmin',
        )

    def handle(self, *args, **options):
        try:
            with transaction.atomic():
                User = get_user_model()
                
                # Get user input
                username = options['username'] or input('Username: ').strip()
                email = options['email'] or input('Email: ').strip()
                first_name = options['first_name']
                last_name = options['last_name']
                
                # Get password securely
                if options['password']:
                    password = options['password']
                else:
                    password = getpass.getpass('Password: ')
                    password_confirm = getpass.getpass('Confirm Password: ')
                    if password != password_confirm:
                        raise CommandError('Passwords do not match')

                # Validate input
                if not username or not email or not password:
                    raise CommandError('Username, email, and password are required')

                # Check if user already exists
                if User.objects.filter(username=username).exists():
                    raise CommandError(f'Username "{username}" already exists')

                if User.objects.filter(email=email).exists():
                    raise CommandError(f'Email "{email}" already exists')

                # Create superadmin user
                user = User.objects.create_user(
                    username=username,
                    email=email,
                    password=password,
                    first_name=first_name,
                    last_name=last_name,
                    role='superadmin',
                    is_staff=True,
                    is_superuser=True,
                    is_active=True
                )

                self.stdout.write(
                    self.style.SUCCESS(
                        f'Successfully created superadmin account:'
                    )
                )
                self.stdout.write(f'Username: {user.username}')
                self.stdout.write(f'Email: {user.email}')
                self.stdout.write(f'Role: {user.get_role_display()}')
                self.stdout.write(f'Is Staff: {user.is_staff}')
                self.stdout.write(f'Is Superuser: {user.is_superuser}')

        except Exception as e:
            raise CommandError(f'Error creating superadmin: {str(e)}')
