from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    app_name: str = "AgentWatch AI Service"
    environment: str = "development"

    model_config = SettingsConfigDict(env_prefix="AGENTWATCH_AI_", extra="ignore")
