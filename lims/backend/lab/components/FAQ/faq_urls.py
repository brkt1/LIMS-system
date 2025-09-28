from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .faq_views import FAQViewSet

router = DefaultRouter()
router.register(r'faqs', FAQViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
