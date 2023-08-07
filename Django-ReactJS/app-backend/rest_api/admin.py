from django.contrib import admin
from .models import User

@admin.register(User)
class UserManagement(admin.ModelAdmin):
    list_display = ["email", "name", "time_date"]
    list_display_links = ["email", "name", "time_date"]
    search_fields = ["email", "name", "time_date"]
    list_filter = ["name", "time_date"]
    

    class Meta:
        models = User
