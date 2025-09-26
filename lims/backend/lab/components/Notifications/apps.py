from django.apps import AppConfig


class NotificationsConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'lab.components.Notifications'
    label = 'notifications'
    
    def ready(self):
        import lab.components.Notifications.notification_signals