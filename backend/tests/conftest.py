import os
import sys
from pathlib import Path

# Add backend directory to sys.path so 'app' is resolvable anywhere in tests
backend_dir = Path(__file__).resolve().parent.parent
if str(backend_dir) not in sys.path:
    sys.path.insert(0, str(backend_dir))

# Force SQLite test database
os.environ["DATABASE_URL"] = "sqlite:///./test_layeros.db"

import pytest
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.db.base import Base
import app.models  # noqa: F401
from app.main import app
from app.db.session import get_db

test_db_path = backend_dir / "test_layeros.db"
test_engine = create_engine(f"sqlite:///{test_db_path}", connect_args={"check_same_thread": False})
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=test_engine)


@pytest.fixture(autouse=True, scope="session")
def setup_test_db():
    Base.metadata.drop_all(bind=test_engine)
    Base.metadata.create_all(bind=test_engine)
    yield
    Base.metadata.drop_all(bind=test_engine)
    if test_db_path.exists():
        try:
            test_db_path.unlink()
        except Exception:
            pass


def override_get_db():
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()


app.dependency_overrides[get_db] = override_get_db
