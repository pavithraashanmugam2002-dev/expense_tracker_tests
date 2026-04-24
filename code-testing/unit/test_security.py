
"""Unit tests for security utilities."""
import pytest
from datetime import datetime, timedelta
from app.core.security import (
    hash_password,
    verify_password,
    create_session,
    get_session,
    invalidate_session,
    _sessions
)


class TestPasswordHashing:
    def test_hash_password_returns_string(self):
        hashed = hash_password("mypassword123")
        assert isinstance(hashed, str)
        assert len(hashed) > 0

    def test_hash_password_different_each_time(self):
        hash1 = hash_password("password")
        hash2 = hash_password("password")
        assert hash1 != hash2

    def test_verify_password_correct(self):
        password = "correct_password"
        hashed = hash_password(password)
        assert verify_password(password, hashed) is True

    def test_verify_password_incorrect(self):
        password = "correct_password"
        hashed = hash_password(password)
        assert verify_password("wrong_password", hashed) is False

    def test_verify_password_empty_string(self):
        hashed = hash_password("password")
        assert verify_password("", hashed) is False


class TestSessionManagement:
    def setup_method(self):
        _sessions.clear()

    def test_create_session_returns_token(self):
        token = create_session("user123")
        assert isinstance(token, str)
        assert len(token) > 0

    def test_create_session_stores_user_id(self):
        user_id = "user456"
        token = create_session(user_id)
        session = get_session(token)
        assert session is not None
        assert session["user_id"] == user_id

    def test_get_session_valid_token(self):
        token = create_session("user789")
        session = get_session(token)
        assert session is not None
        assert "user_id" in session
        assert "expiry" in session

    def test_get_session_invalid_token(self):
        session = get_session("nonexistent_token")
        assert session is None

    def test_get_session_expired_token(self):
        token = create_session("user999")
        # Manually expire the session
        _sessions[token]["expiry"] = datetime.utcnow() - timedelta(seconds=1)
        session = get_session(token)
        assert session is None
        assert token not in _sessions

    def test_invalidate_session_removes_token(self):
        token = create_session("user111")
        assert get_session(token) is not None
        invalidate_session(token)
        assert get_session(token) is None

    def test_invalidate_session_nonexistent_token(self):
        # Should not raise error
        invalidate_session("nonexistent_token")

    def test_session_expiry_timestamp(self):
        token = create_session("user222")
        session = get_session(token)
        assert session is not None
        expiry = session["expiry"]
        now = datetime.utcnow()
        diff = (expiry - now).total_seconds()
        assert 86300 < diff < 86500  # Approx 24 hours
