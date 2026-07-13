from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import Optional
from datetime import datetime
from app.core.database import get_db
from app.core.deps import get_current_user
from app.models.user import User
from app.models.transaksi import Transaksi
from app.schemas.stats import StatsResponse
from app.api.v1.endpoints.transactions import apply_period_filter

router = APIRouter()

@router.get("/", response_model=StatsResponse)
def get_stats(
    period: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Get aggregated stock metrics (total incoming/outgoing) 
    and daily movements breakdown matching the selected period.
    """
    tx_query = db.query(Transaksi)
    tx_query = apply_period_filter(tx_query, period)
    transactions = tx_query.all()

    total_in = 0.0
    total_out = 0.0
    daily_summary = {}

    for t in transactions:
        # Accumulate metrics
        if t.type == "incoming" and t.status == "Berhasil":
            total_in += t.total_weight
        elif t.type == "outgoing":
            total_out += t.total_weight

        # Group movements daily
        date_key = t.date_group
        if date_key not in daily_summary:
            daily_summary[date_key] = {"in": 0.0, "out": 0.0, "count": 0, "created_at": t.created_at}

        if t.type == "incoming" and t.status == "Berhasil":
            daily_summary[date_key]["in"] += t.total_weight
        elif t.type == "outgoing":
            daily_summary[date_key]["out"] += t.total_weight

        daily_summary[date_key]["count"] += len(t.items) if t.items else 0

    movements = []
    # Dictionaries for Indonesian formatting
    indonesian_days = ["MIN", "SEN", "SEL", "RAB", "KAM", "JUM", "SAB"]
    indonesian_months = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agt", "Sep", "Okt", "Nov", "Des"]

    for date_key, info in daily_summary.items():
        dt = info["created_at"] or datetime.now()
        
        # Determine day index from weekday (0 = Sunday, 6 = Saturday)
        day_idx = int(dt.strftime("%w"))
        day_abbr = indonesian_days[day_idx]
        day_num = dt.strftime("%d")
        month_abbr = indonesian_months[dt.month - 1]

        title = f"Transaksi {date_key}"
        if date_key in ["Hari Ini", "Kemarin"]:
            title = f"Transaksi {date_key}"

        movements.append({
            "day_abbr": day_abbr,
            "day_num": day_num,
            "month": month_abbr,
            "title": title,
            "desc": f"{info['count']} Produk diperbarui",
            "stock_in": round(info["in"], 1),
            "stock_out": round(info["out"], 1)
        })

    return {
        "total_stock_in": round(total_in, 1),
        "total_stock_out": round(total_out, 1),
        "movements": movements
    }
