from rest_framework import serializers
from django.contrib.auth import authenticate, get_user_model

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
            "created_by"
        ]
