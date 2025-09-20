from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import filters
from django.db import models
from .faq_models import FAQCategory, FAQ, FAQFeedback
from .faq_serializers import FAQCategorySerializer, FAQSerializer, FAQListSerializer, FAQFeedbackSerializer

class FAQCategoryViewSet(viewsets.ModelViewSet):
    queryset = FAQCategory.objects.filter(is_active=True)
    serializer_class = FAQCategorySerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    search_fields = ['name', 'description']
    filterset_fields = ['is_active']

class FAQViewSet(viewsets.ModelViewSet):
    queryset = FAQ.objects.filter(is_published=True)
    serializer_class = FAQSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['category', 'is_published']
    search_fields = ['question', 'answer']
    ordering_fields = ['question', 'view_count', 'helpful_count', 'created_at']
    ordering = ['question']
    
    def get_serializer_class(self):
        if self.action == 'list':
            return FAQListSerializer
        return FAQSerializer
    
    @action(detail=True, methods=['post'])
    def view(self, request, pk=None):
        faq = self.get_object()
        faq.view_count += 1
        faq.save()
        return Response({'status': 'View count updated'})
    
    @action(detail=True, methods=['post'])
    def feedback(self, request, pk=None):
        faq = self.get_object()
        is_helpful = request.data.get('is_helpful')
        comment = request.data.get('comment', '')
        
        if is_helpful is None:
            return Response({'error': 'is_helpful field is required'}, status=status.HTTP_400_BAD_REQUEST)
        
        # Create feedback
        feedback_data = {
            'faq': faq.id,
            'is_helpful': is_helpful,
            'comment': comment,
            'user_ip': request.META.get('REMOTE_ADDR')
        }
        
        serializer = FAQFeedbackSerializer(data=feedback_data)
        if serializer.is_valid():
            serializer.save()
            
            # Update helpful/not helpful counts
            if is_helpful:
                faq.helpful_count += 1
            else:
                faq.not_helpful_count += 1
            faq.save()
            
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=False, methods=['get'])
    def search(self, request):
        query = request.query_params.get('q', '')
        category = request.query_params.get('category')
        
        queryset = self.get_queryset()
        
        if query:
            queryset = queryset.filter(
                models.Q(question__icontains=query) | 
                models.Q(answer__icontains=query)
            )
        
        if category:
            queryset = queryset.filter(category_id=category)
        
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

class FAQFeedbackViewSet(viewsets.ModelViewSet):
    queryset = FAQFeedback.objects.all()
    serializer_class = FAQFeedbackSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['faq', 'is_helpful']
