
"""Integration tests for authentication endpoints."""
import pytest
from httpx import AsyncClient, ASGITransport
from app.main import app
from app.db.mongodb import mongodb, connect_to_mongodb, close_mongodb_connection
from app.core.security import hash_password


@pytest.fixture(scope="module")
async def test_client():
    await connect_to_mongodb()
    async with AsyncClient(
        transport=ASGITransport(app=app),
        base_url="http://test"
    ) as client:
        yield client
    await close_mongodb_connection()


@pytest.fixture(autouse=True)
async def setup_test_user():
    await connect_to_mongodb()
    await mongodb.db.users.delete_many({"email": "test@example.com"})
    await mongodb.db.users.insert_one({
        "email": "test@example.com",
        "password": hash_password("testpass123"),
        "created_at": "2024-01-01T00:00:00Z",
        "is_active": True
    })
    yield
    await mongodb.db.users.delete_many({"email": "test@example.com"})


@pytest.mark.asyncio
async def test_login_success(test_client):
    response = await test_client.post("/api/v1/auth/login", json={
        "email": "test@example.com",
        "password": "testpass123"
    })
    assert response.status_code == 200
    data = response.json()
    assert "user_id" in data
    assert data["email"] == "test@example.com"
    assert data["message"] == "Login successful"
    assert "expense_tracker_session" in response.cookies


@pytest.mark.asyncio
async def test_login_invalid_email(test_client):
    response = await test_client.post("/api/v1/auth/login", json={
        "email": "nonexistent@example.com",
        "password": "testpass123"
    })
    assert response.status_code == 401
    data = response.json()
    assert "detail" in data
    assert "Invalid email or password" in data["detail"]


@pytest.mark.asyncio
async def test_login_invalid_password(test_client):
    response = await test_client.post("/api/v1/auth/login", json={
        "email": "test@example.com",
        "password": "wrongpassword"
    })
    assert response.status_code == 401
    data = response.json()
    assert "Invalid email or password" in data["detail"]


@pytest.mark.asyncio
async def test_login_invalid_email_format(test_client):
    response = await test_client.post("/api/v1/auth/login", json={
        "email": "not-an-email",
        "password": "testpass123"
    })
    assert response.status_code == 422


@pytest.mark.asyncio
async def test_login_empty_password(test_client):
    response = await test_client.post("/api/v1/auth/login", json={
        "email": "test@example.com",
        "password": ""
    })
    assert response.status_code == 422


@pytest.mark.asyncio
async def test_logout_success(test_client):
    login_response = await test_client.post("/api/v1/auth/login", json={
        "email": "test@example.com",
        "password": "testpass123"
    })
    assert login_response.status_code == 200
    
    logout_response = await test_client.post("/api/v1/auth/logout")
    assert logout_response.status_code == 200
    data = logout_response.json()
    assert data["message"] == "Logout successful"


@pytest.mark.asyncio
async def test_logout_without_session(test_client):
    response = await test_client.post("/api/v1/auth/logout")
    assert response.status_code == 401
    data = response.json()
    assert "Not authenticated" in data["detail"]


@pytest.mark.asyncio
async def test_login_inactive_user(test_client):
    await mongodb.db.users.update_one(
        {"email": "test@example.com"},
        {"$set": {"is_active": False}}
    )
    
    response = await test_client.post("/api/v1/auth/login", json={
        "email": "test@example.com",
        "password": "testpass123"
    })
    assert response.status_code == 401
    data = response.json()
    assert "inactive" in data["detail"].lower()
