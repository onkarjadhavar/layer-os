from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


def test_admin_flow():
    # 1. Admin login
    login_res = client.post(
        "/api/v1/admin/login",
        json={"email": "admin@layeros.in", "password": "SuperAdmin@LayerOS2026!"}
    )
    assert login_res.status_code == 200
    token = login_res.json()["token"]

    # 2. Get Platform KPIs
    kpi_res = client.get(
        "/api/v1/admin/kpis",
        headers={"Authorization": f"Bearer {token}"}
    )
    assert kpi_res.status_code == 200
    kpis = kpi_res.json()
    assert kpis["total_farms"] >= 1
    assert kpis["total_live_birds"] >= 20000

    # 3. List farms
    farms_res = client.get(
        "/api/v1/admin/farms",
        headers={"Authorization": f"Bearer {token}"}
    )
    assert farms_res.status_code == 200
    farms = farms_res.json()
    assert len(farms) >= 1
    target_farm_id = farms[0]["id"]

    # 4. Status change with audit trail
    status_res = client.patch(
        f"/api/v1/admin/farms/{target_farm_id}/status",
        json={
            "farm_id": target_farm_id,
            "new_status": "active",
            "reason": "Routine verification and KYC complete"
        },
        headers={"Authorization": f"Bearer {token}"}
    )
    assert status_res.status_code == 200
    assert status_res.json()["status"] == "active"

    # 5. Verify audit logs
    audit_res = client.get(
        "/api/v1/admin/audit-logs",
        headers={"Authorization": f"Bearer {token}"}
    )
    assert audit_res.status_code == 200
    logs = audit_res.json()
    assert len(logs) >= 1
    assert "STATUS_CHANGE" in logs[0]["action"]
