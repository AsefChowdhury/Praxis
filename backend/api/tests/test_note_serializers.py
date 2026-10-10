from ..serializers import NoteSerializer
from .test_data import (
    note_serializer_cases,
)
import pytest

@pytest.mark.parametrize("note_data, expected_outcome", note_serializer_cases)
def test_note_serializer_valid_data(note_data, expected_outcome):
    serializer = NoteSerializer(data=note_data)
    is_valid = serializer.is_valid() == expected_outcome
    assert is_valid