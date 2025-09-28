from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
import pytz
from django.conf import settings

class ProfileOptionsViewSet(viewsets.ViewSet):
    """
    ViewSet for providing profile form options
    """
    permission_classes = [AllowAny]  # Temporarily allow unauthenticated access for testing

    @action(detail=False, methods=['get'])
    def timezones(self, request):
        """
        Get list of available timezones
        """
        try:
            # Simplified timezone list without pytz dependency
            timezones = [
                {'value': 'UTC', 'label': 'UTC (UTC+00:00)', 'offset': '+00:00'},
                {'value': 'America/New_York', 'label': 'Eastern Time (UTC-05:00)', 'offset': '-05:00'},
                {'value': 'America/Chicago', 'label': 'Central Time (UTC-06:00)', 'offset': '-06:00'},
                {'value': 'America/Denver', 'label': 'Mountain Time (UTC-07:00)', 'offset': '-07:00'},
                {'value': 'America/Los_Angeles', 'label': 'Pacific Time (UTC-08:00)', 'offset': '-08:00'},
                {'value': 'Europe/London', 'label': 'London (UTC+00:00)', 'offset': '+00:00'},
                {'value': 'Europe/Paris', 'label': 'Paris (UTC+01:00)', 'offset': '+01:00'},
                {'value': 'Europe/Berlin', 'label': 'Berlin (UTC+01:00)', 'offset': '+01:00'},
                {'value': 'Asia/Tokyo', 'label': 'Tokyo (UTC+09:00)', 'offset': '+09:00'},
                {'value': 'Asia/Shanghai', 'label': 'Shanghai (UTC+08:00)', 'offset': '+08:00'},
                {'value': 'Asia/Kolkata', 'label': 'Mumbai (UTC+05:30)', 'offset': '+05:30'},
                {'value': 'Australia/Sydney', 'label': 'Sydney (UTC+10:00)', 'offset': '+10:00'},
            ]
            
            return Response({
                'success': True,
                'data': timezones,
                'count': len(timezones)
            })
        except Exception as e:
            return Response({
                'success': False,
                'error': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    @action(detail=False, methods=['get'])
    def languages(self, request):
        """
        Get list of available languages
        """
        try:
            # Get languages from Django settings or provide defaults
            languages = [
                {'value': 'en', 'label': 'English', 'native_name': 'English'},
                {'value': 'am', 'label': 'Amharic', 'native_name': 'አማርኛ'},
                {'value': 'om', 'label': 'Oromo', 'native_name': 'Afaan Oromoo'},
                {'value': 'es', 'label': 'Spanish', 'native_name': 'Español'},
                {'value': 'fr', 'label': 'French', 'native_name': 'Français'},
                {'value': 'de', 'label': 'German', 'native_name': 'Deutsch'},
                {'value': 'it', 'label': 'Italian', 'native_name': 'Italiano'},
                {'value': 'pt', 'label': 'Portuguese', 'native_name': 'Português'},
                {'value': 'ru', 'label': 'Russian', 'native_name': 'Русский'},
                {'value': 'zh', 'label': 'Chinese', 'native_name': '中文'},
                {'value': 'ja', 'label': 'Japanese', 'native_name': '日本語'},
                {'value': 'ko', 'label': 'Korean', 'native_name': '한국어'},
                {'value': 'ar', 'label': 'Arabic', 'native_name': 'العربية'},
                {'value': 'hi', 'label': 'Hindi', 'native_name': 'हिन्दी'},
            ]
            
            return Response({
                'success': True,
                'data': languages,
                'count': len(languages)
            })
        except Exception as e:
            return Response({
                'success': False,
                'error': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    @action(detail=False, methods=['get'])
    def genders(self, request):
        """
        Get list of available gender options
        """
        try:
            genders = [
                {'value': 'Male', 'label': 'Male'},
                {'value': 'Female', 'label': 'Female'},
                {'value': 'Other', 'label': 'Other'},
                {'value': 'Prefer not to say', 'label': 'Prefer not to say'},
            ]
            
            return Response({
                'success': True,
                'data': genders,
                'count': len(genders)
            })
        except Exception as e:
            return Response({
                'success': False,
                'error': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    @action(detail=False, methods=['get'])
    def blood_types(self, request):
        """
        Get list of available blood type options
        """
        try:
            blood_types = [
                {'value': 'A+', 'label': 'A+', 'description': 'A Positive'},
                {'value': 'A-', 'label': 'A-', 'description': 'A Negative'},
                {'value': 'B+', 'label': 'B+', 'description': 'B Positive'},
                {'value': 'B-', 'label': 'B-', 'description': 'B Negative'},
                {'value': 'AB+', 'label': 'AB+', 'description': 'AB Positive'},
                {'value': 'AB-', 'label': 'AB-', 'description': 'AB Negative'},
                {'value': 'O+', 'label': 'O+', 'description': 'O Positive'},
                {'value': 'O-', 'label': 'O-', 'description': 'O Negative'},
            ]
            
            return Response({
                'success': True,
                'data': blood_types,
                'count': len(blood_types)
            })
        except Exception as e:
            return Response({
                'success': False,
                'error': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
