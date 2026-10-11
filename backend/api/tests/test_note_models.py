from ..models import Note, CustomUser
from .test_data import (
    note_str_returns_title_cases
)
import pytest

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