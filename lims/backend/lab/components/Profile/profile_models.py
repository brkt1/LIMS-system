from django.db import models
from django.conf import settings
from django.utils import timezone


class UserProfile(models.Model):
    """Extended user profile model"""
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL, 
        on_delete=models.CASCADE, 
        related_name='profile'
    )
    
    # Personal Information
    first_name = models.CharField(max_length=100, blank=True)
    last_name = models.CharField(max_length=100, blank=True)
    phone = models.CharField(max_length=20, blank=True)
    address = models.TextField(blank=True)
    bio = models.TextField(blank=True)
    
    # Additional Personal Information
    date_of_birth = models.DateField(null=True, blank=True)
    gender = models.CharField(
        max_length=20,
        blank=True,
        choices=[
            ('Male', 'Male'),
            ('Female', 'Female'),
            ('Other', 'Other'),
            ('Prefer not to say', 'Prefer not to say'),
        ]
    )
    blood_type = models.CharField(
        max_length=5,
        blank=True,
        choices=[
            ('A+', 'A+'),
            ('A-', 'A-'),
            ('B+', 'B+'),
            ('B-', 'B-'),
            ('AB+', 'AB+'),
            ('AB-', 'AB-'),
            ('O+', 'O+'),
            ('O-', 'O-'),
        ]
    )
    
    # Emergency Contact Information
    emergency_contact = models.CharField(max_length=100, blank=True)
    emergency_phone = models.CharField(max_length=20, blank=True)
    
    # Medical Information
    medical_history = models.TextField(blank=True)
    allergies = models.TextField(blank=True)
    medications = models.TextField(blank=True)
    
    # Insurance Information
    insurance_provider = models.CharField(max_length=100, blank=True)
    insurance_number = models.CharField(max_length=50, blank=True)
    
    # Professional Information (for staff)
    employee_id = models.CharField(max_length=50, blank=True)
    department = models.CharField(max_length=100, blank=True)
    position = models.CharField(max_length=100, blank=True)
    hire_date = models.DateField(null=True, blank=True)
    
    # Account Status
    is_active = models.BooleanField(default=True)
    is_deleted = models.BooleanField(default=False)
    deleted_at = models.DateTimeField(null=True, blank=True)
    
    # Profile Picture
    profile_picture = models.ImageField(
        upload_to='profile_pictures/', 
        null=True, 
        blank=True
    )
    
    # Preferences
    timezone = models.CharField(
        max_length=50, 
        default='UTC',
        choices=[
            ('UTC', 'UTC'),
            ('America/New_York', 'Eastern Time'),
            ('America/Chicago', 'Central Time'),
            ('America/Denver', 'Mountain Time'),
            ('America/Los_Angeles', 'Pacific Time'),
            ('Europe/London', 'London'),
            ('Europe/Paris', 'Paris'),
            ('Asia/Tokyo', 'Tokyo'),
        ]
    )
    language = models.CharField(
        max_length=10,
        default='en',
        choices=[
            ('en', 'English'),
            ('om', 'Oromo'),
            ('am', 'Amharic'),
        ]
    )
    
    # Notification Preferences
    email_notifications = models.BooleanField(default=True)
    sms_notifications = models.BooleanField(default=False)
    push_notifications = models.BooleanField(default=True)
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'user_profiles'
        verbose_name = 'User Profile'
        verbose_name_plural = 'User Profiles'
    
    def __str__(self):
        return f"{self.user.username}'s Profile"
    
    @property
    def full_name(self):
        """Return the user's full name"""
        if self.first_name and self.last_name:
            return f"{self.first_name} {self.last_name}"
        return self.user.get_full_name() or self.user.username
    
    def save(self, *args, **kwargs):
        # Update the user's first_name and last_name if they exist and are not empty
        user_updated = False
        if self.first_name and self.first_name.strip():
            self.user.first_name = self.first_name.strip()
            user_updated = True
        if self.last_name and self.last_name.strip():
            self.user.last_name = self.last_name.strip()
            user_updated = True
        
        # Only save user if we actually updated something
        if user_updated:
            self.user.save()
        
        super().save(*args, **kwargs)
    
    def soft_delete(self):
        """Soft delete the profile"""
        self.is_deleted = True
        self.deleted_at = timezone.now()
        self.save()
    
    def restore(self):
        """Restore a soft-deleted profile"""
        self.is_deleted = False
        self.deleted_at = None
        self.save()
    
    class Meta:
        db_table = 'user_profiles'
        verbose_name = 'User Profile'
        verbose_name_plural = 'User Profiles'
        ordering = ['-created_at']
