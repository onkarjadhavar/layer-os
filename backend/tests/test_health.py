from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


def test_root():
    response = client.get("/")
    assert response.status_code == 200
    data = response.json()
    assert data["service"] == "LayerOS Poultry ERP API"
    assert data["docs"] == "/docs"


def test_health_check():
    response = client.get("/api/v1/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] in ["ok", "degraded"]
    assert data["service"] == "LayerOS Poultry ERP (Maharashtra)"
    assert "checks" in data


def test_readiness_check():
    response = client.get("/api/v1/ready")
    assert response.status_code == 200
    assert response.json()["ready"] is True
