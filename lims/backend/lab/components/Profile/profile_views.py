from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.contrib.auth.models import User
from django.shortcuts import get_object_or_404
from django.utils import timezone
from .profile_models import UserProfile
from .profile_serializers import (
    UserProfileSerializer, 
    ProfilePictureUploadSerializer, 
    PasswordChangeSerializer,
    ProfileExportSerializer,
    ProfileDeleteSerializer
)


@api_view(['GET', 'PUT'])
@permission_classes([IsAuthenticated])
def profile_view(request):
    """Get or update user profile"""
    try:
        # Get or create user profile
        profile, created = UserProfile.objects.get_or_create(
            user=request.user,
            defaults={
                'first_name': request.user.first_name,
                'last_name': request.user.last_name,
            }
        )
        
        if request.method == 'GET':
            serializer = UserProfileSerializer(profile, context={'request': request})
            return Response(serializer.data)
        
        elif request.method == 'PUT':
            serializer = UserProfileSerializer(profile, data=request.data, partial=True, context={'request': request})
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    except Exception as e:
        return Response(
            {'error': str(e)}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def upload_profile_picture(request):
    """Upload profile picture"""
    try:
        profile, created = UserProfile.objects.get_or_create(
            user=request.user,
            defaults={
                'first_name': request.user.first_name if request.user.first_name else '',
                'last_name': request.user.last_name if request.user.last_name else '',
            }
        )
        
        serializer = ProfilePictureUploadSerializer(profile, data=request.data, context={'request': request})
        if serializer.is_valid():
            serializer.save()
            return Response({
                'message': 'Profile picture uploaded successfully',
                'profile_picture': serializer.data['profile_picture'],
                'profile_picture_url': serializer.data['profile_picture_url']
            })
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    except Exception as e:
        import traceback
        print(f"Profile picture upload error: {str(e)}")
        print(f"Traceback: {traceback.format_exc()}")
        return Response(
            {'error': str(e)}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_profile_picture(request):
    """Delete profile picture"""
    try:
        profile = get_object_or_404(UserProfile, user=request.user)
        
        if profile.profile_picture:
            # Delete the file from storage
            profile.profile_picture.delete(save=False)
            profile.profile_picture = None
            profile.save()
            
            return Response({
                'message': 'Profile picture deleted successfully'
            })
        else:
            return Response(
                {'error': 'No profile picture to delete'}, 
                status=status.HTTP_404_NOT_FOUND
            )
    
    except Exception as e:
        return Response(
            {'error': str(e)}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def change_password(request):
    """Change user password"""
    try:
        serializer = PasswordChangeSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            serializer.save()
            return Response({
                'message': 'Password changed successfully'
            })
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    except Exception as e:
        return Response(
            {'error': str(e)}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_profile(request):
    """Soft delete user profile"""
    try:
        profile = get_object_or_404(UserProfile, user=request.user)
        
        serializer = ProfileDeleteSerializer(data=request.data)
        if serializer.is_valid():
            # Soft delete the profile
            profile.soft_delete()
            
            # Also deactivate the user account
            user = request.user
            user.is_active = False
            user.save()
            
            return Response({
                'message': 'Profile deleted successfully',
                'deleted_at': profile.deleted_at
            })
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    except Exception as e:
        return Response(
            {'error': str(e)}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def restore_profile(request):
    """Restore a soft-deleted profile"""
    try:
        profile = get_object_or_404(UserProfile, user=request.user, is_deleted=True)
        
        # Restore the profile
        profile.restore()
        
        # Reactivate the user account
        user = request.user
        user.is_active = True
        user.save()
        
        return Response({
            'message': 'Profile restored successfully'
        })
    
    except Exception as e:
        return Response(
            {'error': str(e)}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def export_profile(request):
    """Export user profile data"""
    try:
        profile = get_object_or_404(UserProfile, user=request.user)
        
        serializer = ProfileExportSerializer(profile)
        
        return Response({
            'message': 'Profile data exported successfully',
            'data': serializer.data,
            'exported_at': timezone.now()
        })
    
    except Exception as e:
        return Response(
            {'error': str(e)}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def reset_profile(request):
    """Reset profile to default values (keep only essential data)"""
    try:
        profile = get_object_or_404(UserProfile, user=request.user)
        
        # Reset to default values while keeping essential data
        profile.phone = ""
        profile.address = ""
        profile.bio = ""
        profile.date_of_birth = None
        profile.gender = ""
        profile.blood_type = ""
        profile.emergency_contact = ""
        profile.emergency_phone = ""
        profile.medical_history = ""
        profile.allergies = ""
        profile.medications = ""
        profile.insurance_provider = ""
        profile.insurance_number = ""
        profile.employee_id = ""
        profile.department = ""
        profile.position = ""
        profile.hire_date = None
        profile.timezone = "UTC"
        profile.language = "en"
        profile.email_notifications = True
        profile.sms_notifications = False
        profile.push_notifications = True
        
        # Delete profile picture
        if profile.profile_picture:
            profile.profile_picture.delete(save=False)
            profile.profile_picture = None
        
        profile.save()
        
        serializer = UserProfileSerializer(profile)
        
        return Response({
            'message': 'Profile reset to default values successfully',
            'data': serializer.data
        })
    
    except Exception as e:
        return Response(
            {'error': str(e)}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )
