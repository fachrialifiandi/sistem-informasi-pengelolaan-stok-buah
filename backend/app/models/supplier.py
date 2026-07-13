from sqlalchemy import Column, Integer, String
from app.core.database import Base

class Supplier(Base):
    __tablename__ = "supplier"

    id_supplier = Column(Integer, primary_key=True, index=True)
    nama_supplier = Column(String(255), nullable=False)
    no_telp = Column(String(50), nullable=True)
