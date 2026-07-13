from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.deps import get_current_user
from app.models.user import User
from app.schemas.supplier import SupplierResponse
from app.repositories.supplier_repository import SupplierRepository

router = APIRouter()

@router.get("/", response_model=list[SupplierResponse])
def get_suppliers(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    """Fetch list of active suppliers."""
    supplier_repo = SupplierRepository(db)
    return supplier_repo.get_all()
