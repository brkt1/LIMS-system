from django.db import models
from django.conf import settings


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
        # Update the user's first_name and last_name if they exist
        if self.first_name:
            self.user.first_name = self.first_name
        if self.last_name:
            self.user.last_name = self.last_name
        self.user.save()
        super().save(*args, **kwargs)
