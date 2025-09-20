from rest_framework import serializers
from .file_models import FileUpload, FileShare

class FileUploadSerializer(serializers.ModelSerializer):
    uploaded_by_name = serializers.CharField(source='uploaded_by.username', read_only=True)
    file_url = serializers.SerializerMethodField()
    
    class Meta:
        model = FileUpload
        fields = ['id', 'name', 'file', 'file_url', 'file_type', 'file_size', 
                 'uploaded_by', 'uploaded_by_name', 'tenant', 'is_public', 
                 'description', 'download_count', 'created_at', 'updated_at']
    
    def get_file_url(self, obj):
        if obj.file:
            return obj.file.url
        return None

class FileUploadListSerializer(serializers.ModelSerializer):
    uploaded_by_name = serializers.CharField(source='uploaded_by.username', read_only=True)
    file_url = serializers.SerializerMethodField()
    
    class Meta:
        model = FileUpload
        fields = ['id', 'name', 'file_url', 'file_type', 'file_size', 
                 'uploaded_by_name', 'is_public', 'download_count', 'created_at']
    
    def get_file_url(self, obj):
        if obj.file:
            return obj.file.url
        return None

class FileShareSerializer(serializers.ModelSerializer):
    file_name = serializers.CharField(source='file.name', read_only=True)
    shared_with_name = serializers.CharField(source='shared_with.username', read_only=True)
    shared_by_name = serializers.CharField(source='shared_by.username', read_only=True)
    
    class Meta:
        model = FileShare
        fields = ['id', 'file', 'file_name', 'shared_with', 'shared_with_name', 
                 'shared_by', 'shared_by_name', 'permission', 'expires_at', 'created_at']
