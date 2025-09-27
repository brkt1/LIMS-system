from django.apps import AppConfig


class SuperadminConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'lab.components.superadmin'
    verbose_name = 'SuperAdmin Management'
