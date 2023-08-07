from django.shortcuts import render
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from django.core.mail import EmailMessage
from .models import User
from .serializers import UserSerializer
from rest_framework import generics, mixins
import datetime
import jwt

def index(request):
    return render(request, "index.html")

class UserView(APIView):
    def post(self, request):
        token = request.data.get("token")

        if not token:
            return Response({'error': 'Unauthenticated'}, status=status.HTTP_401_UNAUTHORIZED)
        
        try:
            payload = jwt.decode(token, "secret", algorithms=["HS256"])
        except jwt.ExpiredSignatureError:
            return Response({'error': 'Unauthenticated'}, status=status.HTTP_401_UNAUTHORIZED)
        
        user = User.objects.filter(id=payload["id"]).first()
        if not user:
            return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)
        
        serializer = UserSerializer(user)
        return Response(serializer.data)

class UserUpdatePasswordView(APIView):
    def post(self, request):
        email = request.data["email"]
        new_password = request.data["new_password"]

        user = User.objects.filter(email=email).first()

        if user is None:
            return Response({"error":"User Not Found"}, status=status.HTTP_400_BAD_REQUEST)
        
        user.set_password(new_password)
        user.save()

        serializer = UserSerializer(user)
        return Response({"new_password":new_password,
                         "data": serializer.data}, status=status.HTTP_200_OK)
    
class EmailSend(APIView):
    def post(self, request):
        email = request.data["email"]
        token = request.data["token"]

        user = User.objects.filter(email=email).first()

        if user is None:
            return Response({"error":"User Not Found"}, status=status.HTTP_404_NOT_FOUND)

        mail_subject = "Hesap Aktivasyonu"
        message = f"http://127.0.0.1:3000/resetpasswd/{token}"
        email = EmailMessage(mail_subject, message, to=[email])
        email.content_subtype = "html"
        email.send()

        return Response({"message":"Basariyla Gonderildi"}, status=status.HTTP_200_OK)

class UserConfContentView(APIView):
    def delete_content(self, request, method):
        email = request.data["email"]
        user = User.objects.filter(email=email).first()

        if user is None:
            return Response({"error": "User Not Found"}, status=status.HTTP_400_BAD_REQUEST)
        
        user.content = ""
        user.save()

        serialzier = UserSerializer(user)

        return Response({"data" : serialzier.data,
                "content" : user.content}, status=status.HTTP_200_OK)

    def add_content(self, request, method):
        email = request.data["email"]
        content = request.data["content"]

        user = User.objects.filter(email=email).first()

        if user is None:
            return Response({"error": "User Not Found"}, status=status.HTTP_400_BAD_REQUEST)
        
        user.content += content
        user.save()

        serialzier = UserSerializer(user)

        return Response({"data" : serialzier.data,
                "content" : user.content}, status=status.HTTP_200_OK)

    def update_user_content(self, request, method):
        email = request.data["email"]
        content = request.data["content"]

        user = User.objects.filter(email=email).first()

        if user is None:
            return Response({"error": "User Not Found"}, status=status.HTTP_400_BAD_REQUEST)

        user.content = content
        user.save()

        serializer = UserSerializer(user)
        return Response({"data": serializer.data, "content": content}, status=status.HTTP_201_CREATED)

    def put(self, request):
        return self.add_content(request, method="PUT")
    
    def post(self, request):
        return self.update_user_content(request, method="POST")
    
    def delete(self, request):
        return self.delete_content(request, method="DELETE")

class UserRegisterView(generics.GenericAPIView, mixins.CreateModelMixin):
    serializer_class = UserSerializer
    queryset = User.objects.all()
    def post(self, request):
        serializer = UserSerializer(data=request.data)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class UserListView(generics.GenericAPIView, mixins.ListModelMixin):
    serializer_class = UserSerializer
    queryset = User.objects.all()
    def get(self, request):
        return self.list(request)
    
class UserDeleteView(APIView):
    def post(self, request):
        email = request.data["email"]
        user = User.objects.filter(email=email).first()

        if user is None:
            return Response({"error":"User Not Found"}, status=status.HTTP_404_NOT_FOUND)

        user.delete()
        return Response({"message":"Kullanici basari ile kaldirildi"}, status=status.HTTP_200_OK)
    
class UserLoginView(APIView):
    def post(self, request):
        email = request.data["email"]
        password = request.data["password"]

        user = User.objects.filter(email=email).first()

        if user is None:
            return Response({"error":"User Not Found"}, status=status.HTTP_404_NOT_FOUND)
        
        if not user.check_password(password):
            return Response({"error":"User Password incorrect"}, status=status.HTTP_404_NOT_FOUND)
        
        payload = {
            "id": user.id,
            "exp": datetime.datetime.utcnow() + datetime.timedelta(minutes=60),
            "iat": datetime.datetime.utcnow()
        }

        token = jwt.encode(payload, "secret", algorithm="HS256")
        user.token = token
        user.save()

        serializer = UserSerializer(user)

        response = Response()
        response.set_cookie(key="jwt", value=token, httponly=True)
        response.data = {
            "token": token,
            "data" : serializer.data
        }
        return response