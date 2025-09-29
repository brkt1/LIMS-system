from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from django.db.models import Count
from .doctor_models import SPECIALTY_CHOICES


def _get_specialty_description(specialty_value):
    """
    Get description for a specialty
    """
    descriptions = {
        'cardiology': 'Heart and cardiovascular system specialist',
        'neurology': 'Brain and nervous system specialist',
        'pediatrics': 'Children\'s health specialist',
        'orthopedics': 'Bones, joints, and musculoskeletal specialist',
        'dermatology': 'Skin, hair, and nail specialist',
        'internal_medicine': 'Adult internal organ specialist',
        'surgery': 'Surgical procedures specialist',
        'radiology': 'Medical imaging specialist',
        'pathology': 'Disease diagnosis specialist',
        'anesthesiology': 'Anesthesia and pain management specialist',
        'emergency_medicine': 'Emergency care specialist',
        'family_medicine': 'Primary care for all ages specialist',
        'psychiatry': 'Mental health specialist',
        'oncology': 'Cancer treatment specialist',
        'gastroenterology': 'Digestive system specialist',
    }
    return descriptions.get(specialty_value, 'Medical specialist')


@api_view(['GET'])
@permission_classes([AllowAny])
def list_specialties(request):
    """
    Get list of available doctor specialties
    """
    try:
        # Convert Django choices to API format
        specialties = [
            {
                'value': choice[0],
                'label': choice[1],
                'description': _get_specialty_description(choice[0])
            }
            for choice in SPECIALTY_CHOICES
        ]
        
        return Response({
            'success': True,
            'data': specialties,
            'count': len(specialties)
        })
    except Exception as e:
        return Response({
            'success': False,
            'error': str(e)
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['GET'])
@permission_classes([AllowAny])
def specialty_stats(request):
    """
    Get statistics for each specialty
    """
    try:
        from .doctor_models import Doctor
        
        # Get doctor count by specialty
        specialty_stats = []
        for choice in SPECIALTY_CHOICES:
            specialty_value = choice[0]
            doctor_count = Doctor.objects.filter(specialty=specialty_value).count()
            
            specialty_stats.append({
                'value': specialty_value,
                'label': choice[1],
                'doctor_count': doctor_count,
                'description': _get_specialty_description(specialty_value)
            })
        
        return Response({
            'success': True,
            'data': specialty_stats,
            'count': len(specialty_stats)
        })
    except Exception as e:
        return Response({
            'success': False,
            'error': str(e)
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
