from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from django.db.models import Q
from .faq_models import FAQ
from .faq_serializers import FAQSerializer


class FAQViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing FAQ items
    """
    queryset = FAQ.objects.all()
    serializer_class = FAQSerializer
    permission_classes = [AllowAny]  # Temporarily allow unauthenticated access for testing
    filter_backends = []
    search_fields = ['question', 'answer', 'category__name']
    ordering_fields = ['category', 'helpful_count', 'created_at']
    ordering = ['category', '-helpful_count']

    def get_queryset(self):
        """
        Filter FAQ items based on category
        """
        queryset = FAQ.objects.filter(is_published=True)
        
        # Filter by category
        category = self.request.query_params.get('category', 'all')
        if category != 'all':
            queryset = queryset.filter(category__name=category)
        
        # Search functionality
        search = self.request.query_params.get('search')
        if search:
            queryset = queryset.filter(
                Q(question__icontains=search) |
                Q(answer__icontains=search)
            )
        
        return queryset

    @action(detail=False, methods=['get'])
    def categories(self, request):
        """
        Get list of FAQ categories
        """
        try:
            from .faq_models import FAQCategory
            
            # Get categories from database
            faq_categories = FAQCategory.objects.filter(is_active=True)
            
            categories = [
                {
                    'value': category.name,
                    'label': category.name,
                    'description': category.description or f'FAQ category: {category.name}'
                }
                for category in faq_categories
            ]
            
            # If no categories in database, return default categories
            if not categories:
                categories = [
                    {'value': 'General', 'label': 'General Questions', 'description': 'General information and policies'},
                    {'value': 'Technical', 'label': 'Technical Support', 'description': 'Technical issues and troubleshooting'},
                    {'value': 'Account', 'label': 'Account Management', 'description': 'Profile and account settings'},
                    {'value': 'Billing', 'label': 'Billing & Payments', 'description': 'Payment and billing questions'}
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

    @action(detail=True, methods=['post'])
    def mark_helpful(self, request, pk=None):
        """
        Mark an FAQ item as helpful
        """
        try:
            faq = self.get_object()
            faq.helpful_count += 1
            faq.save()
            
            return Response({
                'success': True,
                'message': 'FAQ marked as helpful',
                'helpful_count': faq.helpful_count
            })
        except Exception as e:
            return Response({
                'success': False,
                'error': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    @action(detail=True, methods=['post'])
    def mark_not_helpful(self, request, pk=None):
        """
        Mark an FAQ item as not helpful
        """
        try:
            faq = self.get_object()
            faq.not_helpful_count += 1
            faq.save()
            
            return Response({
                'success': True,
                'message': 'FAQ marked as not helpful',
                'not_helpful_count': faq.not_helpful_count
            })
        except Exception as e:
            return Response({
                'success': False,
                'error': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    @action(detail=False, methods=['get'])
    def popular(self, request):
        """
        Get most popular FAQ items
        """
        try:
            limit = int(request.query_params.get('limit', 10))
            
            queryset = self.get_queryset()
            popular_faqs = queryset.order_by('-helpful_count')[:limit]
            serializer = self.get_serializer(popular_faqs, many=True)
            
            return Response({
                'success': True,
                'data': serializer.data,
                'count': len(serializer.data)
            })
        except Exception as e:
            return Response({
                'success': False,
                'error': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)