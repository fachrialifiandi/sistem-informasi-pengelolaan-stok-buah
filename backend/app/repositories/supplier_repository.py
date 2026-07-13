from typing import List, Optional
from sqlalchemy.orm import Session
from app.models.supplier import Supplier

class SupplierRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_all(self) -> List[Supplier]:
        """Fetch all suppliers ordered by name."""
        return self.db.query(Supplier).order_by(Supplier.nama_supplier.asc()).all()

    def get_by_id(self, id_supplier: int) -> Optional[Supplier]:
        """Fetch supplier by id."""
        return self.db.query(Supplier).filter(Supplier.id_supplier == id_supplier).first()
