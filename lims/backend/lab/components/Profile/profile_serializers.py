from rest_framework import serializers
from django.conf import settings
from .profile_models import UserProfile


class UserProfileSerializer(serializers.ModelSerializer):
    """Serializer for UserProfile model"""
    email = serializers.EmailField(source='user.email', read_only=True)
    username = serializers.CharField(source='user.username', read_only=True)
    full_name = serializers.CharField(read_only=True)
    profile_picture_url = serializers.SerializerMethodField()
    
    class Meta:
        model = UserProfile
        fields = [
            'id',
            'first_name',
            'last_name',
            'email',
            'username',
            'phone',
            'address',
            'bio',
            'date_of_birth',
            'gender',
            'blood_type',
            'emergency_contact',
            'emergency_phone',
            'medical_history',
            'allergies',
            'medications',
            'insurance_provider',
            'insurance_number',
            'employee_id',
            'department',
            'position',
            'hire_date',
            'profile_picture',
            'profile_picture_url',
            'timezone',
            'language',
            'email_notifications',
            'sms_notifications',
            'push_notifications',
            'is_active',
            'is_deleted',
            'deleted_at',
            'full_name',
            'created_at',
            'updated_at',
        ]
        read_only_fields = ['id', 'created_at', 'updated_at', 'is_deleted', 'deleted_at']
    
    def validate_first_name(self, value):
        """Validate first name"""
        if value and len(value.strip()) < 2:
            raise serializers.ValidationError("First name must be at least 2 characters long.")
        return value.strip() if value else value
    
    def validate_last_name(self, value):
        """Validate last name"""
        if value and len(value.strip()) < 2:
            raise serializers.ValidationError("Last name must be at least 2 characters long.")
        return value.strip() if value else value
    
    def validate_phone(self, value):
        """Validate phone number"""
        if value and len(value.strip()) < 10:
            raise serializers.ValidationError("Phone number must be at least 10 characters long.")
        return value.strip() if value else value
    
    def validate_emergency_phone(self, value):
        """Validate emergency phone number"""
        if value and len(value.strip()) < 10:
            raise serializers.ValidationError("Emergency phone number must be at least 10 characters long.")
        return value.strip() if value else value
    
    def validate_date_of_birth(self, value):
        """Validate date of birth"""
        if value:
            from datetime import date
            today = date.today()
            age = today.year - value.year - ((today.month, today.day) < (value.month, value.day))
            if age < 0 or age > 150:
                raise serializers.ValidationError("Please enter a valid date of birth.")
        return value
    
    def validate_hire_date(self, value):
        """Validate hire date"""
        if value:
            from datetime import date
            today = date.today()
            if value > today:
                raise serializers.ValidationError("Hire date cannot be in the future.")
        return value
    
    def get_profile_picture_url(self, obj):
        """Get the full URL for the profile picture"""
        if obj.profile_picture:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.profile_picture.url)
            # Fallback for when request context is not available
            import os
            media_host = os.environ.get('DJANGO_MEDIA_HOST', 'http://localhost:8001')
            return f"{media_host}{obj.profile_picture.url}"
        return None


class ProfilePictureUploadSerializer(serializers.ModelSerializer):
    """Serializer for profile picture upload"""
    profile_picture_url = serializers.SerializerMethodField()
    
    class Meta:
        model = UserProfile
        fields = ['profile_picture', 'profile_picture_url']
    
    def validate_profile_picture(self, value):
        """Validate profile picture"""
        if value:
            # Check file size (max 5MB)
            if value.size > 5 * 1024 * 1024:
                raise serializers.ValidationError("File size must be less than 5MB.")
            
            # Check file type
            allowed_types = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
            if value.content_type not in allowed_types:
                raise serializers.ValidationError("Only JPEG, PNG, GIF, and WebP images are allowed.")
        
        return value
    
    def get_profile_picture_url(self, obj):
        """Get the full URL for the profile picture"""
        if obj.profile_picture:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.profile_picture.url)
            # Fallback for when request context is not available
            import os
            media_host = os.environ.get('DJANGO_MEDIA_HOST', 'http://localhost:8001')
            return f"{media_host}{obj.profile_picture.url}"
        return None


class PasswordChangeSerializer(serializers.Serializer):
    """Serializer for password change"""
    old_password = serializers.CharField(write_only=True)
    new_password = serializers.CharField(write_only=True, min_length=8)
    
    def validate_old_password(self, value):
        """Validate old password"""
        user = self.context['request'].user
        if not user.check_password(value):
            raise serializers.ValidationError("Old password is incorrect.")
        return value
    
    def validate_new_password(self, value):
        """Validate new password"""
        if len(value) < 8:
            raise serializers.ValidationError("New password must be at least 8 characters long.")
        return value
    
    def save(self):
        """Save the new password"""
        user = self.context['request'].user
        user.set_password(self.validated_data['new_password'])
        user.save()
        return user


class ProfileExportSerializer(serializers.ModelSerializer):
    """Serializer for profile data export"""
    email = serializers.EmailField(source='user.email', read_only=True)
    username = serializers.CharField(source='user.username', read_only=True)
    full_name = serializers.CharField(read_only=True)
    user_id = serializers.IntegerField(source='user.id', read_only=True)
    date_joined = serializers.DateTimeField(source='user.date_joined', read_only=True)
    last_login = serializers.DateTimeField(source='user.last_login', read_only=True)
    
    class Meta:
        model = UserProfile
        fields = [
            'user_id',
            'username',
            'email',
            'full_name',
            'first_name',
            'last_name',
            'phone',
            'address',
            'bio',
            'date_of_birth',
            'gender',
            'blood_type',
            'emergency_contact',
            'emergency_phone',
            'medical_history',
            'allergies',
            'medications',
            'insurance_provider',
            'insurance_number',
            'employee_id',
            'department',
            'position',
            'hire_date',
            'timezone',
            'language',
            'email_notifications',
            'sms_notifications',
            'push_notifications',
            'is_active',
            'date_joined',
            'last_login',
            'created_at',
            'updated_at',
        ]


class ProfileDeleteSerializer(serializers.Serializer):
    """Serializer for profile deletion confirmation"""
    confirm_deletion = serializers.BooleanField()
    reason = serializers.CharField(max_length=500, required=False, allow_blank=True)
    
    def validate_confirm_deletion(self, value):
        """Validate deletion confirmation"""
        if not value:
            raise serializers.ValidationError("You must confirm the deletion to proceed.")
        return value
