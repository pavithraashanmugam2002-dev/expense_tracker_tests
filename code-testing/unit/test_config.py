
"""Unit tests for configuration."""
import pytest
import os
from app.core.config import Settings


class TestSettings:
    def test_default_mongodb_url(self):
        settings = Settings()
        assert settings.MONGODB_URL == "mongodb+srv://pavithraashanmugam2002_db_user:1tcysy6umuoTOH4h@sdlcforgedev.zg3gi9x.mongodb.net/?appName=SDLCForgeDev"

    def test_default_mongodb_database(self):
        settings = Settings()
        assert settings.MONGODB_DATABASE == "expense_tracker_demo"

    def test_default_frontend_origin(self):
        settings = Settings()
        assert settings.FRONTEND_ORIGIN == "http://localhost:5173"

    def test_default_api_v1_prefix(self):
        settings = Settings()
        assert settings.API_V1_PREFIX == "/api/v1"

    def test_default_session_cookie_name(self):
        settings = Settings()
        assert settings.SESSION_COOKIE_NAME == "expense_tracker_session"

    def test_default_session_max_age(self):
        settings = Settings()
        assert settings.SESSION_MAX_AGE == 86400

    def test_settings_from_env_variables(self, monkeypatch):
        monkeypatch.setenv("MONGODB_URL", "mongodb+srv://pavithraashanmugam2002_db_user:1tcysy6umuoTOH4h@sdlcforgedev.zg3gi9x.mongodb.net/?appName=SDLCForgeDev")
        monkeypatch.setenv("MONGODB_DATABASE", "custom_db")
        monkeypatch.setenv("FRONTEND_ORIGIN", "http://custom:3000")
        monkeypatch.setenv("SESSION_SECRET_KEY", "custom_secret")
        
        settings = Settings()
        assert settings.MONGODB_URL == "mongodb+srv://pavithraashanmugam2002_db_user:1tcysy6umuoTOH4h@sdlcforgedev.zg3gi9x.mongodb.net/?appName=SDLCForgeDev"
        assert settings.MONGODB_DATABASE == "custom_db"
        assert settings.FRONTEND_ORIGIN == "http://custom:3000"
        assert settings.SESSION_SECRET_KEY == "custom_secret"
