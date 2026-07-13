from pydantic import BaseModel
from typing import List, Optional

class RestockItem(BaseModel):
    id_buah: int
    jumlah: float

class RestockRequest(BaseModel):
    id_supplier: int
    items: List[RestockItem]

class StockOutRequest(BaseModel):
    items: List[RestockItem]
    reason: str
    notes: Optional[str] = None

class TransactionItemResponse(BaseModel):
    nama_buah: str
    sku: str
    jumlah: float
    image: Optional[str] = None

    class Config:
        from_attributes = True
        orm_mode = True

class TransactionResponse(BaseModel):
    id_transaksi: str
    supplier_name: Optional[str] = None
    time_str: str
    date_group: str
    total_weight: float
    status: str
    type: str
    items: List[TransactionItemResponse]

    class Config:
        from_attributes = True
        orm_mode = True
