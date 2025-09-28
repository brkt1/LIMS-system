from django.urls import path
from .doctor_views import DoctorListCreateView, DoctorRetrieveUpdateDestroyView
from .specialties_views import DoctorSpecialtyViewSet

urlpatterns = [
    path("api/doctors/", DoctorListCreateView.as_view(), name="doctor-list"),
    path("api/doctors/<int:pk>/", DoctorRetrieveUpdateDestroyView.as_view(), name="doctor-detail"),
    path("api/doctors/specialties/", DoctorSpecialtyViewSet.as_view({'get': 'list_specialties'}), name="doctor-specialties"),
    path("api/doctors/specialties/stats/", DoctorSpecialtyViewSet.as_view({'get': 'specialty_stats'}), name="doctor-specialty-stats"),
]