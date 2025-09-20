from rest_framework import serializers
from .faq_models import FAQCategory, FAQ, FAQFeedback

class FAQCategorySerializer(serializers.ModelSerializer):
    faq_count = serializers.SerializerMethodField()
    
    class Meta:
        model = FAQCategory
        fields = ['id', 'name', 'description', 'is_active', 'faq_count', 'created_at', 'updated_at']
    
    def get_faq_count(self, obj):
        return obj.faqs.filter(is_published=True).count()

class FAQSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(source='category.name', read_only=True)
    related_faqs = serializers.SerializerMethodField()
    
    class Meta:
        model = FAQ
        fields = ['id', 'question', 'answer', 'category', 'category_name', 'is_published', 
                 'view_count', 'helpful_count', 'not_helpful_count', 'related_faqs', 
                 'created_at', 'updated_at']
    
    def get_related_faqs(self, obj):
        related = obj.related_faqs.filter(is_published=True)[:5]
        return [{'id': faq.id, 'question': faq.question} for faq in related]

class FAQListSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(source='category.name', read_only=True)
    
    class Meta:
        model = FAQ
        fields = ['id', 'question', 'category_name', 'view_count', 'helpful_count', 'created_at']

class FAQFeedbackSerializer(serializers.ModelSerializer):
    class Meta:
        model = FAQFeedback
        fields = ['id', 'faq', 'is_helpful', 'comment', 'created_at']
