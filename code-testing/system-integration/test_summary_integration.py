
"""Integration tests for summary endpoint."""
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
async def authenticated_user_with_records():
    await connect_to_mongodb()
    await mongodb.db.users.delete_many({"email": "summarytest@example.com"})
    user = await mongodb.db.users.insert_one({
        "email": "summarytest@example.com",
        "password": hash_password("password123"),
        "created_at": "2024-01-01T00:00:00Z",
        "is_active": True
    })
    user_id = str(user.inserted_id)
    session_token = create_session(user_id)
    
    # Insert test records
    await mongodb.db.records.insert_many([
        {
            "user_id": ObjectId(user_id),
            "type": "income",
            "amount": 5000.00,
            "category": "Salary",
            "description": "Jan salary",
            "date": "2024-01-15",
            "created_at": "2024-01-15T00:00:00Z",
            "updated_at": "2024-01-15T00:00:00Z"
        },
        {
            "user_id": ObjectId(user_id),
            "type": "income",
            "amount": 1000.00,
            "category": "Bonus",
            "description": "Performance bonus",
            "date": "2024-01-20",
            "created_at": "2024-01-20T00:00:00Z",
            "updated_at": "2024-01-20T00:00:00Z"
        },
        {
            "user_id": ObjectId(user_id),
            "type": "expense",
            "amount": 1200.00,
            "category": "Rent",
            "description": "Jan rent",
            "date": "2024-01-05",
            "created_at": "2024-01-05T00:00:00Z",
            "updated_at": "2024-01-05T00:00:00Z"
        },
        {
            "user_id": ObjectId(user_id),
            "type": "expense",
            "amount": 300.00,
            "category": "Groceries",
            "description": "Weekly shopping",
            "date": "2024-01-10",
            "created_at": "2024-01-10T00:00:00Z",
            "updated_at": "2024-01-10T00:00:00Z"
        }
    ])
    
    yield {
        "user_id": user_id,
        "session_token": session_token
    }
    
    await mongodb.db.users.delete_many({"email": "summarytest@example.com"})
    await mongodb.db.records.delete_many({"user_id": ObjectId(user_id)})


@pytest.mark.asyncio
async def test_get_summary_with_records(test_client, authenticated_user_with_records):
    response = await test_client.get(
        "/api/v1/summary",
        cookies={"expense_tracker_session": authenticated_user_with_records["session_token"]}
    )
    assert response.status_code == 200
    data = response.json()
    assert data["total_income"] == 6000.00
    assert data["total_expenses"] == 1500.00
    assert data["balance"] == 4500.00


@pytest.mark.asyncio
async def test_get_summary_no_records(test_client):
    await connect_to_mongodb()
    await mongodb.db.users.delete_many({"email": "emptysummary@example.com"})
    user = await mongodb.db.users.insert_one({
        "email": "emptysummary@example.com",
        "password": hash_password("password123"),
        "created_at": "2024-01-01T00:00:00Z",
        "is_active": True
    })
    user_id = str(user.inserted_id)
    session_token = create_session(user_id)
    
    response = await test_client.get(
        "/api/v1/summary",
        cookies={"expense_tracker_session": session_token}
    )
    assert response.status_code == 200
    data = response.json()
    assert data["total_income"] == 0.00
    assert data["total_expenses"] == 0.00
    assert data["balance"] == 0.00
    
    await mongodb.db.users.delete_many({"email": "emptysummary@example.com"})


@pytest.mark.asyncio
async def test_get_summary_unauthenticated(test_client):
    response = await test_client.get("/api/v1/summary")
    assert response.status_code == 401
