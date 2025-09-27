from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .branch_views import BranchViewSet, BranchStaffViewSet

router = DefaultRouter()
router.register(r'branches', BranchViewSet)
router.register(r'staff', BranchStaffViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
