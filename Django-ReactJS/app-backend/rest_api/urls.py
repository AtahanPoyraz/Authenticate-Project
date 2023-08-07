from .views import *
from django.urls import path

urlpatterns = [
    path("register/", UserRegisterView.as_view(), name="register"),
    path("list/", UserListView.as_view(), name="list"),
    path("delete/", UserDeleteView.as_view(), name="delete"),
    path("login/", UserLoginView.as_view(), name="login"),
    path("content/", UserConfContentView.as_view(), name="content"),
    path("resetpass/", UserUpdatePasswordView.as_view(), name="reset"),
    path("sendmail/", EmailSend.as_view(), name="email"),
    path("user/", UserView.as_view(), name="user")

]