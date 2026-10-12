from ..models import Note, CustomUser
from .test_data import (
    note_str_returns_title_cases,
    note_author_case,
    note_cascade_delete_case,
    note_title_max_length_cases,
    note_updated_at_cases
)
import pytest
from django.core.exceptions import ValidationError

@pytest.fixture
def authenticated_user(db):
    test_user = CustomUser.objects.create_user(
        username="test_user_1",
        email="test_user_1@test.com",
        password="testpass123"
    )
    return test_user

@pytest.mark.parametrize("test_note_title, test_note_content, expected_outcome", note_str_returns_title_cases)
def test_note_str_returns_title(test_note_title, test_note_content, expected_outcome, authenticated_user):
    note = Note(author=authenticated_user, note_title=test_note_title, note_content=test_note_content)
    assert str(note) == expected_outcome

@pytest.mark.parametrize("test_note_title, test_note_content", note_author_case)
def test_note_author_is_correctly_linked(authenticated_user, test_note_title, test_note_content):
    note = Note(author=authenticated_user, note_title=test_note_title, note_content=test_note_content)
    note.save()
    fetched_note = Note.objects.get(id=note.id)
    assert fetched_note.author == authenticated_user

@pytest.mark.parametrize("test_note_title, test_note_content", note_cascade_delete_case)
def test_note_deleted_when_author_deleted(authenticated_user, test_note_title, test_note_content):
    note = Note(author=authenticated_user, note_title=test_note_title, note_content=test_note_content)
    note.save()
    authenticated_user.delete()
    with pytest.raises(Note.DoesNotExist):
        Note.objects.get(id=note.id)

@pytest.mark.parametrize("test_note_title, test_note_content, expected_outcome", note_title_max_length_cases)
def test_note_title_max_length(authenticated_user, test_note_title, test_note_content, expected_outcome):
    note = Note(author=authenticated_user, note_title=test_note_title, note_content=test_note_content)
    note.save()
    if expected_outcome == True:
        note.clean_fields(exclude=None)
    else:
        with pytest.raises(ValidationError):
            note.clean_fields(exclude=None)

@pytest.mark.parametrize("test_note_title, initial_note_content, updated_note_content, expected_outcome", note_updated_at_cases)
def test_note_updated_at_changes_on_save(authenticated_user, test_note_title, initial_note_content, updated_note_content, expected_outcome):
    # Populate and save note pre-update, then grab its time and store
    note = Note(author=authenticated_user, note_title=test_note_title, note_content=initial_note_content)
    note.save()
    initial_time = note.updated_at

    # Populate and save note again, then grab new time and store
    note.note_content = updated_note_content
    note.save()
    updated_time = note.updated_at

    # Check times against eachother
    time_check = initial_time == updated_time
    assert time_check == expected_outcome
