from rest_framework import serializers
from django.conf import settings
from .profile_models import UserProfile


class UserProfileSerializer(serializers.ModelSerializer):
    """Serializer for UserProfile model"""
    email = serializers.EmailField(source='user.email', read_only=True)
    username = serializers.CharField(source='user.username', read_only=True)
    full_name = serializers.CharField(read_only=True)
    
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
            'profile_picture',
            'timezone',
            'language',
            'email_notifications',
            'sms_notifications',
            'push_notifications',
            'full_name',
            'created_at',
            'updated_at',
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']
    
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


class ProfilePictureUploadSerializer(serializers.ModelSerializer):
    """Serializer for profile picture upload"""
    
    class Meta:
        model = UserProfile
        fields = ['profile_picture']
    
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
