from django.contrib import admin
from django.contrib.auth import get_user_model
from .models import CustomUser, Deck, Flashcard, Note
from django.contrib.auth.admin import UserAdmin

class CustomUserAdmin(UserAdmin):
    model = CustomUser
    list_display = ("id", "email", "username", "is_staff", "is_active")
    list_filter = ("is_staff", "is_active")
    fieldsets = (
        (None, {"fields": ("email", "username", "password", "password_changed_date")}),
        ("Permissions", {"fields": ("is_staff", "is_active", "groups", "user_permissions")}),
    )
    add_fieldsets = (
        (None, {
            "classes": ("wide",),
            "fields": ("email", "username", "password1", "password2", "is_staff", "is_active"),
        }),
    )
    search_fields = ("email", "username")
    ordering = ("email",)

admin.site.register(CustomUser, CustomUserAdmin)

@admin.register(Note)
class NoteAdmin(admin.ModelAdmin):
    list_display = ('id', 'note_title', 'author')

@admin.register(Deck)
class DeckAdmin(admin.ModelAdmin):
    list_display = ('id', 'title')   # 👈 show ID and title in list view
admin.site.register(Flashcard)

