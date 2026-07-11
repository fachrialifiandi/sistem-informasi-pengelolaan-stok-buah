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
