"""
Basic tests for InfluencerFlow API
"""

import pytest
from fastapi.testclient import TestClient
from main import app

client = TestClient(app)


def test_root_endpoint():
    """Test the root endpoint"""
    response = client.get("/")
    assert response.status_code == 200
    data = response.json()
    assert data["message"] == "InfluencerFlow AI Platform API"
    assert data["status"] == "healthy"
    assert "AI-powered multilingual voice outreach" in data["features"]


def test_health_check():
    """Test the health check endpoint"""
    response = client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert "services" in data


def test_api_test_endpoint():
    """Test the API test endpoint"""
    response = client.get("/api/v1/test")
    assert response.status_code == 200
    data = response.json()
    assert data["message"] == "API is working!"
    assert data["endpoint"] == "test"


def test_docs_available():
    """Test that API documentation is available"""
    response = client.get("/docs")
    assert response.status_code == 200
    
    response = client.get("/redoc")
    assert response.status_code == 200 