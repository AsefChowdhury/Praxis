note_serializer_cases = [
    # both fields present — valid
    ({"note_title": "Test", "note_content": "Some content"}, True),

    # missing note_content — invalid
    ({"note_title": "Test"}, False),

    # missing note_title — invalid
    ({"note_content": "Some content"}, False),

    # both missing — invalid
    ({}, False),

    # empty strings for both — depends on blank= settings, worth checking real behaviour
    ({"note_title": "", "note_content": ""}, False),

    # note_title at the model's max_length boundary (100 chars) — valid
    ({"note_title": "A" * 100, "note_content": "Some content"}, True),

    # note_title exceeding max_length (101 chars) — invalid
    ({"note_title": "A" * 101, "note_content": "Some content"}, False),
]