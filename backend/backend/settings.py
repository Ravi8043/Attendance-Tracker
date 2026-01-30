import os
from pathlib import Path
from dotenv import load_dotenv
import dj_database_url

BASE_DIR = Path(__file__).resolve().parent.parent

# Load .env file
load_dotenv(os.path.join(BASE_DIR, '.env'))

# Database
DATABASES = {
    "default": dj_database_url.config(
        default=os.environ.get("DATABASE_URL"),
        conn_max_age=600,
        conn_health_checks=True,
        ssl_require=True
    )
}

# Security & Debug
SECRET_KEY = os.environ.get("SECRET_KEY", "django-insecure-local-dev-key-only")
DEBUG = os.environ.get("DEBUG", "False").lower() == "true"
if os.environ.get('RENDER'):
    ALLOWED_HOSTS = [
        "attendance-tracker-2-87hz.onrender.com",
        ".onrender.com",
        "attendancetracker-bay.vercel.app",
    ]
else:
    ALLOWED_HOSTS = ['localhost', '127.0.0.1']


# ------------------ INSTALLED APPS ------------------
INSTALLED_APPS = [
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",

    "rest_framework",
    "corsheaders",
    "rest_framework_simplejwt.token_blacklist",

    # your apps
    "attendance",
    "subjects",
    "timetable",
    "accounts",
]

# ------------------ MIDDLEWARE ------------------
MIDDLEWARE = [
    "corsheaders.middleware.CorsMiddleware",  # MUST be first
    "django.middleware.security.SecurityMiddleware",
    "whitenoise.middleware.WhiteNoiseMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.common.CommonMiddleware",  # after sessions
    "django.middleware.csrf.CsrfViewMiddleware",
    "backend.middleware.DisableCSRFForAPI",  # Custom middleware to disable CSRF for /api/
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
]

# ------------------ CORS CONFIG ------------------
CORS_ALLOWED_ORIGINS = [
    "https://attendancetracker-bay.vercel.app",
]
CORS_ALLOW_CREDENTIALS = True
CORS_ALLOW_HEADERS = [
    "accept",
    "accept-encoding",
    "authorization",
    "content-type",
    "dnt",
    "origin",
    "user-agent",
    "x-csrftoken",
    "x-requested-with",
]

# Trust frontend for CSRF
CSRF_TRUSTED_ORIGINS = [
    "https://attendancetracker-bay.vercel.app"
]

# ------------------ REST FRAMEWORK ------------------
REST_FRAMEWORK = {
    "DEFAULT_AUTHENTICATION_CLASSES": [
        "rest_framework_simplejwt.authentication.JWTAuthentication",
    ],
    "DEFAULT_PERMISSION_CLASSES": [
        "rest_framework.permissions.IsAuthenticated",
    ],
}

# ------------------ AUTH ------------------
AUTH_USER_MODEL = "accounts.CustomUser"

# ------------------ URLS & TEMPLATES ------------------
ROOT_URLCONF = "backend.urls"

TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
            ],
        },
    },
]

WSGI_APPLICATION = "backend.wsgi.application"

# ------------------ PASSWORD VALIDATION ------------------
AUTH_PASSWORD_VALIDATORS = [
    {"NAME": "django.contrib.auth.password_validation.UserAttributeSimilarityValidator"},
    {"NAME": "django.contrib.auth.password_validation.MinimumLengthValidator"},
    {"NAME": "django.contrib.auth.password_validation.CommonPasswordValidator"},
    {"NAME": "django.contrib.auth.password_validation.NumericPasswordValidator"},
]

# ------------------ INTERNATIONALIZATION ------------------
LANGUAGE_CODE = "en-us"
TIME_ZONE = "UTC"
USE_I18N = True
USE_TZ = True

# ------------------ STATIC FILES ------------------
STATIC_URL = "/static/"
STATIC_ROOT = BASE_DIR / "staticfiles"
STATICFILES_STORAGE = "whitenoise.storage.CompressedManifestStaticFilesStorage"

DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"

# Add at the bottom of settings.py
LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'handlers': {
        'console': {
            'class': 'logging.StreamHandler',
        },
    },
    'root': {
        'handlers': ['console'],
        'level': 'INFO',
    },
    'loggers': {
        'django': {
            'handlers': ['console'],
            'level': 'INFO',
            'propagate': False,
        },
    },
}