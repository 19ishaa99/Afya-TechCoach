from functools import lru_cache
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    app_name: str = "Afya TechCoach API"
    environment: str = "development"
    database_url: str = "sqlite:///./afya_dev.db"
    jwt_secret_key: str = "development-only-change-me"
    access_token_expire_minutes: int = 30
    refresh_token_expire_days: int = 7
    openai_api_key: str = ""
    openai_model: str = ""
    cors_origins: str = "http://localhost:8081"
    max_request_bytes: int = 100_000
    database_pool_size: int = 5
    database_max_overflow: int = 10
    model_config = SettingsConfigDict(env_file=".env", extra="ignore", case_sensitive=False)

    @property
    def origins(self) -> list[str]:
        value = self.cors_origins.strip()
        if value.startswith("[") and value.endswith("]"):
            import json
            try:
                return [str(origin).strip() for origin in json.loads(value) if str(origin).strip()]
            except (TypeError, ValueError):
                pass
        return [origin.strip().strip('"').strip("'") for origin in value.split(",") if origin.strip()]


@lru_cache
def get_settings() -> Settings:
    return Settings()
