from django.urls import path
from .cultures_views import CultureListCreateView, CultureRetrieveUpdateDestroyView, AntibioticSensitivityListCreateView

urlpatterns = [
    path("api/cultures/", CultureListCreateView.as_view(), name="culture-list"),
    path("api/cultures/<int:pk>/", CultureRetrieveUpdateDestroyView.as_view(), name="culture-detail"),
    path("api/antibiotic-sensitivity/", AntibioticSensitivityListCreateView.as_view(), name="antibiotic-sensitivity-list"),
]