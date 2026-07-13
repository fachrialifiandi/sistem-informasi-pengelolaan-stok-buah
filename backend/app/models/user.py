from sqlalchemy import Column, Integer, String
from app.core.database import Base

class User(Base):
    __tablename__ = "user"

    id_user = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, nullable=False, index=True)
    nama_user = Column(String(255), nullable=False)
    password = Column(String(255), nullable=False)
    recovery_key = Column(String(50), nullable=True)
