from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .accounting_views import AccountingEntryViewSet, FinancialReportViewSet

router = DefaultRouter()
router.register(r'entries', AccountingEntryViewSet)
router.register(r'reports', FinancialReportViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
