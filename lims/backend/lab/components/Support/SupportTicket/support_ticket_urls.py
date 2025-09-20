from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .support_ticket_views import SupportTicketViewSet, SupportMessageViewSet

router = DefaultRouter()
router.register(r'tickets', SupportTicketViewSet)
router.register(r'messages', SupportMessageViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
