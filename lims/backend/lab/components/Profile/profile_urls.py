from django.urls import path
from . import profile_views

urlpatterns = [
    # Profile management
    path('', profile_views.profile_view, name='profile'),
    path('upload-picture/', profile_views.upload_profile_picture, name='upload-profile-picture'),
    path('picture/', profile_views.delete_profile_picture, name='delete-profile-picture'),
    path('change-password/', profile_views.change_password, name='change-password'),
]
