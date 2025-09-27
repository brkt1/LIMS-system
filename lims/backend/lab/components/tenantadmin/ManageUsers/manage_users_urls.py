from django.urls import path
from .manage_users_views import TenantUserListCreateView, TenantUserRetrieveUpdateDestroyView

urlpatterns = [
    path("api/tenant/users/", TenantUserListCreateView.as_view(), name="tenant-users"),
    path("api/tenant/users/<str:id>/", TenantUserRetrieveUpdateDestroyView.as_view(), name="tenant-user-detail"),
]
