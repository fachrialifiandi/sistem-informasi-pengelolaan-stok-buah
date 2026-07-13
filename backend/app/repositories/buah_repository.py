from typing import List, Optional
from sqlalchemy.orm import Session
from app.models.buah import Buah

class BuahRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_all(self) -> List[Buah]:
        """Fetch all fruits from the database."""
        return self.db.query(Buah).order_by(Buah.id_buah.asc()).all()

    def get_by_id(self, id_buah: int) -> Optional[Buah]:
        """Fetch fruit by primary key."""
        return self.db.query(Buah).filter(Buah.id_buah == id_buah).first()

    def get_by_sku(self, sku: str) -> Optional[Buah]:
        """Fetch fruit by SKU code (unique)."""
        return self.db.query(Buah).filter(Buah.sku == sku).first()

    def get_by_name(self, name: str) -> Optional[Buah]:
        """Fetch fruit by name (unique)."""
        return self.db.query(Buah).filter(Buah.nama_buah == name).first()

    def create_fruit(self, nama_buah: str, sku: str, current_stock: float, unit: str, image: Optional[str]) -> Buah:
        """Create a new fruit entry in inventory."""
        new_fruit = Buah(
            nama_buah=nama_buah,
            sku=sku,
            current_stock=current_stock,
            unit=unit,
            image=image
        )
        self.db.add(new_fruit)
        self.db.commit()
        self.db.refresh(new_fruit)
        return new_fruit

    def update_fruit(self, fruit: Buah, name: str, stock: float, image: Optional[str] = None) -> Buah:
        """Update existing fruit details."""
        fruit.nama_buah = name
        fruit.current_stock = stock
        if image is not None:
            fruit.image = image
        self.db.commit()
        self.db.refresh(fruit)
        return fruit

    def delete_fruit(self, fruit: Buah):
        """Remove fruit from inventory database."""
        self.db.delete(fruit)
        self.db.commit()
