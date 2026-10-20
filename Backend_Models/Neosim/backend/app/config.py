from pydantic_settings import BaseSettings, SettingsConfigDict
class Settings(BaseSettings):
    app_name: str = "NEOSIM API"
    app_env: str = "development"
    api_prefix: str = "/api/v1"
    frontend_origins: str = "http://localhost:3000,http://localhost:5173"
    database_path: str = "backend/neosim.db"
    llm_provider: str = "none"
    llm_api_key: str = ""
    llm_base_url: str = ""
    llm_model: str = ""
    llm_timeout_seconds: int = 20
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")
    @property
    def origins(self): return [x.strip() for x in self.frontend_origins.split(",") if x.strip()]
settings=Settings()
