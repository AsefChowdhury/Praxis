from ..views import NoteViewSet
from ..models import CustomUser
from rest_framework.test import APIClient
import pytest

@pytest.fixture
def authenticated_user(db):
    test_user = CustomUser.objects.create_user(
        username="test_user_1",
        email="test_user_1@test.com",
        password="testpass123"
    )
    return test_user

@pytest.fixture
def client():
    return APIClient()

def test_note_viewset_rejects_unauthenticated_requests(client):
    endpoint = '/api/notes/'
    response = client.get(endpoint)
    assert response.status_code == 401

