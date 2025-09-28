from django.urls import path
from .branch_views import BranchListCreateView, BranchRetrieveUpdateDestroyView

urlpatterns = [
    path("branches/", BranchListCreateView.as_view(), name="branches"),
    path("branches/<str:id>/", BranchRetrieveUpdateDestroyView.as_view(), name="branch-detail"),
]
