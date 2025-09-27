from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    TenantViewSet, BillingPlanViewSet, BillingTransactionViewSet,
    UsageMetricsViewSet, SystemLogViewSet, SystemHealthViewSet,
    TenantListCreateView
)

# Create router for ViewSets
router = DefaultRouter()
router.register(r'tenants', TenantViewSet)
router.register(r'plans', BillingPlanViewSet)
router.register(r'transactions', BillingTransactionViewSet)
router.register(r'usage', UsageMetricsViewSet)
router.register(r'logs', SystemLogViewSet)
router.register(r'health', SystemHealthViewSet)

urlpatterns = [
    # Include router URLs
    path('', include(router.urls)),
    
    # Legacy endpoint for backward compatibility
    path('tenants/', TenantListCreateView.as_view(), name='tenant-list-create'),
]
