from django.contrib import admin
from django.conf import settings
from django.conf.urls.static import static
from django.http import JsonResponse
from django.urls import path, include
from rest_framework import routers
from apps.employee.rest.router import employee

router = routers.DefaultRouter(trailing_slash=True)
employee(router)

urlpatterns = [
    path('healthcheck'          , lambda request: JsonResponse({'status': 'OK'}), name='healthcheck'),
    path('auth/'                , include('allauth.urls')),
    path('api/'                 , include(router.urls)),
    path('admin/'               , admin.site.urls),

] + static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
