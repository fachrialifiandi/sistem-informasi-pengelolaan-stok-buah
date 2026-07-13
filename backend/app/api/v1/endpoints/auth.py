import logging
import random
import string
from fastapi import APIRouter, Depends, status, HTTPException, Request
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.schemas.auth import LoginRequest, LoginResponse, RegisterRequest, RegisterResponse, ForgotPasswordRequest
from app.services.auth_service import AuthService
from app.repositories.user_repository import UserRepository
from app.core.security import hash_password

logger = logging.getLogger(__name__)
router = APIRouter()

def generate_recovery_key() -> str:
    """Generate a random 8-character alphanumeric recovery key."""
    chars = string.ascii_uppercase + string.digits
    return "".join(random.choices(chars, k=8))

@router.post("/login", response_model=LoginResponse, status_code=status.HTTP_200_OK)
async def login(request: Request, db: Session = Depends(get_db)):
    """
    Authenticate user. Supports JSON body (React Native) 
    and Form URL-Encoded body (FastAPI Swagger Authorize button).
    """
    content_type = request.headers.get("content-type", "")
    if "application/x-www-form-urlencoded" in content_type:
        form_data = await request.form()
        username = form_data.get("username")
        password = form_data.get("password")
    else:
        try:
            json_data = await request.json()
            username = json_data.get("username")
            password = json_data.get("password")
        except Exception:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Request body tidak valid."
            )

    if not username or not password:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Username/email dan password wajib diisi."
        )

    logger.info(f"Login attempt initiated for user: {username}")
    auth_service = AuthService(db)
    response = auth_service.authenticate(
        username_or_email=username,
        password=password
    )
    logger.info(f"Login successful for user: {username}")
    return response

@router.post("/register", response_model=RegisterResponse, status_code=status.HTTP_201_CREATED)
def register(register_data: RegisterRequest, db: Session = Depends(get_db)):
    """
    Create a new account.
    Generates a secure 8-character recovery key and returns it.
    """
    logger.info(f"Registration request for email: {register_data.email}")
    user_repo = UserRepository(db)
    
    # Check if user already exists
    existing_user = user_repo.get_by_email(register_data.email)
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email sudah terdaftar."
        )
        
    recovery_key = generate_recovery_key()
    hashed_pwd = hash_password(register_data.password)
    
    user = user_repo.create_user(
        email=register_data.email,
        name=register_data.fullName,
        password_hash=hashed_pwd,
        recovery_key=recovery_key
    )
    
    logger.info(f"Registration successful for user: {user.email}")
    return {
        "email": user.email,
        "fullName": user.nama_user,
        "recoveryKey": recovery_key
    }

@router.post("/forgot-password", status_code=status.HTTP_200_OK)
def forgot_password(recovery_data: ForgotPasswordRequest, db: Session = Depends(get_db)):
    """
    Reset password using email and recovery key.
    """
    logger.info(f"Password reset request initiated for email: {recovery_data.email}")
    user_repo = UserRepository(db)
    
    user = user_repo.get_by_email(recovery_data.email)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Email tidak ditemukan."
        )
        
    # Compare recovery key case-insensitively or exactly
    if not user.recovery_key or user.recovery_key.upper() != recovery_data.recoveryKey.upper():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Recovery key tidak valid."
        )
        
    # Update password
    hashed_pwd = hash_password(recovery_data.newPassword)
    user_repo.update_password(user, hashed_pwd)
    
    logger.info(f"Password successfully reset for user: {user.email}")
    return {"message": "Password berhasil diatur ulang."}
