from pydantic import BaseModel, Field
from typing import Optional

class FruitBase(BaseModel):
    nama_buah: str
    sku: str
    current_stock: float = 0.0
    unit: str = "kg"
    image: Optional[str] = None

class FruitCreate(FruitBase):
    pass

class FruitUpdate(BaseModel):
    nama_buah: str
    current_stock: float
    image: Optional[str] = None

class FruitResponse(BaseModel):
    id_buah: int
    nama_buah: str
    sku: str
    current_stock: float
    unit: str
    image: Optional[str] = None
    status: str

    class Config:
        from_attributes = True
        # Compatibility for pydantic v1 (orm_mode) and v2
        orm_mode = True
