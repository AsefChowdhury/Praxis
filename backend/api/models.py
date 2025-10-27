from django.db import models
from django.contrib.auth.models import AbstractUser


# Create your models here.
class CustomUser(AbstractUser):
    username = models.CharField(max_length=30, unique=True)
    email = models.EmailField(max_length=254, unique=True)
    USERNAME_FIELD = "email"
    EMAIL_FIELD = "email"
    REQUIRED_FIELDS = ["username"]
    password_changed_date = models.DateTimeField(null=True, blank=True)

class Note(models.Model):
    author = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='Notes')
    note_title = models.CharField(max_length=100)
    note_content = models.TextField()

    def __str__(self):
        return self.note_title


class Deck(models.Model):
    title = models.CharField(max_length=100)
    author = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='decks')

    def __str__(self):
        return self.title
    
class Flashcard(models.Model):
    term = models.CharField(max_length=100)
    definition = models.TextField(max_length=1000)
    deck = models.ForeignKey(Deck, on_delete=models.CASCADE, related_name='flashcards')
    index = models.IntegerField()

    def __str__(self):
        return f"{self.index}. Term: {self.term}\n Definition: {self.definition}"