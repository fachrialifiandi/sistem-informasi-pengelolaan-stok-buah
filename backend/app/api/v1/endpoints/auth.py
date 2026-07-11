import logging
from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.schemas.auth import LoginRequest, LoginResponse
from app.services.auth_service import AuthService

# Configure logging
logger = logging.getLogger(__name__)

router = APIRouter()

@router.post("/login", response_model=LoginResponse, status_code=status.HTTP_200_OK)
def login(login_data: LoginRequest, db: Session = Depends(get_db)):
    """
    Authenticate user with username (email) and password.
    Returns access token and user information.
    """
    logger.info(f"Login attempt initiated for user: {login_data.username}")
    
    auth_service = AuthService(db)
    response = auth_service.authenticate(
        username_or_email=login_data.username,
        password=login_data.password
    )
    
    logger.info(f"Login successful for user: {login_data.username}")
    return response
