import pytest
from fastapi.testclient import TestClient
from sqlmodel import Session, SQLModel, create_engine
from sqlmodel.pool import StaticPool
from app.main import app, get_session
from app.models import User, Message


# Setup test database
@pytest.fixture(name="session")
def session_fixture():
    engine = create_engine(
        "sqlite://",
        connect_args={"check_same_thread": False},
        poolclass=StaticPool,
    )
    SQLModel.metadata.create_all(engine)
    with Session(engine) as session:
        yield session


@pytest.fixture(name="client")
def client_fixture(session: Session):
    def get_session_override():
        return session

    app.dependency_overrides[get_session] = get_session_override
    client = TestClient(app)
    yield client
    app.dependency_overrides.clear()


def test_signup_success(client: TestClient):
    response = client.post(
        "/api/auth/signup",
        json={
            "email": "test@example.com",
            "password": "testpass123",
            "name": "Test User",
        },
    )
    assert response.status_code == 200
    assert "token" in response.json()
    assert response.json()["token_type"] == "bearer"


def test_signup_duplicate_email(client: TestClient):
    # First signup
    response = client.post(
        "/api/auth/signup",
        json={
            "email": "test@example.com",
            "password": "testpass123",
            "name": "Test User",
        },
    )
    assert response.status_code == 200

    # Try to signup with same email
    response = client.post(
        "/api/auth/signup",
        json={
            "email": "test@example.com",
            "password": "testpass123",
            "name": "Test User",
        },
    )
    assert response.status_code == 400
    assert "Email already registered" in response.json()["detail"]


def test_signin_success(client: TestClient):
    # First create a user
    client.post(
        "/api/auth/signup",
        json={
            "email": "test@example.com",
            "password": "testpass123",
            "name": "Test User",
        },
    )

    # Try to sign in
    response = client.post(
        "/api/auth/signin",
        data={"username": "test@example.com", "password": "testpass123"},
    )
    assert response.status_code == 200
    assert "token" in response.json()
    assert response.json()["token_type"] == "bearer"


def test_signin_wrong_password(client: TestClient):
    # First create a user
    client.post(
        "/api/auth/signup",
        json={
            "email": "test@example.com",
            "password": "testpass123",
            "name": "Test User",
        },
    )

    # Try to sign in with wrong password
    response = client.post(
        "/api/auth/signin",
        data={"username": "test@example.com", "password": "wrongpass"},
    )
    assert response.status_code == 401


def test_create_message(client: TestClient):
    # First create a user and get token
    response = client.post(
        "/api/auth/signup",
        json={
            "email": "test@example.com",
            "password": "testpass123",
            "name": "Test User",
        },
    )
    token = response.json()["token"]

    # Create a message
    response = client.post(
        "/api/messages",
        json={"content": "Test message"},
        headers={"Authorization": f"Bearer {token}"},
    )
    assert response.status_code == 200
    assert response.json()["content"] == "Test message"
    assert "id" in response.json()


def test_get_messages(client: TestClient):
    # First create a user and get token
    response = client.post(
        "/api/auth/signup",
        json={
            "email": "test@example.com",
            "password": "testpass123",
            "name": "Test User",
        },
    )
    token = response.json()["token"]

    # Create a message
    client.post(
        "/api/messages",
        json={"content": "Test message"},
        headers={"Authorization": f"Bearer {token}"},
    )

    # Get messages
    response = client.get("/api/messages", headers={"Authorization": f"Bearer {token}"})
    assert response.status_code == 200
    assert len(response.json()) >= 1
    assert response.json()[0]["content"] == "Test message"


def test_edit_message(client: TestClient):
    # First create a user and get token
    response = client.post(
        "/api/auth/signup",
        json={
            "email": "test@example.com",
            "password": "testpass123",
            "name": "Test User",
        },
    )
    token = response.json()["token"]

    # Create a message
    message_response = client.post(
        "/api/messages",
        json={"content": "Test message"},
        headers={"Authorization": f"Bearer {token}"},
    )
    message_id = message_response.json()["id"]

    # Edit the message
    response = client.put(
        f"/api/messages/{message_id}",
        json={"content": "Edited message"},
        headers={"Authorization": f"Bearer {token}"},
    )
    assert response.status_code == 200
    assert response.json()["content"] == "Edited message"
    assert response.json()["edited"] == True


def test_delete_message(client: TestClient):
    # First create a user and get token
    response = client.post(
        "/api/auth/signup",
        json={
            "email": "test@example.com",
            "password": "testpass123",
            "name": "Test User",
        },
    )
    token = response.json()["token"]

    # Create a message
    message_response = client.post(
        "/api/messages",
        json={"content": "Test message"},
        headers={"Authorization": f"Bearer {token}"},
    )
    message_id = message_response.json()["id"]

    # Delete the message
    response = client.delete(
        f"/api/messages/{message_id}", headers={"Authorization": f"Bearer {token}"}
    )
    assert response.status_code == 200
    assert response.json()["deleted"] == True
