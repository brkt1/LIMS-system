from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .faq_views import FAQCategoryViewSet, FAQViewSet, FAQFeedbackViewSet

router = DefaultRouter()
router.register(r'categories', FAQCategoryViewSet)
router.register(r'faqs', FAQViewSet)
router.register(r'feedback', FAQFeedbackViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
