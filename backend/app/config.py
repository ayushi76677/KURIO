import os
from pathlib import Path
from typing import List, Optional
from pydantic_settings import BaseSettings, SettingsConfigDict
from dotenv import load_dotenv

# Resolve absolute directory paths relative to this config file
APP_DIR = Path(__file__).resolve().parent
BACKEND_DIR = APP_DIR.parent
ROOT_DIR = BACKEND_DIR.parent

# Candidate locations for .env files in priority order
env_candidates: list[Path] = [
    BACKEND_DIR / ".env",
    ROOT_DIR / ".env",
    BACKEND_DIR / ".env.example",
]

# Ensure backend/.env exists if backend/.env.example has values
backend_env = BACKEND_DIR / ".env"
backend_env_example = BACKEND_DIR / ".env.example"
if not backend_env.exists() and backend_env_example.exists():
    try:
        backend_env.write_bytes(backend_env_example.read_bytes())
    except Exception:
        pass

# Load candidate .env files into os.environ
loaded_env_files: list[str] = []
for candidate in env_candidates:
    if candidate.exists() and candidate.is_file():
        load_dotenv(dotenv_path=candidate, override=False)
        loaded_env_files.append(str(candidate))

class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=loaded_env_files if loaded_env_files else None,
        env_file_encoding="utf-8",
        extra="ignore"
    )

    APP_NAME: str = "KURIO API"
    VERSION: str = "1.0.0"
    GEMINI_API_KEY: str = ""
    DEFAULT_MODEL: str = "gemini-3.6-flash"
    ALLOWED_ORIGINS: List[str] = [
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
        "*"
    ]

    def get_api_key(self) -> str:
        """Dynamically retrieve the current Gemini API key without caching empty values."""
        key = self.GEMINI_API_KEY or os.getenv("GEMINI_API_KEY", "")
        return key.strip()

    @property
    def is_gemini_configured(self) -> bool:
        """Safely report configuration status without exposing the key value."""
        return len(self.get_api_key()) > 5

settings = Settings()

# Ensure DEFAULT_MODEL respects env override if specified
env_model = os.getenv("GEMINI_MODEL")
if env_model:
    settings.DEFAULT_MODEL = env_model
