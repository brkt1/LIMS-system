from django.urls import path
from .equipment_views import EquipmentListCreateView, EquipmentRetrieveUpdateDestroyView

urlpatterns = [
    path("api/equipment/", EquipmentListCreateView.as_view(), name="equipment-list"),
    path("api/equipment/<int:pk>/", EquipmentRetrieveUpdateDestroyView.as_view(), name="equipment-detail"),
]