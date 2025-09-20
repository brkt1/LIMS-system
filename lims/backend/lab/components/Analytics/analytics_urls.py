from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .analytics_views import LabAnalyticsViewSet, TestCategoryAnalyticsViewSet, SystemLogViewSet

router = DefaultRouter()
router.register(r'lab-analytics', LabAnalyticsViewSet)
router.register(r'test-category-analytics', TestCategoryAnalyticsViewSet)
router.register(r'system-logs', SystemLogViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
