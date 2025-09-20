from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .inventory_views import (
    InventoryCategoryViewSet, SupplierViewSet, InventoryItemViewSet, 
    InventoryTransactionViewSet, ReorderRequestViewSet
)

router = DefaultRouter()
router.register(r'categories', InventoryCategoryViewSet)
router.register(r'suppliers', SupplierViewSet)
router.register(r'items', InventoryItemViewSet)
router.register(r'transactions', InventoryTransactionViewSet)
router.register(r'reorders', ReorderRequestViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
