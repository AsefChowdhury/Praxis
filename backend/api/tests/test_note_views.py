from ..views import NoteViewSet
from ..models import Note, CustomUser
from .test_data import (
    test_note_filter_by_author_cases
)
from rest_framework.test import APIClient
import pytest

@pytest.fixture
def make_user(db):
    def _make_user(username, email, password="testpass123"):
        return CustomUser.objects.create_user(username=username, email=email, password=password)
    return _make_user

@pytest.fixture
def client():
    return APIClient()

def test_note_viewset_rejects_unauthenticated_requests(client):
    endpoint = '/api/notes/'
    response = client.get(endpoint)
    assert response.status_code == 401

@pytest.mark.parametrize("note_title1, note_content1, note_title2, note_content2, expected_result", test_note_filter_by_author_cases)
def test_note_viewset_queryset_filters_by_author(client, make_user, note_title1, note_content1, note_title2, note_content2, expected_result):
    # User 1 setup
    user1 = make_user("user1", "user1@test.com")
    client.force_authenticate(user=user1)

    # Note setup
    notes = [
        Note(author=user1, note_title=note_title1, note_content=note_content1),
        Note(author=user1, note_title=note_title2, note_content=note_content2)
        ]

    for note in notes:
        note.save()

    # Get notes and their titles
    returned_notes = client.get('/api/notes/')
    returned_note_titles = [note["note_title"] for note in returned_notes.data]

    # assert titles match user 1's note titles
    assert (set(returned_note_titles) == set(expected_result))

    # User 2 setup
    user2 = make_user("user2", "user2@test.com")
    client.force_authenticate(user=user2)

    # get user 2 notes (should be empty)
    returned_notes = client.get('/api/notes/')
    returned_note_titles = [note["note_title"] for note in returned_notes.data]

    # assert user 2 doesn't have any of user 1 notes, i.e, it should return empty
    assert len(returned_note_titles) == 0


