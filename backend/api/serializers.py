import datetime
from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenRefreshSerializer, TokenObtainPairSerializer
from django.contrib.auth import get_user_model
from .models import CustomUser, Deck, Flashcard, Note
import jwt

class NoteSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(required=False)
    class Meta:
        model = Note
        fields = ["id", "author", "note_title", "note_content", "updated_at"]
        read_only_fields = ["author"]

class FlashcardSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(required=False)
    class Meta:
        model = Flashcard
        fields = ["id", "term", "definition", "index"]

class DeckSerializer(serializers.ModelSerializer):
    flashcards = FlashcardSerializer(many=True, required=True, min_length=1)
    id = serializers.IntegerField(required=False)
    
    class Meta:
        model = Deck
        fields = ['id', 'title', 'flashcards']
    
    def create(self, validated_data):
        flashcard_data = validated_data.pop('flashcards')
        deck = Deck.objects.create(**validated_data)
        for flashcard in flashcard_data:
            Flashcard.objects.create(deck=deck, **flashcard)
        return deck
    
    def update(self, instance, validated_data):
        instance.title = validated_data.get('title', instance.title)
        flashcard_data = validated_data.pop('flashcards')

        sent_ids = [f['id'] for f in flashcard_data if 'id' in f]
        for flashcard in instance.flashcards.all():
            if flashcard.id not in sent_ids:
                flashcard.delete()
        
        for flashcard in flashcard_data:
            if 'id' not in flashcard:
                Flashcard.objects.create(deck=instance, **flashcard)
            else:
                databaseFlashcard = Flashcard.objects.get(id=flashcard['id'], deck=validated_data['id'])
                databaseFlashcard.term = flashcard['term']
                databaseFlashcard.definition = flashcard['definition']
                databaseFlashcard.index = flashcard['index']
                databaseFlashcard.save()

        instance.save()
        return instance

class DeckListSerializer(serializers.ModelSerializer):
    class Meta:
        model = Deck
        fields = ['id', 'title']

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['id', 'username', 'email', 'password']
        extra_kwargs = {'password': {'write_only': True}}
    
    def create(self, validated_data):
        user = CustomUser.objects.create_user(**validated_data)
        return user

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    identifier = serializers.CharField(max_length=254)

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        if self.username_field in self.fields:
            del self.fields[self.username_field]

    def validate(self, attrs):
        identifier = attrs.get("identifier")
        user = CustomUser.objects.filter(email=identifier).first() or \
               CustomUser.objects.filter(username=identifier).first()

        if user and user.check_password(attrs.get("password")):
            attrs[self.username_field] = user.email
            data = super().validate(attrs)
            return data

        raise serializers.ValidationError("Invalid credentials")

class CustomTokenRefreshSerializer(TokenRefreshSerializer):
    refresh = serializers.CharField(required=False)

    def validate(self, attrs):
        request = self.context['request']
        refresh_token = request.COOKIES.get("refresh")

        if not refresh_token:
            raise serializers.ValidationError("Refresh token cookie missing.")

        payload = jwt.decode(refresh_token, options={"verify_signature": False})
        iat = payload.get("iat")
        user = CustomUser.objects.filter(id=payload.get("user_id")).first()
        token_time = datetime.datetime.fromtimestamp(iat, tz=datetime.timezone.utc)
        if user.password_changed_date and token_time < user.password_changed_date:
            raise serializers.ValidationError("The password has been changed since the token was issued.")
        
        attrs['refresh'] = refresh_token

        return super().validate(attrs)

class ForgotPasswordSerializer(serializers.Serializer):
    email = serializers.EmailField(required=True)

class ResetPasswordSerializer(serializers.Serializer):
    uid = serializers.CharField(write_only=True, required=True)
    token = serializers.CharField(write_only=True, required=True)
    password = serializers.CharField(write_only=True, required=True)