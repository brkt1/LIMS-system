from rest_framework import serializers
from .message_models import Message

class MessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Message
        fields = '__all__'
        read_only_fields = ('created_at', 'read_at')
