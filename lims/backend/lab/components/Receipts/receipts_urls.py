from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .receipts_views import ReceiptViewSet, BillingTransactionViewSet

router = DefaultRouter()
router.register(r'receipts', ReceiptViewSet)
router.register(r'transactions', BillingTransactionViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
