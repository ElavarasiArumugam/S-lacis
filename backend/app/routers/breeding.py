from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from pydantic import BaseModel

from app.database import get_db
from app.models import Animal

router = APIRouter(
    prefix="/api/v1/breeding",
    tags=["Breeding"]
)

class BreedingUpdate(BaseModel):
    animal_id: int
    breeding_date: str
    expected_delivery: str
    pregnancy_status: str

@router.post("/update")
def update_breeding(data: BreedingUpdate, db: Session = Depends(get_db)):

    animal = db.query(Animal).filter(
        Animal.id == data.animal_id
    ).first()

    if animal:
        animal.breeding_date = data.breeding_date
        animal.expected_delivery = data.expected_delivery
        animal.pregnancy_status = data.pregnancy_status

        db.commit()

    return {"message": "Breeding data updated"}

@router.get("/{farm_id}")
def get_breeding_animals(farm_id: int, db: Session = Depends(get_db)):

    animals = db.query(Animal).filter(
        Animal.farm_id == farm_id,
        Animal.gender == "Female"
    ).all()

    return animals