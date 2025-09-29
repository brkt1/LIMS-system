from django.urls import path
from .doctor_views import DoctorListCreateView, DoctorRetrieveUpdateDestroyView
from .specialties_views import list_specialties, specialty_stats

urlpatterns = [
    path("api/doctors/specialties/stats/", specialty_stats, name="doctor-specialty-stats"),
    path("api/doctors/specialties/", list_specialties, name="doctor-specialties"),
    path("api/doctors/<str:id>/", DoctorRetrieveUpdateDestroyView.as_view(), name="doctor-detail"),
    path("api/doctors/", DoctorListCreateView.as_view(), name="doctor-list"),
]