from django.urls import path
from .equipment_views import EquipmentListCreateView, EquipmentRetrieveUpdateDestroyView

urlpatterns = [
    path("", EquipmentListCreateView.as_view(), name="equipment-list"),
    path("<int:pk>/", EquipmentRetrieveUpdateDestroyView.as_view(), name="equipment-detail"),
]