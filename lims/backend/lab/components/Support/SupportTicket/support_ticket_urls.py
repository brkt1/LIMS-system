from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .support_ticket_views import (
    SupportTicketViewSet, SupportMessageViewSet, SupportStaffViewSet,
    SupportTeamViewSet, SupportSLAViewSet, SupportAnalyticsViewSet
)

router = DefaultRouter()
router.register(r'tickets', SupportTicketViewSet)
router.register(r'messages', SupportMessageViewSet)
router.register(r'staff', SupportStaffViewSet)
router.register(r'teams', SupportTeamViewSet)
router.register(r'slas', SupportSLAViewSet)
router.register(r'analytics', SupportAnalyticsViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
