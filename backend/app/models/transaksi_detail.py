from sqlalchemy import Column, Integer, String, Float, ForeignKey
from sqlalchemy.orm import relationship
from app.core.database import Base

class TransaksiDetail(Base):
    __tablename__ = "transaksi_detail"

    id_detail = Column(Integer, primary_key=True, index=True)
    id_transaksi = Column(String(100), ForeignKey("transaksi.id_transaksi", ondelete="CASCADE"), nullable=False)
    nama_buah = Column(String(255), nullable=False)
    sku = Column(String(50), nullable=False)
    jumlah = Column(Float, nullable=False)
    image = Column(String(500), nullable=True)

    # Relationship back to main Transaksi
    transaksi = relationship("Transaksi", back_populates="items")
