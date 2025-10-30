"""
URL configuration for backend project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import include, path
from api.views import CreateUserView, CustomTokenObtainPairView, CustomTokenRefreshView, DeckViewSet, LogoutView, passwordForgotRequest, passwordResetRequest, NoteViewSet
from rest_framework_simplejwt.views import  TokenRefreshView, TokenVerifyView
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register(r'decks', DeckViewSet, 'decks')
router.register(r'notes', NoteViewSet, 'notes')

urlpatterns = [
    path('admin/', admin.site.urls),
    path("api/user/register/", CreateUserView.as_view(), name="signup"),
    path("api/user/logout/", LogoutView.as_view(), name="logout"),
    path("api/user/forgot-password/", passwordForgotRequest, name="forgot-password"),
    path("api/user/reset-password/", passwordResetRequest, name="reset-password"),
    path('api/token/', CustomTokenObtainPairView.as_view(), name='getToken'),
    path('api/token/refresh/', CustomTokenRefreshView.as_view(), name='refreshToken'),
    path('api/token/verify/', TokenVerifyView.as_view(), name='token_verify'),
    path('api/', include(router.urls)),
]
