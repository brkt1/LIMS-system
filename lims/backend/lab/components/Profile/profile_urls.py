from django.urls import path
from . import profile_views
from .profile_options_views import ProfileOptionsViewSet

urlpatterns = [
    # Profile management
    path('', profile_views.profile_view, name='profile'),
    path('upload-picture/', profile_views.upload_profile_picture, name='upload-profile-picture'),
    path('picture/', profile_views.delete_profile_picture, name='delete-profile-picture'),
    path('change-password/', profile_views.change_password, name='change-password'),
    
    # Profile options
    path('options/timezones/', ProfileOptionsViewSet.as_view({'get': 'timezones'}), name='profile-timezones'),
    path('options/languages/', ProfileOptionsViewSet.as_view({'get': 'languages'}), name='profile-languages'),
    path('options/genders/', ProfileOptionsViewSet.as_view({'get': 'genders'}), name='profile-genders'),
    path('options/blood-types/', ProfileOptionsViewSet.as_view({'get': 'blood_types'}), name='profile-blood-types'),
]
