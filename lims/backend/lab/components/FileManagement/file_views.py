from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import filters
from django.http import HttpResponse
from django.shortcuts import get_object_or_404
from .file_models import FileUpload, FileShare
from .file_serializers import FileUploadSerializer, FileUploadListSerializer, FileShareSerializer

class FileUploadViewSet(viewsets.ModelViewSet):
    queryset = FileUpload.objects.all()
    serializer_class = FileUploadSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['file_type', 'uploaded_by', 'tenant', 'is_public']
    search_fields = ['name', 'description']
    ordering_fields = ['name', 'file_size', 'created_at', 'download_count']
    ordering = ['-created_at']
    
    def get_serializer_class(self):
        if self.action == 'list':
            return FileUploadListSerializer
        return FileUploadSerializer
    
    def perform_create(self, serializer):
        serializer.save(uploaded_by=self.request.user)
    
    @action(detail=True, methods=['get'])
    def download(self, request, pk=None):
        file_upload = self.get_object()
        
        # Check permissions
        if not file_upload.is_public and file_upload.uploaded_by != request.user:
            # Check if user has shared access
            if not FileShare.objects.filter(file=file_upload, shared_with=request.user).exists():
                return Response({'error': 'Permission denied'}, status=status.HTTP_403_FORBIDDEN)
        
        # Increment download count
        file_upload.download_count += 1
        file_upload.save()
        
        # Return file
        response = HttpResponse(file_upload.file.read(), content_type='application/octet-stream')
        response['Content-Disposition'] = f'attachment; filename="{file_upload.name}"'
        return response
    
    @action(detail=True, methods=['post'])
    def share(self, request, pk=None):
        file_upload = self.get_object()
        shared_with_id = request.data.get('shared_with')
        permission = request.data.get('permission', 'read')
        expires_at = request.data.get('expires_at')
        
        if not shared_with_id:
            return Response({'error': 'shared_with is required'}, status=status.HTTP_400_BAD_REQUEST)
        
        share_data = {
            'file': file_upload.id,
            'shared_with': shared_with_id,
            'shared_by': request.user.id,
            'permission': permission,
            'expires_at': expires_at
        }
        
        serializer = FileShareSerializer(data=share_data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class FileShareViewSet(viewsets.ModelViewSet):
    queryset = FileShare.objects.all()
    serializer_class = FileShareSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['file', 'shared_with', 'shared_by', 'permission']
