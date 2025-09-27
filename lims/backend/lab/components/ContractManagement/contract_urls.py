from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .contract_views import ContractViewSet, ContractRenewalViewSet

router = DefaultRouter()
router.register(r'contracts', ContractViewSet)
router.register(r'renewals', ContractRenewalViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
