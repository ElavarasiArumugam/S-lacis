from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from pydantic import BaseModel

from app.database import get_db
from app.models import ProductionRecord

router = APIRouter(
    prefix="/api/v1/production",
    tags=["Production"]
)

class ProductionCreate(BaseModel):
    animal_id: int
    production_type: str
    quantity: float
    record_date: str

@router.post("/add")
def add_production(data: ProductionCreate,
                   db: Session = Depends(get_db)):

    record = ProductionRecord(**data.dict())

    db.add(record)
    db.commit()

    return {"message": "Production saved"}

@router.get("/")
def get_all(db: Session = Depends(get_db)):
    return db.query(ProductionRecord).all()