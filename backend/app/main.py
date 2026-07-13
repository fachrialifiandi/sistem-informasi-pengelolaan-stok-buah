import logging
import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from app.api.v1.endpoints.auth import router as auth_router
from app.api.v1.endpoints.fruits import router as fruits_router
from app.api.v1.endpoints.suppliers import router as suppliers_router
from app.api.v1.endpoints.transactions import router as transactions_router
from app.api.v1.endpoints.stats import router as stats_router

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
    handlers=[
        logging.StreamHandler()
    ]
)
logger = logging.getLogger(__name__)

app = FastAPI(
    title="Sistem Informasi Pengelolaan Stok Buah - Fresh Vitality",
    description="Backend API for managing fresh fruits inventory and sales transactions",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# Ensure static uploads folder exists
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
static_dir = os.path.join(BASE_DIR, "static")
uploads_dir = os.path.join(static_dir, "uploads")
os.makedirs(uploads_dir, exist_ok=True)

# Mount static directory to serve uploaded images
app.mount("/static", StaticFiles(directory=static_dir), name="static")

# CORS configuration to allow local development with Expo
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify the allowed origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API Routers
app.include_router(auth_router, prefix="/api/v1/auth", tags=["Authentication"])
app.include_router(fruits_router, prefix="/api/v1/fruits", tags=["Fruits Inventory"])
app.include_router(suppliers_router, prefix="/api/v1/suppliers", tags=["Suppliers"])
app.include_router(transactions_router, prefix="/api/v1/transactions", tags=["Transactions"])
app.include_router(stats_router, prefix="/api/v1/stats", tags=["Statistics Dashboard"])

@app.get("/")
def root():
    return {"message": "Fresh Vitality Stock Management System API is running."}
