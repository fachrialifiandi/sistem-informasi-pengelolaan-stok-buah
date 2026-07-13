from sqlalchemy import Column, Integer, String, Float
from app.core.database import Base

class Buah(Base):
    __tablename__ = "buah"

    id_buah = Column(Integer, primary_key=True, index=True)
    nama_buah = Column(String(255), nullable=False)
    sku = Column(String(50), unique=True, nullable=False, index=True)
    current_stock = Column(Float, default=0.0)
    unit = Column(String(20), default="kg")
    image = Column(String(500), nullable=True)
