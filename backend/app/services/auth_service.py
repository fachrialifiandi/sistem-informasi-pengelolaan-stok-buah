from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from app.repositories.user_repository import UserRepository
from app.core.security import verify_password, create_access_token

class AuthService:
    def __init__(self, db: Session):
        self.user_repo = UserRepository(db)

    def authenticate(self, username_or_email: str, password: str) -> dict:
        """
        Authenticate a user by email and password.
        Returns access token and user information.
        """
        # Retrieve user by email (as the wireframe labels the username as Email Akun)
        user = self.user_repo.get_by_email(username_or_email)
        
        if not user or not verify_password(password, user.password):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,  # API spec: 400 is common or custom. We'll raise standard unauthorized/bad request with specific message
                detail="Invalid username or password."
            )
            
        # Create access token with the user ID as subject
        access_token = create_access_token(subject=user.id_user)
        
        return {
            "access_token": access_token,
            "token_type": "Bearer",
            "user": {
                "id": str(user.id_user),
                "username": user.email,
                "full_name": user.nama_user,
                "role": "pemilik"  # Mapped to Pemilik based on the Context Diagram (Owner)
            }
        }
