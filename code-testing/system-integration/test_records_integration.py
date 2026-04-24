
"""Integration tests for records endpoints."""
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
async def authenticated_user():
    await connect_to_mongodb()
    await mongodb.db.users.delete_many({"email": "recordtest@example.com"})
    user = await mongodb.db.users.insert_one({
        "email": "recordtest@example.com",
        "password": hash_password("password123"),
        "created_at": "2024-01-01T00:00:00Z",
        "is_active": True
    })
    user_id = str(user.inserted_id)
    session_token = create_session(user_id)
    
    yield {
        "user_id": user_id,
        "session_token": session_token,
        "email": "recordtest@example.com"
    }
    
    await mongodb.db.users.delete_many({"email": "recordtest@example.com"})
    await mongodb.db.records.delete_many({"user_id": ObjectId(user_id)})


@pytest.mark.asyncio
async def test_get_all_records_empty(test_client, authenticated_user):
    response = await test_client.get(
        "/api/v1/records",
        cookies={"expense_tracker_session": authenticated_user["session_token"]}
    )
    assert response.status_code == 200
    data = response.json()
    assert data["records"] == []
    assert data["total"] == 0


@pytest.mark.asyncio
async def test_create_record_success(test_client, authenticated_user):
    payload = {
        "type": "income",
        "amount": 1500.50,
        "category": "Salary",
        "description": "Monthly salary",
        "date": "2024-01-15"
    }
    response = await test_client.post(
        "/api/v1/records",
        json=payload,
        cookies={"expense_tracker_session": authenticated_user["session_token"]}
    )
    assert response.status_code == 201
    data = response.json()
    assert data["type"] == "income"
    assert data["amount"] == 1500.50
    assert data["category"] == "Salary"
    assert data["description"] == "Monthly salary"
    assert data["date"] == "2024-01-15"
    assert "id" in data
    assert data["user_id"] == authenticated_user["user_id"]


@pytest.mark.asyncio
async def test_create_record_validation_error(test_client, authenticated_user):
    payload = {
        "type": "income",
        "amount": 0.00,
        "category": "Test",
        "description": "Test",
        "date": "2024-01-01"
    }
    response = await test_client.post(
        "/api/v1/records",
        json=payload,
        cookies={"expense_tracker_session": authenticated_user["session_token"]}
    )
    assert response.status_code == 422


@pytest.mark.asyncio
async def test_create_record_unauthenticated(test_client):
    payload = {
        "type": "income",
        "amount": 100.00,
        "category": "Test",
        "description": "Test",
        "date": "2024-01-01"
    }
    response = await test_client.post("/api/v1/records", json=payload)
    assert response.status_code == 401


@pytest.mark.asyncio
async def test_get_all_records_with_data(test_client, authenticated_user):
    # Create two records
    await mongodb.db.records.insert_many([
        {
            "user_id": ObjectId(authenticated_user["user_id"]),
            "type": "income",
            "amount": 1000.00,
            "category": "Salary",
            "description": "Jan salary",
            "date": "2024-01-15",
            "created_at": "2024-01-15T00:00:00Z",
            "updated_at": "2024-01-15T00:00:00Z"
        },
        {
            "user_id": ObjectId(authenticated_user["user_id"]),
            "type": "expense",
            "amount": 50.00,
            "category": "Groceries",
            "description": "Weekly shopping",
            "date": "2024-01-20",
            "created_at": "2024-01-20T00:00:00Z",
            "updated_at": "2024-01-20T00:00:00Z"
        }
    ])
    
    response = await test_client.get(
        "/api/v1/records",
        cookies={"expense_tracker_session": authenticated_user["session_token"]}
    )
    assert response.status_code == 200
    data = response.json()
    assert data["total"] == 2
    assert len(data["records"]) == 2


@pytest.mark.asyncio
async def test_update_record_success(test_client, authenticated_user):
    # Create a record
    record = await mongodb.db.records.insert_one({
        "user_id": ObjectId(authenticated_user["user_id"]),
        "type": "income",
        "amount": 1000.00,
        "category": "Salary",
        "description": "Original description",
        "date": "2024-01-15",
        "created_at": "2024-01-15T00:00:00Z",
        "updated_at": "2024-01-15T00:00:00Z"
    })
    record_id = str(record.inserted_id)
    
    update_payload = {
        "type": "expense",
        "amount": 1200.00,
        "category": "Bonus",
        "description": "Updated description",
        "date": "2024-01-20"
    }
    response = await test_client.put(
        f"/api/v1/records/{record_id}",
        json=update_payload,
        cookies={"expense_tracker_session": authenticated_user["session_token"]}
    )
    assert response.status_code == 200
    data = response.json()
    assert data["type"] == "expense"
    assert data["amount"] == 1200.00
    assert data["category"] == "Bonus"
    assert data["description"] == "Updated description"


@pytest.mark.asyncio
async def test_update_record_not_found(test_client, authenticated_user):
    fake_id = str(ObjectId())
    update_payload = {
        "type": "income",
        "amount": 100.00,
        "category": "Test",
        "description": "Test",
        "date": "2024-01-01"
    }
    response = await test_client.put(
        f"/api/v1/records/{fake_id}",
        json=update_payload,
        cookies={"expense_tracker_session": authenticated_user["session_token"]}
    )
    assert response.status_code == 404


@pytest.mark.asyncio
async def test_update_record_invalid_id(test_client, authenticated_user):
    update_payload = {
        "type": "income",
        "amount": 100.00,
        "category": "Test",
        "description": "Test",
        "date": "2024-01-01"
    }
    response = await test_client.put(
        "/api/v1/records/invalid-id",
        json=update_payload,
        cookies={"expense_tracker_session": authenticated_user["session_token"]}
    )
    assert response.status_code == 404


@pytest.mark.asyncio
async def test_delete_record_success(test_client, authenticated_user):
    record = await mongodb.db.records.insert_one({
        "user_id": ObjectId(authenticated_user["user_id"]),
        "type": "income",
        "amount": 500.00,
        "category": "Test",
        "description": "To be deleted",
        "date": "2024-01-10",
        "created_at": "2024-01-10T00:00:00Z",
        "updated_at": "2024-01-10T00:00:00Z"
    })
    record_id = str(record.inserted_id)
    
    response = await test_client.delete(
        f"/api/v1/records/{record_id}",
        cookies={"expense_tracker_session": authenticated_user["session_token"]}
    )
    assert response.status_code == 200
    data = response.json()
    assert data["message"] == "Record deleted successfully"
    assert data["deleted_id"] == record_id
    
    # Verify deletion
    deleted_record = await mongodb.db.records.find_one({"_id": ObjectId(record_id)})
    assert deleted_record is None


@pytest.mark.asyncio
async def test_delete_record_not_found(test_client, authenticated_user):
    fake_id = str(ObjectId())
    response = await test_client.delete(
        f"/api/v1/records/{fake_id}",
        cookies={"expense_tracker_session": authenticated_user["session_token"]}
    )
    assert response.status_code == 404


@pytest.mark.asyncio
async def test_delete_record_unauthenticated(test_client):
    fake_id = str(ObjectId())
    response = await test_client.delete(f"/api/v1/records/{fake_id}")
    assert response.status_code == 401
