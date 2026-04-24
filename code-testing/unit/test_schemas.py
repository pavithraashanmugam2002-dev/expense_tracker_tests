
"""Unit tests for Pydantic schemas."""
import pytest
from decimal import Decimal
from pydantic import ValidationError
from app.models.schemas import (
    LoginRequestDto,
    LoginResponseDto,
    LogoutResponseDto,
    UserProfileDto,
    CreateRecordDto,
    UpdateRecordDto,
    RecordDto,
    RecordListDto,
    DeleteRecordResponseDto,
    FinancialSummaryDto,
    ErrorDto,
    ValidationErrorDetail,
    ValidationErrorDto,
)


class TestLoginRequestDto:
    def test_valid_login_request(self):
        dto = LoginRequestDto(email="user@example.com", password="secret123")
        assert dto.email == "user@example.com"
        assert dto.password == "secret123"

    def test_invalid_email_format(self):
        with pytest.raises(ValidationError) as exc_info:
            LoginRequestDto(email="not-an-email", password="secret123")
        errors = exc_info.value.errors()
        assert any(err['type'] == 'value_error' for err in errors)

    def test_empty_password_rejected(self):
        with pytest.raises(ValidationError) as exc_info:
            LoginRequestDto(email="user@example.com", password="")
        errors = exc_info.value.errors()
        assert any('password' in str(err['loc']) for err in errors)


class TestCreateRecordDto:
    def test_valid_income_record(self):
        dto = CreateRecordDto(
            type="income",
            amount=Decimal("1500.50"),
            category="Salary",
            description="Monthly salary",
            date="2024-01-15"
        )
        assert dto.type == "income"
        assert dto.amount == Decimal("1500.50")
        assert dto.category == "Salary"
        assert dto.description == "Monthly salary"
        assert dto.date == "2024-01-15"

    def test_valid_expense_record(self):
        dto = CreateRecordDto(
            type="expense",
            amount=Decimal("50.25"),
            category="Groceries",
            description="Weekly shopping",
            date="2024-01-20T10:30:00Z"
        )
        assert dto.type == "expense"

    def test_invalid_type_rejected(self):
        with pytest.raises(ValidationError) as exc_info:
            CreateRecordDto(
                type="other",
                amount=Decimal("100.00"),
                category="Test",
                description="Test desc",
                date="2024-01-01"
            )
        errors = exc_info.value.errors()
        assert any('type' in str(err['loc']) for err in errors)

    def test_zero_amount_rejected(self):
        with pytest.raises(ValidationError) as exc_info:
            CreateRecordDto(
                type="income",
                amount=Decimal("0.00"),
                category="Test",
                description="Test desc",
                date="2024-01-01"
            )
        errors = exc_info.value.errors()
        assert any('amount' in str(err['loc']) for err in errors)

    def test_negative_amount_rejected(self):
        with pytest.raises(ValidationError) as exc_info:
            CreateRecordDto(
                type="income",
                amount=Decimal("-100.00"),
                category="Test",
                description="Test desc",
                date="2024-01-01"
            )
        errors = exc_info.value.errors()
        assert any('amount' in str(err['loc']) for err in errors)

    def test_empty_category_rejected(self):
        with pytest.raises(ValidationError) as exc_info:
            CreateRecordDto(
                type="income",
                amount=Decimal("100.00"),
                category="",
                description="Test desc",
                date="2024-01-01"
            )
        errors = exc_info.value.errors()
        assert any('category' in str(err['loc']) for err in errors)

    def test_empty_description_rejected(self):
        with pytest.raises(ValidationError) as exc_info:
            CreateRecordDto(
                type="income",
                amount=Decimal("100.00"),
                category="Test",
                description="",
                date="2024-01-01"
            )
        errors = exc_info.value.errors()
        assert any('description' in str(err['loc']) for err in errors)

    def test_invalid_date_format_rejected(self):
        with pytest.raises(ValidationError) as exc_info:
            CreateRecordDto(
                type="income",
                amount=Decimal("100.00"),
                category="Test",
                description="Test desc",
                date="01/01/2024"
            )
        errors = exc_info.value.errors()
        assert any('date' in str(err['loc']) for err in errors)

    def test_valid_iso_datetime_accepted(self):
        dto = CreateRecordDto(
            type="income",
            amount=Decimal("100.00"),
            category="Test",
            description="Test desc",
            date="2024-01-15T10:30:00Z"
        )
        assert dto.date == "2024-01-15T10:30:00Z"


class TestUpdateRecordDto:
    def test_update_all_fields(self):
        dto = UpdateRecordDto(
            type="expense",
            amount=Decimal("250.75"),
            category="Rent",
            description="Monthly rent payment",
            date="2024-02-01"
        )
        assert dto.type == "expense"
        assert dto.amount == Decimal("250.75")

    def test_same_validations_as_create(self):
        with pytest.raises(ValidationError):
            UpdateRecordDto(
                type="income",
                amount=Decimal("0.00"),
                category="Test",
                description="Test",
                date="2024-01-01"
            )


class TestRecordDto:
    def test_valid_record_response(self):
        dto = RecordDto(
            id="507f1f77bcf86cd799439011",
            user_id="507f191e810c19729de860ea",
            type="income",
            amount=1200.00,
            category="Salary",
            description="Jan salary",
            date="2024-01-15",
            created_at="2024-01-15T08:00:00Z",
            updated_at="2024-01-15T08:00:00Z"
        )
        assert dto.id == "507f1f77bcf86cd799439011"
        assert dto.amount == 1200.00


class TestRecordListDto:
    def test_empty_record_list(self):
        dto = RecordListDto(records=[], total=0)
        assert dto.records == []
        assert dto.total == 0

    def test_record_list_with_items(self):
        records = [
            RecordDto(
                id="1",
                user_id="user1",
                type="income",
                amount=100.00,
                category="Test",
                description="Test",
                date="2024-01-01",
                created_at="2024-01-01T00:00:00Z",
                updated_at="2024-01-01T00:00:00Z"
            )
        ]
        dto = RecordListDto(records=records, total=1)
        assert len(dto.records) == 1
        assert dto.total == 1


class TestFinancialSummaryDto:
    def test_positive_balance(self):
        dto = FinancialSummaryDto(
            total_income=5000.00,
            total_expenses=3000.00,
            balance=2000.00
        )
        assert dto.total_income == 5000.00
        assert dto.total_expenses == 3000.00
        assert dto.balance == 2000.00

    def test_negative_balance(self):
        dto = FinancialSummaryDto(
            total_income=1000.00,
            total_expenses=1500.00,
            balance=-500.00
        )
        assert dto.balance == -500.00

    def test_zero_balance(self):
        dto = FinancialSummaryDto(
            total_income=0.00,
            total_expenses=0.00,
            balance=0.00
        )
        assert dto.balance == 0.00


class TestUserProfileDto:
    def test_valid_user_profile(self):
        dto = UserProfileDto(
            user_id="507f191e810c19729de860ea",
            email="user@example.com",
            created_at="2024-01-01T00:00:00Z",
            is_active=True
        )
        assert dto.user_id == "507f191e810c19729de860ea"
        assert dto.email == "user@example.com"
        assert dto.is_active is True


class TestErrorDtos:
    def test_error_dto(self):
        dto = ErrorDto(detail="Something went wrong")
        assert dto.detail == "Something went wrong"

    def test_validation_error_detail(self):
        dto = ValidationErrorDetail(
            loc=["body", "amount"],
            msg="value must be greater than 0",
            type="value_error"
        )
        assert dto.loc == ["body", "amount"]
        assert dto.msg == "value must be greater than 0"

    def test_validation_error_dto(self):
        details = [
            ValidationErrorDetail(
                loc=["body", "email"],
                msg="invalid email format",
                type="value_error"
            )
        ]
        dto = ValidationErrorDto(detail=details)
        assert len(dto.detail) == 1
        assert dto.detail[0].loc == ["body", "email"]
