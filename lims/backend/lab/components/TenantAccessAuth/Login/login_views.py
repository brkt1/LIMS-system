from django.contrib.auth import get_user_model, authenticate
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
from .login_serializers import UserSerializer

User = get_user_model()

class LoginView(APIView):
    def post(self, request):
        email = request.data.get("email")
        password = request.data.get("password")

        if not email or not password:
            return Response({"detail": "Email and password required"}, status=400)

        # Try to authenticate with email first, then username
        user = authenticate(request, email=email, password=password)
        if not user:
            # Fallback to username authentication for default Django User model
            user = authenticate(request, username=email, password=password)
        
        if not user:
            return Response({"detail": "Invalid credentials"}, status=401)

        # Generate JWT tokens
        refresh = RefreshToken.for_user(user)

        # Serialize user data
        user_data = UserSerializer(user).data

        # Handle tenant (check if user has tenant attribute)
        tenant_data = None
        if hasattr(user, 'tenant') and user.tenant:
            tenant_data = {"name": user.tenant}
        else:
            # For default Django User model, use a default tenant
            tenant_data = {"name": "Default Lab"}

        return Response({
            "access": str(refresh.access_token),
            "refresh": str(refresh),
            "user": user_data,
            "tenant": tenant_data,
        })
