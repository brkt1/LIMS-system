from rest_framework import serializers
from django.contrib.auth import authenticate, get_user_model
from lab.components.Profile.profile_models import UserProfile

User = get_user_model()

class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)

    def validate(self, attrs):
        email = attrs.get("email")
        password = attrs.get("password")

        if not email or not password:
            raise serializers.ValidationError("Email and password required")

        user = authenticate(email=email, password=password)
        if not user:
            raise serializers.ValidationError("Invalid credentials")

        attrs["user"] = user
        return attrs


class UserSerializer(serializers.ModelSerializer):
    profile_picture = serializers.SerializerMethodField()
    
    class Meta:
        model = User
        fields = [
            "id", 
            "email", 
            "username", 
            "first_name", 
            "last_name", 
            "is_staff", 
            "is_superuser", 
            "role",
            "tenant",
            "isPaid",
            "created_by",
            "profile_picture"
        ]
    
    def get_profile_picture(self, obj):
        """Get the user's profile picture URL"""
        try:
            profile = UserProfile.objects.get(user=obj)
            if profile.profile_picture:
                # Return the full URL for the profile picture
                request = self.context.get('request')
                if request:
                    return request.build_absolute_uri(profile.profile_picture.url)
                return profile.profile_picture.url
        except UserProfile.DoesNotExist:
            pass
        return None
