from typing import Optional
from sqlalchemy.orm import Session
from app.models.user import User

class UserRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_by_email(self, email: str) -> Optional[User]:
        """Fetch user by email address."""
        return self.db.query(User).filter(User.email == email).first()

    def get_by_id(self, id_user: int) -> Optional[User]:
        """Fetch user by their primary key id_user."""
        return self.db.query(User).filter(User.id_user == id_user).first()

    def create_user(self, email: str, name: str, password_hash: str, recovery_key: str) -> User:
        """Create a new user with recovery key."""
        new_user = User(
            email=email,
            nama_user=name,
            password=password_hash,
            recovery_key=recovery_key
        )
        self.db.add(new_user)
        self.db.commit()
        self.db.refresh(new_user)
        return new_user

    def update_password(self, user: User, new_password_hash: str) -> User:
        """Update password for user."""
        user.password = new_password_hash
        self.db.commit()
        self.db.refresh(user)
        return user
