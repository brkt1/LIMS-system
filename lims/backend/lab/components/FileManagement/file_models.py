from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()
from lab.models import LabBaseModel

class FileUpload(LabBaseModel):
    FILE_TYPES = [
        ('image', 'Image'),
        ('document', 'Document'),
        ('pdf', 'PDF'),
        ('excel', 'Excel'),
        ('csv', 'CSV'),
        ('other', 'Other'),
    ]
    
    name = models.CharField(max_length=255)
    file = models.FileField(upload_to='uploads/')
    file_type = models.CharField(max_length=20, choices=FILE_TYPES)
    file_size = models.PositiveIntegerField()
    uploaded_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name='uploaded_files')
    tenant = models.CharField(max_length=100, null=True, blank=True)
    is_public = models.BooleanField(default=False)
    description = models.TextField(blank=True, null=True)
    download_count = models.PositiveIntegerField(default=0)
    
    class Meta:
        app_label = 'lab'
        ordering = ['-created_at']
    
    def __str__(self):
        return self.name

class FileShare(LabBaseModel):
    file = models.ForeignKey(FileUpload, on_delete=models.CASCADE, related_name='shares')
    shared_with = models.ForeignKey(User, on_delete=models.CASCADE, related_name='shared_files')
    shared_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name='file_shares')
    permission = models.CharField(max_length=20, choices=[
        ('read', 'Read Only'),
        ('write', 'Read/Write'),
    ], default='read')
    expires_at = models.DateTimeField(null=True, blank=True)
    
    class Meta:
        app_label = 'lab'
        unique_together = ['file', 'shared_with']
    
    def __str__(self):
        return f"{self.file.name} shared with {self.shared_with.username}"
