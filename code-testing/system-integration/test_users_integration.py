
"""Integration tests for users endpoint."""
import pytest
from httpx import AsyncClient, ASGITransport
from bson import ObjectId
from app.main import app
from app.db.mongodb import mongodb, connect_to_mongodb, close_mongodb_connection
from app.core.security import hash_password, create_session


@pytest.fixture(scope="module")
async def test_client():
    await connect_to_mongodb()
    async with AsyncClient(
        transport=ASGITransport(app=app),
        base_url="http://test"
    ) as client:
        yield client
    await close_mongodb_connection()


@pytest.fixture
async def test_user():
    await connect_to_mongodb()
    await mongodb.db.users.delete_many({"email": "usertest@example.com"})
    user = await mongodb.db.users.insert_one({
        "email": "usertest@example.com",
        "password": hash_password("password123"),
        "created_at": "2024-01-01T00:00:00Z",
        "is_active": True
    })
    user_id = str(user.inserted_id)
    session_token = create_session(user_id)
    
    yield {
        "user_id": user_id,
        "session_token": session_token
    }
    
    await mongodb.db.users.delete_many({"email": "usertest@example.com"})


@pytest.mark.asyncio
async def test_get_user_profile_success(test_client, test_user):
    response = await test_client.get(
        f"/api/v1/users/{test_user['user_id']}",
        cookies={"expense_tracker_session": test_user["session_token"]}
    )
    assert response.status_code == 200
    data = response.json()
    assert data["user_id"] == test_user["user_id"]
    assert data["email"] == "usertest@example.com"
    assert data["is_active"] is True
    assert "password" not in data


@pytest.mark.asyncio
async def test_get_user_profile_not_found(test_client, test_user):
    fake_id = str(ObjectId())
    response = await test_client.get(
        f"/api/v1/users/{fake_id}",
        cookies={"expense_tracker_session": test_user["session_token"]}
    )
    assert response.status_code == 404


@pytest.mark.asyncio
async def test_get_user_profile_invalid_id(test_client, test_user):
    response = await test_client.get(
        "/api/v1/users/invalid-id",
        cookies={"expense_tracker_session": test_user["session_token"]}
    )
    assert response.status_code == 404


@pytest.mark.asyncio
async def test_get_user_profile_unauthenticated(test_client, test_user):
    response = await test_client.get(f"/api/v1/users/{test_user['user_id']}")
    assert response.status_code == 401
