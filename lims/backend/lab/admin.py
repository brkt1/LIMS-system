from django.contrib import admin
from django.contrib.auth import get_user_model
from django.utils.html import format_html

# Import all models
from .models import LabBaseModel

# Import component models that exist and work
from .components.FileManagement.file_models import FileUpload, FileShare
from .components.Support.SupportTicket.support_ticket_models import SupportTicket, SupportMessage
from .components.Technician.Equipment.equipment_models import Equipment, EquipmentCalibration, EquipmentMaintenance
from .components.Doctor.NewTestRequest.NewTestRequest_models import TestRequest
from .components.tenantadmin.ManageUsers.manage_users_model import TenantUser
from .components.superadmin.CreateTenant.create_tenant_model import Tenant

# Register Tenant model
@admin.register(Tenant)
class TenantAdmin(admin.ModelAdmin):
    list_display = ['company_name', 'email', 'is_active', 'created_at']
    list_filter = ['is_active', 'created_at']
    search_fields = ['company_name', 'email']
    ordering = ['-created_at']

# Register File Management models
@admin.register(FileUpload)
class FileUploadAdmin(admin.ModelAdmin):
    list_display = ['name', 'file_type', 'file_size', 'uploaded_by', 'tenant', 'is_public', 'download_count', 'created_at']
    list_filter = ['file_type', 'is_public', 'tenant', 'created_at']
    search_fields = ['name', 'description']
    readonly_fields = ['download_count', 'created_at', 'updated_at']

@admin.register(FileShare)
class FileShareAdmin(admin.ModelAdmin):
    list_display = ['file', 'shared_with', 'permission', 'expires_at', 'created_at']
    list_filter = ['permission', 'created_at']
    search_fields = ['file__name', 'shared_with__email']

# Register Support System models
@admin.register(SupportTicket)
class SupportTicketAdmin(admin.ModelAdmin):
    list_display = ['id', 'title', 'status', 'priority', 'created_by', 'assigned_to', 'created_at']
    list_filter = ['status', 'priority', 'created_at']
    search_fields = ['title', 'description']
    readonly_fields = ['created_at', 'updated_at']

@admin.register(SupportMessage)
class SupportMessageAdmin(admin.ModelAdmin):
    list_display = ['ticket', 'sender', 'is_internal', 'created_at']
    list_filter = ['is_internal', 'created_at']
    search_fields = ['content']

# Register Equipment models
@admin.register(Equipment)
class EquipmentAdmin(admin.ModelAdmin):
    list_display = ['name', 'model', 'serial_number', 'department', 'status', 'priority', 'location', 'created_at']
    list_filter = ['status', 'priority', 'department', 'tenant', 'created_at']
    search_fields = ['name', 'model', 'serial_number', 'location']
    readonly_fields = ['created_at', 'updated_at']

@admin.register(EquipmentCalibration)
class EquipmentCalibrationAdmin(admin.ModelAdmin):
    list_display = ['equipment', 'calibration_date', 'next_calibration_date', 'calibrated_by', 'certificate_number']
    list_filter = ['calibration_date']
    search_fields = ['equipment__name', 'calibrated_by', 'certificate_number']

@admin.register(EquipmentMaintenance)
class EquipmentMaintenanceAdmin(admin.ModelAdmin):
    list_display = ['equipment', 'maintenance_date', 'maintenance_type', 'performed_by', 'cost', 'created_at']
    list_filter = ['maintenance_type', 'maintenance_date', 'created_at']
    search_fields = ['equipment__name', 'performed_by', 'description']

# Register Test Request models
@admin.register(TestRequest)
class TestRequestAdmin(admin.ModelAdmin):
    list_display = ['id', 'patient_name', 'test_type', 'priority', 'date_requested', 'created_at']
    list_filter = ['priority', 'test_type', 'date_requested', 'created_at']
    search_fields = ['patient_name', 'test_type', 'notes']

# Register Tenant User model
@admin.register(TenantUser)
class TenantUserAdmin(admin.ModelAdmin):
    list_display = ['name', 'email', 'role', 'tenant', 'created_at']
    list_filter = ['role', 'tenant', 'created_at']
    search_fields = ['name', 'email']

# Customize admin site
admin.site.site_header = "LIMS Administration"
admin.site.site_title = "LIMS Admin"
admin.site.index_title = "Welcome to LIMS Administration"