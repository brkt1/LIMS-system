from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from django.db.models import Count, Avg
from .test_pricing_models import TestPricing


class TestCategoryViewSet(viewsets.ViewSet):
    """
    ViewSet for managing test categories
    """
    permission_classes = [AllowAny]  # Temporarily allow unauthenticated access for testing

    @action(detail=False, methods=['get'])
    def list_categories(self, request):
        """
        Get list of available test categories
        """
        try:
            # Import the actual categories from the model
            from .test_pricing_models import TEST_CATEGORY_CHOICES
            
            # Convert Django choices to API format
            categories = [
                {
                    'value': choice[0],
                    'label': choice[1],
                    'description': self._get_category_description(choice[0]),
                    'icon': self._get_category_icon(choice[0])
                }
                for choice in TEST_CATEGORY_CHOICES
            ]
            
            return Response({
                'success': True,
                'data': categories,
                'count': len(categories)
            })
        except Exception as e:
            return Response({
                'success': False,
                'error': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    @action(detail=False, methods=['get'])
    def category_stats(self, request):
        """
        Get statistics for each test category
        """
        try:
            tenant = request.query_params.get('tenant')
            
            # Get test count and average price by category
            from .test_pricing_models import TEST_CATEGORY_CHOICES
            category_stats = []
            categories = [choice[0] for choice in TEST_CATEGORY_CHOICES]
            
            for category in categories:
                queryset = TestPricing.objects.filter(category=category)
                if tenant:
                    queryset = queryset.filter(tenant_id=tenant)
                
                test_count = queryset.count()
                avg_price = queryset.aggregate(avg_price=Avg('base_price'))['avg_price'] or 0
                active_tests = queryset.filter(is_active=True).count()
                
                category_stats.append({
                    'value': category,
                    'label': category,
                    'test_count': test_count,
                    'active_tests': active_tests,
                    'average_price': float(avg_price),
                    'description': self._get_category_description(category)
                })
            
            return Response({
                'success': True,
                'data': category_stats,
                'count': len(category_stats)
            })
        except Exception as e:
            return Response({
                'success': False,
                'error': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def _get_category_description(self, category):
        """
        Get description for a test category
        """
        descriptions = {
            'blood_tests': 'Blood and blood-forming organs tests including CBC, blood typing, and coagulation studies',
            'urine_tests': 'Urine analysis and kidney function tests including routine urinalysis, protein analysis, and kidney function markers',
            'imaging': 'Medical imaging tests including X-rays, CT scans, MRI, and ultrasound examinations',
            'microbiology': 'Infectious disease and pathogen testing including cultures, sensitivity testing, and molecular diagnostics',
            'pathology': 'Tissue and cellular analysis including histopathology, cytology, and cancer screening',
            'cardiology': 'Heart and cardiovascular testing including cardiac enzymes, lipid panels, and cardiovascular risk markers',
            'neurology': 'Nervous system and brain function tests including EEG, EMG, and neurological assessments',
            'pulmonology': 'Lung and respiratory system tests including pulmonary function tests and respiratory assessments',
            'endocrinology': 'Hormone and endocrine system tests including thyroid function, diabetes monitoring, and reproductive hormones',
            'immunology': 'Immune system and allergy testing including antibody testing, autoimmune markers, and allergy panels'
        }
        return descriptions.get(category, 'Laboratory test category')

    def _get_category_icon(self, category):
        """
        Get icon for a test category
        """
        icons = {
            'blood_tests': 'blood-drop',
            'urine_tests': 'droplet',
            'imaging': 'camera',
            'microbiology': 'microscope',
            'pathology': 'layers',
            'cardiology': 'heart',
            'neurology': 'brain',
            'pulmonology': 'lungs',
            'endocrinology': 'activity',
            'immunology': 'shield'
        }
        return icons.get(category, 'flask')
