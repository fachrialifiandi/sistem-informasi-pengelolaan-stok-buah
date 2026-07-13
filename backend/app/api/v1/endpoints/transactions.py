from fastapi import APIRouter, Depends, status, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import extract
from datetime import datetime, timedelta, timezone
from typing import Optional
from app.core.database import get_db
from app.core.deps import get_current_user
from app.models.user import User
from app.models.transaksi import Transaksi
from app.schemas.transaksi import RestockRequest, StockOutRequest, TransactionResponse
from app.repositories.transaksi_repository import TransaksiRepository
from app.repositories.buah_repository import BuahRepository
from app.repositories.supplier_repository import SupplierRepository
import random

router = APIRouter()

def apply_period_filter(query, period: str):
    if not period:
        return query
    now = datetime.now()
    if period == "7_hari":
        seven_days_ago = now - timedelta(days=7)
        return query.filter(Transaksi.created_at >= seven_days_ago)
    elif period == "30_hari":
        thirty_days_ago = now - timedelta(days=30)
        return query.filter(Transaksi.created_at >= thirty_days_ago)
    elif period == "bulan_ini":
        return query.filter(
            extract('month', Transaksi.created_at) == now.month,
            extract('year', Transaksi.created_at) == now.year
        )
    elif period == "bulan_lalu":
        prev_month = 12 if now.month == 1 else now.month - 1
        prev_year = now.year - 1 if now.month == 1 else now.year
        return query.filter(
            extract('month', Transaksi.created_at) == prev_month,
            extract('year', Transaksi.created_at) == prev_year
        )
    return query

@router.get("/", response_model=list[TransactionResponse])
def get_transactions(
    period: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Fetch all transaction logs, optional filtering by period."""
    query = db.query(Transaksi)
    query = apply_period_filter(query, period)
    transactions = query.order_by(Transaksi.created_at.desc()).all()
    return transactions

@router.get("/{id_transaksi}", response_model=TransactionResponse)
def get_transaction_detail(
    id_transaksi: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get single transaction detail by ID."""
    tx_repo = TransaksiRepository(db)
    tx = tx_repo.get_by_id(id_transaksi)
    if not tx:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Transaksi tidak ditemukan."
        )
    return tx

@router.post("/restock", status_code=status.HTTP_201_CREATED)
def post_restock(
    payload: RestockRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Confirm restock (incoming stock) for a supplier.
    Increments inventory levels and writes transaction log.
    """
    supplier_repo = SupplierRepository(db)
    fruit_repo = BuahRepository(db)
    tx_repo = TransaksiRepository(db)

    # Verify supplier
    supplier = supplier_repo.get_by_id(payload.id_supplier)
    if not supplier:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Pemasok tidak ditemukan."
        )

    # Perform stock increments and log details
    items_to_log = []
    total_weight = 0.0

    for item in payload.items:
        fruit = fruit_repo.get_by_id(item.id_buah)
        if not fruit:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Buah dengan ID {item.id_buah} tidak ditemukan."
            )
        
        # Increment stock
        new_stock = fruit.current_stock + item.jumlah
        fruit_repo.update_fruit(fruit, fruit.nama_buah, new_stock)

        total_weight += item.jumlah
        items_to_log.append({
            "nama_buah": fruit.nama_buah,
            "sku": fruit.sku,
            "jumlah": item.jumlah,
            "image": fruit.image
        })

    # Log transaction
    now = datetime.now(timezone(timedelta(hours=7)))
    tx_id = f"TRX-FV-{now.strftime('%Y%m%d')}-{random.randint(100, 999)}"
    tx_repo.create_transaction(
        id_transaksi=tx_id,
        supplier_name=supplier.nama_supplier,
        time_str=now.strftime("%H:%M WIB"),
        date_group="Hari Ini",
        total_weight=total_weight,
        status="Berhasil",
        type="incoming",
        items=items_to_log
    )

    return {"success": True, "message": "Restok berhasil dikonfirmasi!"}

@router.post("/stock-out", status_code=status.HTTP_201_CREATED)
def post_stock_out(
    payload: StockOutRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Record outgoing stock (reduces stock and creates transaction history log).
    """
    fruit_repo = BuahRepository(db)
    tx_repo = TransaksiRepository(db)

    # Validate stock levels
    for item in payload.items:
        fruit = fruit_repo.get_by_id(item.id_buah)
        if not fruit:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Buah dengan ID {item.id_buah} tidak ditemukan."
            )
        if fruit.current_stock < item.jumlah:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Stok buah '{fruit.nama_buah}' tidak mencukupi untuk pengurangan ini."
            )

    # Perform stock decrements and log details
    items_to_log = []
    total_weight = 0.0

    for item in payload.items:
        fruit = fruit_repo.get_by_id(item.id_buah)
        new_stock = fruit.current_stock - item.jumlah
        fruit_repo.update_fruit(fruit, fruit.nama_buah, new_stock)

        total_weight += item.jumlah
        items_to_log.append({
            "nama_buah": fruit.nama_buah,
            "sku": fruit.sku,
            "jumlah": item.jumlah,
            "image": fruit.image
        })

    # Log transaction
    now = datetime.now(timezone(timedelta(hours=7)))
    tx_id = f"TRX-FV-{now.strftime('%Y%m%d')}-{random.randint(100, 999)}"
    
    supplier_name = "Penjualan Grosir"
    if payload.reason == "dibeli":
        supplier_name = f"Penjualan - {payload.notes}" if payload.notes else "Penjualan Grosir"
    elif payload.reason == "dibuang":
        supplier_name = f"Pencatatan Rusak - {payload.notes}" if payload.notes else "Produk Rusak / Busuk"

    tx_repo.create_transaction(
        id_transaksi=tx_id,
        supplier_name=supplier_name,
        time_str=now.strftime("%H:%M WIB"),
        date_group="Hari Ini",
        total_weight=total_weight,
        status="Berhasil",
        type="outgoing",
        items=items_to_log
    )

    return {"success": True, "message": "Pengeluaran stok berhasil dicatat!"}
