"""
URL configuration for backend project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
# ✅ Import your tenant user view
from lab.components.tenantadmin.ManageUsers.manage_users_views import TenantUserListCreateView

urlpatterns = [
    # Django Admin
    path('admin/', admin.site.urls),
    # Authentication
    path('', include('lab.components.TenantAccessAuth.Login.login_urls')),
    
    # Doctor endpoints
    path('api/test-requests/', include('lab.components.Doctor.NewTestRequest.NewTestRequest_urls')),
    path('api/doctor-appointments/', include('lab.components.Doctor.DocterAppointment.DocterAppointment_urls')),
    path('api/appointments/', include('lab.components.Doctor.DocterAppointment.appointment_urls')),
    path('api/patients/', include('lab.components.Doctor.PatientManagement.patient_urls')),
    path('api/messages/', include('lab.components.Doctor.MessageSystem.message_urls')),
    
    # Patient Portal endpoints
    path('api/patient-appointments/', include('lab.components.PatientPortal.PatientAppointment.PatientAppointment_urls')),
    
    # Technician endpoints
    path('api/samples/', include('lab.components.Technician.Sample.sample_urls')),
    path('api/accept/', include('lab.components.Technician.Sample.accept_urls')),
    path('api/test-reports/', include('lab.components.Technician.TestReport.test_reports_urls')),
    path('api/equipment/', include('lab.components.Technician.Equipment.equipment_urls')),
    
    # Tenant Admin endpoints
    path('', include('lab.components.tenantadmin.CurrentTenant.current_tenant_urls')),
    path('api/tenantadmin/profiles/', include('lab.components.tenantadmin.TenantAdminProfile.tenantadmin_profile_urls')),
    path('api/tenant/users/', TenantUserListCreateView.as_view(), name='tenant-users'),
    path('api/home-visit-patients/', include('lab.components.tenantadmin.HomeVisitRequests.approved_patient_urls')),
    path('api/home-visit-doctors/', include('lab.components.tenantadmin.HomeVisitRequests.approved_doctor_urls')),
    
    # Super Admin endpoints
    path('api/superadmin/', include('lab.components.superadmin.CreateTenant.create_tenant_urls')),
    
    # Support System
    path('api/support/', include('lab.components.Support.SupportTicket.support_ticket_urls')),
    
    # Inventory Management
    path('api/inventory/', include('lab.components.Inventory.inventory_urls')),
    
    # Analytics & Reporting
    path('api/analytics/', include('lab.components.Analytics.analytics_urls')),
    
    # Notifications
    path('api/notifications/', include('lab.components.Notifications.notification_urls')),
    
    # File Management
    path('api/files/', include('lab.components.FileManagement.file_urls')),
    
    # FAQ System
    path('api/faq/', include('lab.components.FAQ.faq_urls')),
    
    # Profile Management
    path('api/profile/', include('lab.components.Profile.profile_urls')),
]



if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)