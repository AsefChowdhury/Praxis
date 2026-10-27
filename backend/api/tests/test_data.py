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

note_str_returns_title_cases = [
    ("test note", "some note content", "test note"),
    ("Water Cycle Notes", "Evaporation, condensation, precipitation.", "Water Cycle Notes"),
    ("A" * 100, "Some content", "A" * 100),  # title at max length boundary
    ("", "Content with empty title", ""),  # edge case: empty title
    ("Title with !@# symbols & spaces", "Content here", "Title with !@# symbols & spaces"),
    ("单元测试", "Unicode title content", "单元测试"),  # non-ASCII characters
]

note_author_case = [
    ("test note", "some note content")
]

note_cascade_delete_case = [
    ("test note", "some note content")
]

note_title_max_length_cases = [
    ("test note", "some note content", True),
    ("A" * 100, "Some content", True),
    ("A" * 101, "Some content", False),

    # empty title — blank=False by default on CharField, should be invalid
    ("", "Some content", False),

    # significantly over the limit, not just by 1 char
    ("A" * 200, "Some content", False),
]

note_updated_at_cases = [
    ("test note", "some note content", "updated note content", False)
]

test_note_filter_by_author_cases = [
    (
        "test note title",
        "test note content",
        "test note title version 2",
        "test note content version 2",
        ["test note title", "test note title version 2"]
    ),
]