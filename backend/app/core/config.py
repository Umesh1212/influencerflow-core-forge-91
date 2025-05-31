"""
Configuration management for InfluencerFlow API
"""

from pydantic_settings import BaseSettings
from typing import Optional
import os


class Settings(BaseSettings):
    """Application settings"""
    
    # App settings
    app_name: str = "InfluencerFlow AI Platform"
    app_version: str = "1.0.0"
    debug: bool = False
    
    # API settings
    api_v1_prefix: str = "/api/v1"
    
    # Database settings
    supabase_url: str
    supabase_key: str
    supabase_service_key: Optional[str] = None
    
    # AI Services
    openai_api_key: str
    elevenlabs_api_key: str
    perplexity_api_key: Optional[str] = None
    
    # Authentication
    secret_key: str
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 30
    
    # Email settings
    smtp_host: Optional[str] = None
    smtp_port: Optional[int] = 587
    smtp_username: Optional[str] = None
    smtp_password: Optional[str] = None
    
    # File storage
    max_file_size: int = 10 * 1024 * 1024  # 10MB
    allowed_file_types: list = [".pdf", ".doc", ".docx", ".txt", ".mp3", ".wav", ".m4a"]
    
    # Voice processing
    max_voice_duration: int = 300  # 5 minutes in seconds
    supported_languages: list = [
        "en", "es", "fr", "de", "it", "pt", "ru", "zh", "ja", "ko", "ar", "hi"
    ]
    
    # Rate limiting
    rate_limit_per_minute: int = 60
    
    # CORS settings
    allowed_origins: list = [
        "http://localhost:3000",
        "http://localhost:5173",
        "https://influencerflow.com"
    ]
    
    class Config:
        env_file = ".env"
        case_sensitive = False


# Global settings instance
settings = Settings() 