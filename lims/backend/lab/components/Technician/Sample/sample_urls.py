from django.urls import path
from .sample_views import SampleList, SampleDetail, SampleUpdateStatus, PendingTestRequestsList

app_name = "sample"

urlpatterns = [
    path("", SampleList.as_view(), name="list"),
    path("pending-test-requests/", PendingTestRequestsList.as_view(), name="pending-test-requests"),
    path("<str:pk>/", SampleDetail.as_view(), name="detail"),
    path("<str:pk>/update_status/", SampleUpdateStatus.as_view(), name="update_status"),
]
