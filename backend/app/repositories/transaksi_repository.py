from typing import List, Optional
from datetime import datetime
from sqlalchemy.orm import Session
from app.models.transaksi import Transaksi
from app.models.transaksi_detail import TransaksiDetail

class TransaksiRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_all(self) -> List[Transaksi]:
        """Fetch all transaction logs, ordered by created_at descending."""
        return self.db.query(Transaksi).order_by(Transaksi.created_at.desc()).all()

    def get_by_id(self, id_transaksi: str) -> Optional[Transaksi]:
        """Fetch itemized transaction log by invoice ID."""
        return self.db.query(Transaksi).filter(Transaksi.id_transaksi == id_transaksi).first()

    def create_transaction(
        self,
        id_transaksi: str,
        supplier_name: Optional[str],
        time_str: str,
        date_group: str,
        total_weight: float,
        status: str,
        type: str,
        items: List[dict],
        created_at: Optional[datetime] = None
    ) -> Transaksi:
        """Create transaction log and associated transaction detail items."""
        new_tx = Transaksi(
            id_transaksi=id_transaksi,
            supplier_name=supplier_name,
            time_str=time_str,
            date_group=date_group,
            total_weight=total_weight,
            status=status,
            type=type
        )
        if created_at:
            new_tx.created_at = created_at
            
        self.db.add(new_tx)
        self.db.flush()  # Generate keys to associate details
        
        for item in items:
            detail = TransaksiDetail(
                id_transaksi=id_transaksi,
                nama_buah=item.get("nama_buah"),
                sku=item.get("sku"),
                jumlah=item.get("jumlah"),
                image=item.get("image")
            )
            self.db.add(detail)

        self.db.commit()
        self.db.refresh(new_tx)
        return new_tx
