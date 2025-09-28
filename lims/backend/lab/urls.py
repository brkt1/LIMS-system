from django.contrib import admin
from django.urls import path, include
from lab.components.TenantAccessAuth.Login.login_views import TenantUserListCreateView

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', include('lab.components.TenantAccessAuth.Login.login_urls')),
    
    # Doctor endpoints
    path('api/test-requests/', include('lab.components.Doctor.NewTestRequest.NewTestRequest_urls')),
    path("api/", include("lab.components.Doctor.DocterAppointment.DocterAppointment_urls")),
    
    # Tenant Admin endpoints
    path('', include('lab.components.tenantadmin.ManageUsers.manage_users_urls')),
    path('api/equipment/', include('lab.components.tenantadmin.EquipmentManagement.equipment_urls')),
    
    # Super Admin endpoints
    path('api/superadmin/', include('lab.components.superadmin.CreateTenant.create_tenant_urls')),
    
    # Technician endpoints - Samples
    path('api/samples/', include('lab.components.Technician.Sample.sample_urls')),
    path('api/accept/', include('lab.components.Technician.Sample.accept_urls')),
    
    # Technician endpoints - Test Reports
    path('api/test-reports/', include('lab.components.Technician.TestReport.test_report_urls')),
    
    # Technician endpoints - Equipment (more specific paths to avoid conflicts)
    path('api/technician/equipment/', include('lab.components.Technician.Equipment.equipment_urls')),
    
    # Accounting endpoints
    path('api/accounting/', include('lab.components.Accounting.accounting_urls')),
]
