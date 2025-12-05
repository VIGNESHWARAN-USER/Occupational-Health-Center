"""
Django settings for sampleProject project.
"""

import os
from pathlib import Path



# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent

# Correctly configure MEDIA_ROOT and MEDIA_URL
MEDIA_ROOT = os.path.join(BASE_DIR, 'media')
MEDIA_URL = '/media/'

# Static files (CSS, JavaScript, Images)
STATIC_URL = '/static/'
STATIC_ROOT = os.path.join(BASE_DIR, 'staticfiles')  # Add this line

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = 'django-insecure-2an=+9=g@e!k!x@al6ve@@g@fuxv&vgv%evj%6jv^l6421xojc'

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = True

ALLOWED_HOSTS = [
    '*',
    'occupational-health-center-1.onrender.com',
    'localhost',
    '127.0.0.1'
    'ohc.jsw.in'
]

# CORS settings - allow all origins for development
# Be SURE to restrict this in a production environment
CORS_ALLOW_ALL_ORIGINS = True
CORS_ALLOW_METHODS = [
    "GET",
    "POST",
    "PUT",
    "PATCH",
    "DELETE",
    "OPTIONS",
]

EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'
EMAIL_HOST = 'smtp.office365.com'
EMAIL_PORT = 587
EMAIL_USE_SSL = False
EMAIL_HOST_USER = 'jsw.salem@jsw.in'          # Your Gmail
EMAIL_HOST_PASSWORD = 'pgtrkschxwqmfgtd'        # App Password, not your actual Gmail password
DEFAULT_FROM_EMAIL = EMAIL_HOST_USER
# Application definition
INSTALLED_APPS = [
    'corsheaders',
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',  # Required for serving static files
    'jsw',
    'sslserver',
    'django_extensions'
]

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',  # Place as high as possible
    'django.middleware.common.CommonMiddleware', # required for static files serving
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
    'jsw.middleware.SimpleMiddleware',
]

ROOT_URLCONF = 'sampleProject.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [BASE_DIR / "templates"],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'sampleProject.wsgi.application'




import pyodbc

print(pyodbc.drivers())

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql',
        'NAME': 'defaultdb',
        'USER': 'avnadmin',
        'PASSWORD': 'AVNS_fTKFcjzwiSA50liDciv',
        'HOST': "mysql-96df329-pramothrpro-9634.f.aivencloud.com",
        'PORT': '25197',
        'CONN_MAX_AGE':0
    }
}










# Password validation
AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]

# Internationalization
LANGUAGE_CODE = 'en-us'
TIME_ZONE = 'UTC'
USE_I18N = True
USE_TZ = True

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'