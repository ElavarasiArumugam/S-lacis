from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel

from app.database import get_db
from app.models import HealthRecord, Animal

router = APIRouter(
    prefix="/api/v1/health",
    tags=["Health Records"]
)


class HealthCreate(BaseModel):
    animal_id: int
    disease: str
    symptoms: str
    treatment: str


@router.post("/add")
def add_record(data: HealthCreate, db: Session = Depends(get_db)):

    animal = db.query(Animal).filter(
        Animal.id == data.animal_id
    ).first()

    if not animal:
        raise HTTPException(
            status_code=404,
            detail="Animal not found"
        )

    record = HealthRecord(
        animal_id=data.animal_id,
        disease=data.disease,
        symptoms=data.symptoms,
        treatment=data.treatment,
        status="Under Treatment"
    )

    db.add(record)

    # Automatically update animal health
    animal.status = "Sick"
    animal.risk_level = "High"

    db.commit()

    return {
        "status": "success",
        "message": "Health record added successfully"
    }


@router.get("/{animal_id}")
def get_records(animal_id: int, db: Session = Depends(get_db)):

    records = db.query(HealthRecord).filter(
        HealthRecord.animal_id == animal_id
    ).all()

    return records