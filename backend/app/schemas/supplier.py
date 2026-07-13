from pydantic import BaseModel
from typing import Optional

class SupplierResponse(BaseModel):
    id_supplier: int
    nama_supplier: str
    no_telp: Optional[str] = None

    class Config:
        from_attributes = True
        orm_mode = True
