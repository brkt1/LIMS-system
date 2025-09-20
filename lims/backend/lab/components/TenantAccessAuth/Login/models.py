# tenantaccess_login/models.py
from django.db import models
from django.contrib.auth.models import AbstractUser, Group, Permission

class User(AbstractUser):
    ROLE_CHOICES = [
        ('superadmin', 'Super Admin'),
        ('tenant-admin', 'Tenant Admin'),
        ('doctor', 'Doctor'),
        ('technician', 'Technician'),
        ('support', 'Support'),
        ('patient', 'Patient'),
    ]

    email = models.EmailField(unique=True)
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='patient')
    tenant = models.CharField(max_length=100, null=True, blank=True)  # link to tenant system
    isPaid = models.BooleanField(default=False)
    created_by = models.CharField(max_length=100, null=True, blank=True)

    # Fix clashes with auth.User
    groups = models.ManyToManyField(
        Group,
        related_name="tenantaccess_users",  # unique related_name
        blank=True,
        help_text="The groups this user belongs to.",
        verbose_name="groups",
    )

    user_permissions = models.ManyToManyField(
        Permission,
        related_name="tenantaccess_users_permissions",  # unique related_name
        blank=True,
        help_text="Specific permissions for this user.",
        verbose_name="user permissions",
    )

    # Use email as username
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']  # username is still required internally

    def __str__(self):
        return f"{self.email} ({self.role})"
