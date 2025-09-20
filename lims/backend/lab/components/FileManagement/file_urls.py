from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .file_views import FileUploadViewSet, FileShareViewSet

router = DefaultRouter()
router.register(r'files', FileUploadViewSet)
router.register(r'shares', FileShareViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
