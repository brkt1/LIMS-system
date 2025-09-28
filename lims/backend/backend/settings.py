"""
Django settings for backend project.
"""

from pathlib import Path

# ------------------------
# BASE DIR
# ------------------------
BASE_DIR = Path(__file__).resolve().parent.parent

# ------------------------
# SECURITY
# ------------------------
SECRET_KEY = 'django-insecure-_*vnj)lo)((lm$2+i$+ms*gyeu8f8$40$wyeq1_+328&fbx@z$'
DEBUG = True
ALLOWED_HOSTS = [ 
    '127.0.0.1',
    'localhost',
    '10.0.2.2',         # Android emulator
    '192.168.1.100',    # Replace with your PC LAN IP
    '192.168.0.2',      # your LAN IP
]

# ------------------------
# INSTALLED APPS
# ------------------------
INSTALLED_APPS = [
    # Django default
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',

    # Third-party
    'rest_framework',
    'corsheaders',
    'django_filters',

    # Local apps
    'lab',

    # Technician
    'lab.components.Technician',
    'lab.components.Technician.Sample',

    # Doctor
    'lab.components.Doctor.NewTestRequest',
    'lab.components.Doctor.DocterAppointment',

    # Patient
    'lab.components.PatientPortal.PatientAppointment',

    # TenantAdmin
    'lab.components.tenantadmin.CurrentTenant',
    'lab.components.tenantadmin.HomeVisitRequests',
    'lab.components.tenantadmin.TenantAdminProfile',
    'lab.components.tenantadmin.ManageUsers',
    'lab.components.tenantadmin.DoctorManagement',
    'lab.components.tenantadmin.EquipmentManagement',
    'lab.components.tenantadmin.TestPricing',
    'lab.components.tenantadmin.CulturesAntibiotics',
    
    # Patient
    'lab.components.Patient',

    # Superadmin
    'lab.components.superadmin',

    # TenantAccessAuth (Login system)
    #'lab.components.TenantAccessAuth.Login',  # This is the app label we will use
     'lab.components.TenantAccessAuth.Login.apps.LoginConfig',  # <-- use this
    
    # NEW APPS - Support System
    'lab.components.Support',
    'lab.components.Support.SupportTicket',
    
    # NEW APPS - Equipment Management
    'lab.components.Technician.Equipment',
    
    # NEW APPS - Inventory Management
    'lab.components.Inventory',
    
    # NEW APPS - Analytics & Reporting
    'lab.components.Analytics',
    
    # NEW APPS - Notifications
    'lab.components.Notifications',
    
    # NEW APPS - File Management
    'lab.components.FileManagement',
    
    # NEW APPS - FAQ System
    'lab.components.FAQ',
    
    # NEW APPS - Profile Management
    'lab.components.Profile',
    
    # NEW APPS - Receipts/Billing
    'lab.components.Receipts',
    
    # NEW APPS - Home Visit Management
    'lab.components.HomeVisit',
    
    # NEW APPS - Branch Management
    'lab.components.BranchManagement',
    
    # NEW APPS - Contract Management
    'lab.components.ContractManagement',
    
    # NEW APPS - Accounting
    'lab.components.Accounting',
]

# ------------------------
# MIDDLEWARE
# ------------------------
MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',  # must be first for CORS
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

# ------------------------
# URLS & TEMPLATES
# ------------------------
ROOT_URLCONF = 'backend.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'backend.wsgi.application'

# ------------------------
# DATABASE
# ------------------------
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db.sqlite3',
    }
}

# ------------------------
# AUTH PASSWORD VALIDATORS
# ------------------------
AUTH_PASSWORD_VALIDATORS = [
    {'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator'},
    {'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator'},
    {'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator'},
    {'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator'},
]

# ------------------------
# INTERNATIONALIZATION
# ------------------------
LANGUAGE_CODE = 'en-us'
TIME_ZONE = 'UTC'
USE_I18N = True
USE_TZ = True

# ------------------------
# STATIC FILES
# ------------------------
STATIC_URL = '/static/'
STATICFILES_DIRS = [BASE_DIR / "static"]

# ------------------------
# MEDIA FILES
# ------------------------
MEDIA_URL = '/media/'
MEDIA_ROOT = BASE_DIR / 'media'

# ------------------------
# DEFAULT PK FIELD TYPE
# ------------------------
DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

# ------------------------
# CORS
# ------------------------
CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",   # React dev server
    "http://localhost:3001",   # React dev server (alternative port)
    "http://127.0.0.1:3000",
    "http://127.0.0.1:3001",
    "http://localhost:5173",   # Vite dev server
    "http://127.0.0.1:5173",
    "http://localhost:8000",   # Django default
    "http://127.0.0.1:8000",
    "http://10.0.2.2:8000",
    "http://192.168.1.100:8000",
]

# Additional CORS settings for development
CORS_ALLOW_CREDENTIALS = True
CORS_ALLOW_ALL_ORIGINS = DEBUG  # Allow all origins in debug mode
CORS_ALLOWED_HEADERS = [
    'accept',
    'accept-encoding',
    'authorization',
    'content-type',
    'dnt',
    'origin',
    'user-agent',
    'x-csrftoken',
    'x-requested-with',
]
CORS_ALLOWED_METHODS = [
    'DELETE',
    'GET',
    'OPTIONS',
    'PATCH',
    'POST',
    'PUT',
]

# ------------------------
# REST FRAMEWORK
# ------------------------
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'rest_framework_simplejwt.authentication.JWTAuthentication',
        'rest_framework.authentication.SessionAuthentication',
    ],
    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.AllowAny',
    ],
}

# ------------------------
# AUTHENTICATION
# ------------------------
AUTH_USER_MODEL = 'tenantaccess_login.User'

  # <-- Fixed: use app label + model name

AUTHENTICATION_BACKENDS = [
    'django.contrib.auth.backends.ModelBackend',  # keep default
    'lab.components.TenantAccessAuth.backends.EmailBackend',  # custom email backend
]

