from sqlalchemy import Column, String, Float, DateTime, func
from sqlalchemy.orm import relationship
from app.core.database import Base

class Transaksi(Base):
    __tablename__ = "transaksi"

    id_transaksi = Column(String(100), primary_key=True, index=True)
    supplier_name = Column(String(255), nullable=True)
    time_str = Column(String(50), nullable=False)
    date_group = Column(String(100), nullable=False)
    total_weight = Column(Float, default=0.0)
    status = Column(String(50), nullable=False)  # "Berhasil" / "Diproses"
    type = Column(String(50), nullable=False)    # "incoming" / "outgoing"
    created_at = Column(DateTime, default=func.now())

    # Relationship with item detail list
    items = relationship("TransaksiDetail", back_populates="transaksi", cascade="all, delete-orphan")
