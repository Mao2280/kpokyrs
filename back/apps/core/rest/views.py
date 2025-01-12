import jwt
import os
import time
from django.conf import settings
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
from rest_framework.viewsets import ViewSet, ModelViewSet, ReadOnlyModelViewSet
from rest_framework.permissions import AllowAny
from rest_framework.decorators import action
from rest_framework.response import Response
from .serializers import User, UserSerializer


class CoreModelViewSet(ModelViewSet):
    @action(detail=False)
    def count(self, request):
        count = self.filter_queryset(self.get_queryset()).count()
        return Response(count)


class CoreReadOnlyModelViewSet(ReadOnlyModelViewSet):
    @action(detail=False)
    def count(self, request):
        count = self.filter_queryset(self.get_queryset()).count()
        return Response(count)


class UserViewSet(CoreModelViewSet):
    queryset         = User.objects.all()
    serializer_class = UserSerializer


class SettingsViewSet(ViewSet):
    permission_classes = [AllowAny]
    def list(self, request, format=None):
        _settings = {}
        _settings['DEBUG'] = settings.DEBUG
        _settings['RELEASE_VERSION'] = os.environ.get('RELEASE_VERSION')
        # _settings['DOMAIN'] = os.environ.get('DOMAIN')
        # _settings['ALLOWED_HOSTS'] = settings.ALLOWED_HOSTS
        # _settings['CSRF_TRUSTED_ORIGINS'] = settings.CSRF_TRUSTED_ORIGINS
        # _settings['SESSION_COOKIE_DOMAIN'] = settings.SESSION_COOKIE_DOMAIN
        # _settings['CSRF_COOKIE_DOMAIN'] = settings.CSRF_COOKIE_DOMAIN
        # _settings['SESSION_COOKIE_DOMAIN'] = settings.SESSION_COOKIE_DOMAIN
        return Response(_settings)


class MeViewSet(ViewSet):
    def list(self, request, format=None):
        me = {}
        if request.user.is_authenticated:
            me['user_id'] = request.user.id
            me['is_staff'] = request.user.is_staff
            # me['available_org_user_ids'] = OrgUser.objects.filter(user=request.user).values_list('id', flat=True) 
        else:
            me['user_id'] = None
        return Response(me)


class ConnectionJWTViewSet(ViewSet):
    def list(self, request, format=None):
        token_claims = {
            'sub': str(request.user.pk),
            'exp': int(time.time()) + 120,
        }
        token = jwt.encode(token_claims, settings.CENTRIFUGO_TOKEN_SECRET)
        return Response({'token': token})


class SubscriptionJWTViewSet(ViewSet):
    def list(self, request, format=None):
        channel = request.GET.get('channel')
        if not (
            (channel.startswith("admin") and request.user.is_staff) 
         or (channel.startswith("user")  and channel == f'user:{request.user.pk}')
         ):
            return Response({'detail': 'permission denied'}, status=403)

        token_claims = {
            'sub': str(request.user.pk),
            'exp': int(time.time()) + 120,
            'channel': channel,
        }
        token = jwt.encode(token_claims, settings.CENTRIFUGO_TOKEN_SECRET)
        return Response({'token': token})
