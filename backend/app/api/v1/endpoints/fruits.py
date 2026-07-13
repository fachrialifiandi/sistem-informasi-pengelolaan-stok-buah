from fastapi import APIRouter, Depends, status, HTTPException, File, UploadFile
from sqlalchemy.orm import Session
from datetime import datetime
import os
import shutil
import uuid
import random
from app.core.database import get_db
from app.core.deps import get_current_user
from app.models.user import User
from app.schemas.buah import FruitCreate, FruitResponse, FruitUpdate
from app.repositories.buah_repository import BuahRepository
from app.repositories.transaksi_repository import TransaksiRepository

router = APIRouter()

@router.post("/upload", status_code=status.HTTP_200_OK)
def upload_fruit_image(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user)
):
    """
    Upload a fruit image and return its relative URL.
    """
    # Validate extension
    file_ext = os.path.splitext(file.filename)[1].lower()
    if file_ext not in [".jpg", ".jpeg", ".png", ".webp", ".gif"]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Format file tidak didukung. Harap upload gambar (jpg, jpeg, png, webp, gif)."
        )
        
    # Generate unique filename
    unique_filename = f"{uuid.uuid4().hex}{file_ext}"
    
    # Save directory (backend/app/static/uploads)
    current_dir = os.path.dirname(os.path.abspath(__file__))
    app_dir = os.path.dirname(os.path.dirname(os.path.dirname(current_dir)))
    static_uploads_dir = os.path.join(app_dir, "static", "uploads")
    os.makedirs(static_uploads_dir, exist_ok=True)
    
    file_path = os.path.join(static_uploads_dir, unique_filename)
    
    # Save the file
    try:
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Gagal menyimpan file: {str(e)}"
        )
        
    # Return relative url path
    return {"image_url": f"/static/uploads/{unique_filename}"}

@router.get("/", response_model=list[FruitResponse])
def get_fruits(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    """Get all fruits list with stock level status badges calculated dynamically."""
    fruit_repo = BuahRepository(db)
    fruits = fruit_repo.get_all()
    
    res = []
    for f in fruits:
        status_str = "High Stock"
        if f.current_stock == 0:
            status_str = "Out of Stock"
        elif f.current_stock <= 15:
            status_str = "Low Stock"
            
        res.append({
            "id_buah": f.id_buah,
            "nama_buah": f.nama_buah,
            "sku": f.sku,
            "current_stock": f.current_stock,
            "unit": f.unit,
            "image": f.image,
            "status": status_str
        })
    return res

@router.post("/", response_model=FruitResponse, status_code=status.HTTP_201_CREATED)
def add_fruit(
    fruit_data: FruitCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Add a new fruit to the inventory.
    Automatically logs an incoming transaction log if initial stock is positive.
    """
    fruit_repo = BuahRepository(db)
    tx_repo = TransaksiRepository(db)
    
    # Check if SKU or name already exists
    if fruit_repo.get_by_sku(fruit_data.sku):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="SKU buah sudah terdaftar."
        )
    if fruit_repo.get_by_name(fruit_data.nama_buah):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Nama buah sudah terdaftar."
        )
        
    # Generate random placeholder images if not provided
    img_url = fruit_data.image
    if not img_url:
        random_imgs = [
            "https://lh3.googleusercontent.com/aida-public/AB6AXuDHpe_JJ7C4OIuGDThqvpamj5d4EkRfesi0CovAq9E17c5hx5lQgM8axLulA00je10qF1pXL41UNmYHgRbYniOp02r5UtkzccMAeWv26EDdDyXUd1t73onQzYaX1AfuRfLh8GVyxIGtJg_JT2JUSNTzf60cREAo6a0w54_8I1gPyB9hvlHTikUnWvPuscKYk6Cda1XfjG5sgOrukPDQGzHkqQO6JAJ69nCNrbnLUI48cTauNkokos9r",
            "https://lh3.googleusercontent.com/aida-public/AB6AXuAPcApLrxFvNPvGVQ-vMjePGebTERdjEp5Qip9BJPdnsPVd_tjDfY-i_uFeFSmp9W9puZ8kVldnxbbR3tqPuiJY69mqCFtOsnrfFIgdFUHuFb1tmcrRyYh_B-T_gAyDAGCFC6j1SJRQK9bjYtuTCj3jcXoyEgVXsQlGq25IrmhgIGDsy_8qgH7LNAakNPzbzZ-9vcnl-B7leFyaXICWTAajvfOEXrCg9NV8okDpuJnm4TNCUWsKV4TB"
        ]
        img_url = random.choice(random_imgs)
        
    fruit = fruit_repo.create_fruit(
        nama_buah=fruit_data.nama_buah,
        sku=fruit_data.sku,
        current_stock=fruit_data.current_stock,
        unit=fruit_data.unit,
        image=img_url
    )
    
    # If initial stock > 0, write transaction log
    if fruit.current_stock > 0:
        now = datetime.now()
        tx_id = f"TRX-FV-{now.strftime('%Y%m%d')}-{random.randint(100, 999)}"
        tx_repo.create_transaction(
            id_transaksi=tx_id,
            supplier_name="Stok Awal Tambah Buah",
            time_str=now.strftime("%H:%M WIB"),
            date_group="Hari Ini",
            total_weight=fruit.current_stock,
            status="Berhasil",
            type="incoming",
            items=[{
                "nama_buah": fruit.nama_buah,
                "sku": fruit.sku,
                "jumlah": fruit.current_stock,
                "image": fruit.image
            }]
        )
        
    status_str = "High Stock" if fruit.current_stock > 15 else "Low Stock" if fruit.current_stock > 0 else "Out of Stock"
    return {
        "id_buah": fruit.id_buah,
        "nama_buah": fruit.nama_buah,
        "sku": fruit.sku,
        "current_stock": fruit.current_stock,
        "unit": fruit.unit,
        "image": fruit.image,
        "status": status_str
    }

@router.put("/{id_buah}", response_model=FruitResponse)
def update_fruit(
    id_buah: int,
    fruit_data: FruitUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Update an existing fruit details.
    Logs a manual adjustment transaction if stock changes.
    """
    fruit_repo = BuahRepository(db)
    tx_repo = TransaksiRepository(db)
    
    fruit = fruit_repo.get_by_id(id_buah)
    if not fruit:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Buah tidak ditemukan."
        )
        
    old_stock = fruit.current_stock
    new_stock = fruit_data.current_stock
    diff = new_stock - old_stock
    
    # Perform update
    fruit = fruit_repo.update_fruit(fruit, fruit_data.nama_buah, new_stock, fruit_data.image)
    
    # Write adjustment transaction log if stock changed
    if diff != 0:
        now = datetime.now()
        tx_id = f"TRX-FV-{now.strftime('%Y%m%d')}-{random.randint(100, 999)}"
        tx_repo.create_transaction(
            id_transaksi=tx_id,
            supplier_name="Penyesuaian Manual Stok",
            time_str=now.strftime("%H:%M WIB"),
            date_group="Hari Ini",
            total_weight=abs(diff),
            status="Berhasil",
            type="incoming" if diff > 0 else "outgoing",
            items=[{
                "nama_buah": fruit.nama_buah,
                "sku": fruit.sku,
                "jumlah": abs(diff),
                "image": fruit.image
            }]
        )
        
    status_str = "High Stock" if fruit.current_stock > 15 else "Low Stock" if fruit.current_stock > 0 else "Out of Stock"
    return {
        "id_buah": fruit.id_buah,
        "nama_buah": fruit.nama_buah,
        "sku": fruit.sku,
        "current_stock": fruit.current_stock,
        "unit": fruit.unit,
        "image": fruit.image,
        "status": status_str
    }

@router.delete("/{id_buah}", status_code=status.HTTP_200_OK)
def delete_fruit(
    id_buah: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Delete fruit from inventory.
    Logs an outgoing transaction if there was positive stock being discarded.
    """
    fruit_repo = BuahRepository(db)
    tx_repo = TransaksiRepository(db)
    
    fruit = fruit_repo.get_by_id(id_buah)
    if not fruit:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Buah tidak ditemukan."
        )
        
    # Log transaction for discarded stock
    if fruit.current_stock > 0:
        now = datetime.now()
        tx_id = f"TRX-FV-{now.strftime('%Y%m%d')}-{random.randint(100, 999)}"
        tx_repo.create_transaction(
            id_transaksi=tx_id,
            supplier_name=f"Penghapusan Produk ({fruit.nama_buah})",
            time_str=now.strftime("%H:%M WIB"),
            date_group="Hari Ini",
            total_weight=fruit.current_stock,
            status="Berhasil",
            type="outgoing",
            items=[{
                "nama_buah": fruit.nama_buah,
                "sku": fruit.sku,
                "jumlah": fruit.current_stock,
                "image": fruit.image
            }]
        )
        
    fruit_repo.delete_fruit(fruit)
    return {"message": "Buah berhasil dihapus."}
