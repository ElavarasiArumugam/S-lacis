from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from app.database import get_db
from app.models import Farmer, Animal
from pydantic import BaseModel

router = APIRouter(prefix="/api/v1/animals", tags=["Animals"])

class AnimalCreate(BaseModel):
    farm_id: int
    animal_id: str
    animal_type: str
    breed: str
    age: int
    weight: float
    gender: str = "Unknown"
    pregnancy_status: str = "Unknown"
    last_vaccination: str = "Not Recorded"


class BreedingUpdate(BaseModel):
    pregnancy_status: str
    breeding_date: str
    expected_delivery: str
@router.put("/breeding/{animal_id}")
def update_breeding(
    animal_id: str,
    data: BreedingUpdate,
    db: Session = Depends(get_db)
):
    animal = db.query(Animal).filter(
        Animal.animal_id == animal_id
    ).first()

    if not animal:
        return {"error": "Animal not found"}

    animal.pregnancy_status = data.pregnancy_status
    animal.breeding_date = data.breeding_date
    animal.expected_delivery = data.expected_delivery

    db.commit()

    return {"message": "Breeding record updated"}
@router.post("/register")
def register_animal(animal: AnimalCreate, db: Session = Depends(get_db)):
    new_animal = Animal(
    farm_id=animal.farm_id,
    animal_id=animal.animal_id,
    animal_type=animal.animal_type,
    breed=animal.breed,
    age=animal.age,
    weight=animal.weight,
    gender=animal.gender,
    pregnancy_status=animal.pregnancy_status,
    last_vaccination=animal.last_vaccination
)
    db.add(new_animal)
    db.commit()
    db.refresh(new_animal)
    return {
        "status": "success",
        "message": f"Profile created for {new_animal.animal_id}"
    }

@router.get("/stats/{farm_id}")
def get_stats(farm_id: int, db: Session = Depends(get_db)):
    farmer = db.query(Farmer).filter(Farmer.id == farm_id).first()

    if not farmer:
        raise HTTPException(status_code=404, detail="Farm not found")

    total_herd = (
        farmer.cattle_count +
        farmer.sheep_count +
        farmer.goat_count +
        farmer.poultry_count
    )

    at_risk = db.query(Animal).filter(
        Animal.farm_id == farm_id,
        Animal.status == "Sick"
    ).count()

    vaccines = db.query(Animal).filter(
        Animal.farm_id == farm_id,
        Animal.next_vaccination != "Not Recorded"
    ).count()

    return {
        "total_herd": total_herd,
        "at_risk": at_risk,
        "vaccines": vaccines
    }



# ===========================
# NEW API 2
# ===========================

@router.get("/{animal_id}")
def get_animal(animal_id: int, db: Session = Depends(get_db)):
    animal = db.query(Animal).filter(
        Animal.id == animal_id
    ).first()

    if not animal:
        raise HTTPException(status_code=404, detail="Animal not found")

    return animal
@router.post("/vaccinate")
def vaccinate(
    animal_id: int,
    vaccine_name: str,
    next_date: str,
    db: Session = Depends(get_db)
):

    animal = db.query(Animal).filter(
        Animal.id == animal_id
    ).first()

    if not animal:
        raise HTTPException(
            status_code=404,
            detail="Animal not found"
        )

    # Update vaccination info
    animal.vaccine_name = vaccine_name
    animal.last_vaccination = vaccine_name
    animal.next_vaccination = next_date

    # Vaccinated animals are assumed healthy
    animal.status = "Healthy"
    animal.risk_level = "Low"

    db.commit()

    return {
        "status": "success",
        "message": "Vaccination updated successfully"
    }

@router.get("/farm/{farm_id}")
def farm_animals(
    farm_id:int,
    db: Session = Depends(get_db)
):

    animals = db.query(Animal)\
        .filter(Animal.farm_id == farm_id)\
        .all()

    return animals