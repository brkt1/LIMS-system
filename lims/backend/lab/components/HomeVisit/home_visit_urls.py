from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .home_visit_views import HomeVisitRequestViewSet, HomeVisitScheduleViewSet

router = DefaultRouter()
router.register(r'requests', HomeVisitRequestViewSet)
router.register(r'schedules', HomeVisitScheduleViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
