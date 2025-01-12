import os, sys

# Build paths inside the project like this: os.path.join(BASE_DIR, ...)
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

SITE_ID = 1
# env.DOMAIN = localhost or domain.com
ALLOWED_HOSTS           = [f".{os.environ['DOMAIN']}", ]
SESSION_COOKIE_DOMAIN   =  f".{os.environ['DOMAIN']}"
CSRF_COOKIE_DOMAIN      =  f".{os.environ['DOMAIN']}"
CSRF_TRUSTED_ORIGINS    = [
    f"http://{os.environ['DOMAIN']}",
    f"https://{os.environ['DOMAIN']}",
    f"http://*.{os.environ['DOMAIN']}",
    f"https://*.{os.environ['DOMAIN']}"
]
CORS_ALLOW_CREDENTIALS  = True
CORS_ALLOW_ALL_ORIGINS  = True

INTERNAL_IPS        = os.getenv('INTERNAL_IPS'          , '127.0.0.1,localhost').split(',')

SECRET_KEY          = os.environ['SECRET_KEY']

DEFAULT_AUTO_FIELD  = 'django.db.models.AutoField'

WSGI_APPLICATION = 'main.wsgi.application'

LANGUAGE_CODE   = 'en-us'
USE_TZ          = True
TIME_ZONE       = 'UTC'

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'django.contrib.sites',
    # external apps
    "corsheaders",
    'django_extensions',
    'rest_framework',
    'allauth',
    'allauth.account',
    'allauth.socialaccount',
    # 'allath.socialaccount.providers.openid_connect',
    # internal apps
    'apps.core'
]


MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
    'allauth.account.middleware.AccountMiddleware',
]

ROOT_URLCONF = 'main.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [
            os.path.join(BASE_DIR, 'templates'),
        ],
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


REST_FRAMEWORK = {
    'DEFAULT_PARSER_CLASSES': (
        'rest_framework.parsers.JSONParser',
        'rest_framework.parsers.MultiPartParser',
        'rest_framework.parsers.FileUploadParser',
    ),

    'DEFAULT_AUTHENTICATION_CLASSES': (
        # 'rest_framework_simplejwt.authentication.JWTAuthentication',
        'rest_framework.authentication.SessionAuthentication',
        # 'rest_framework.authtoken.models.Token'
    ),
    'DEFAULT_PERMISSION_CLASSES': (
        'rest_framework.permissions.IsAuthenticated',
    ),
    'DEFAULT_FILTER_BACKENDS'   : (
        'apps.core.filters.FilterBackend',
    ),
}

DATABASES = {
    'default': {
        'ENGINE'    :     os.getenv('DB_ENGINE'     , 'django.db.backends.postgresql'),
        'HOST'      :     os.getenv('DB_HOST'       , 'db'),
        'PORT'      : int(os.getenv('DB_PORT'       , '5432')),
        'NAME'      :     os.getenv('DB_NAME'       , 'main'),
        'USER'      :     os.getenv('DB_USER'       , 'admin'),
        'PASSWORD'  :     os.getenv('DB_PASSWORD'   , '123456'),
    }
}

STATIC_URL = '/back-static/'
STATIC_ROOT = os.path.join(BASE_DIR, 'static')  # collectstatic will put files here
STORAGES = {
    "default"       : { "BACKEND": "storages.backends.s3.S3Storage" },
    "staticfiles"   : { "BACKEND": "django.contrib.staticfiles.storage.StaticFilesStorage" },
}

# DEBUG
DEBUG = os.getenv('DEBUG') == 'true'


# AUTH
LOGIN_URL = '/auth/login/'
LOGIN_REDIRECT_URL = f"http://{os.environ['DOMAIN']}"
AUTH_PASSWORD_VALIDATORS = [] if DEBUG else [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
        'OPTIONS': {
            'min_length': 6,
        }
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
    {
        'NAME': 'django_password_validators.password_character_requirements.password_validation.PasswordCharacterValidator',
        'OPTIONS': {
             'min_length_digit': 1,
             'min_length_lower': 1,
             'min_length_upper': 1,
         }
    },
]

AUTHENTICATION_BACKENDS = [
    'allauth.account.auth_backends.AuthenticationBackend',
]

# EMAIL
EMAIL_BACKEND       =     os.getenv('EMAIL_BACKEND', 'django.core.mail.backends.dummy.EmailBackend')
EMAIL_HOST          =     os.getenv('EMAIL_HOST')
EMAIL_PORT          = int(os.getenv('EMAIL_PORT', '587'))
EMAIL_USE_TLS       =     os.getenv('EMAIL_USE_TLS') == 'True'
EMAIL_HOST_USER     =     os.getenv('EMAIL_HOST_USER')
EMAIL_HOST_PASSWORD =     os.getenv('EMAIL_HOST_PASSWORD')
# Default email address to use for various automated correspondence from the site manager(s).
# This doesn’t include error messages sent to ADMINS and MANAGERS;
# for that, see SERVER_EMAIL.
DEFAULT_FROM_EMAIL      = os.getenv('DEFAULT_FROM_EMAIL')
# DEFAULT_REPLY_TO_EMAIL  = list(filter(None, os.environ.get('DEFAULT_REPLY_TO_EMAIL', '').split(' ')))
DEFAULT_REPLY_TO_EMAIL  = os.getenv('DEFAULT_REPLY_TO_EMAIL')
# The email address that error messages come from, such as those sent to ADMINS and MANAGERS.
SERVER_EMAIL        = os.getenv('SERVER_EMAIL')
# A list of all the people who get code error notifications (when DEBUG=False)
ADMINS              = [tuple(i.split('=')) for i in os.getenv('ADMINS', '').split(' ')]
# A list in the same format as ADMINS that specifies who should get broken link notifications
# when BrokenLinkEmailsMiddleware is enabled.
MANAGERS            = [tuple(i.split('=')) for i in os.getenv('MANAGERS', '').split(' ')]

REST_FLEX_FIELDS = {
    'EXPAND_PARAM'  : '__relations',
    'FIELDS_PARAM'  : '__fields',
    'OMIT_PARAM'    : '__omit',
}


LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'handlers': {
        'console': {
            'class': 'logging.StreamHandler',
            'stream': sys.stdout,
        },
    },
    'loggers': {
        'main': {
            'handlers': ['console'],
            'level': os.getenv('LOGGER_MAIN_LEVEL', 'WARNING'),
        },
    },
}
