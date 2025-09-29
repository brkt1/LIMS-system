from rest_framework import viewsets
from rest_framework.permissions import AllowAny
from .message_models import Message
from .message_serializers import MessageSerializer

class MessageViewSet(viewsets.ModelViewSet):
    queryset = Message.objects.all()
    serializer_class = MessageSerializer
    permission_classes = [AllowAny]  # AllowAny for testing, change to IsAuthenticated in production
