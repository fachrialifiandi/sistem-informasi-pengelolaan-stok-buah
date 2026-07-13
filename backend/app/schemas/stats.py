from pydantic import BaseModel
from typing import List

class DailyMovementDetail(BaseModel):
    day_abbr: str
    day_num: str
    month: str
    title: str
    desc: str
    stock_in: float
    stock_out: float

class StatsResponse(BaseModel):
    total_stock_in: float
    total_stock_out: float
    movements: List[DailyMovementDetail]
