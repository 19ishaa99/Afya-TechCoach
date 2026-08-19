from datetime import timedelta
import pytest
from app.core.security import create_token, decode_token, hash_password, verify_password


def test_password_hash_and_verify():
    hashed = hash_password("StrongPassword123")
    assert hashed != "StrongPassword123"
    assert verify_password("StrongPassword123", hashed)
    assert not verify_password("wrong", hashed)


def test_token_type_is_enforced():
    token = create_token("student-id", "access", timedelta(minutes=5))
    assert decode_token(token, "access") == "student-id"
    with pytest.raises(ValueError): decode_token(token, "refresh")
