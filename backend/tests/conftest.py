import os

os.environ.setdefault("DATABASE_URL", "sqlite:///./test_afya.db")
os.environ.setdefault("JWT_SECRET_KEY", "test-secret-that-is-long-enough-for-tests")
