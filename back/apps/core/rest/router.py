from .views import UserViewSet, SettingsViewSet, MeViewSet, ConnectionJWTViewSet, SubscriptionJWTViewSet


def core(router):
    router.register(r'connection-jwt'   , ConnectionJWTViewSet      , basename="connection-jwt")
    router.register(r'subscription-jwt' , SubscriptionJWTViewSet    , basename="subscription-jwt")
    router.register(r'me'               , MeViewSet                 , basename="me")
    router.register(r'settings'         , SettingsViewSet           , basename="settings")
    router.register(r'user'             , UserViewSet               )
