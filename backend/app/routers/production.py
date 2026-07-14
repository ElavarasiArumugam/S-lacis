from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import Animal

router = APIRouter(
    prefix="/api/v1/production",
    tags=["Production"]
)


@router.get("/{farm_id}")
def production_dashboard(
    farm_id: int,
    db: Session = Depends(get_db)
):

    animals = db.query(Animal).filter(
        Animal.farm_id == farm_id
    ).all()

    production = []

    for animal in animals:

        production_type = ""
        quantity = 0
        unit = ""

        if animal.animal_type.lower() == "cow":
            production_type = "Milk"
            quantity = animal.weight * 0.06
            unit = "Litres/day"

        elif animal.animal_type.lower() == "goat":
            production_type = "Milk"
            quantity = animal.weight * 0.04
            unit = "Litres/day"

        elif animal.animal_type.lower() == "sheep":
            production_type = "Wool"
            quantity = animal.weight * 0.02
            unit = "Kg/month"

        elif animal.animal_type.lower() == "poultry":
            production_type = "Egg"
            quantity = 1
            unit = "Egg/day"

        else:
            production_type = "Unknown"

        production.append({
            "animal_id": animal.animal_id,
            "production_type": production_type,
            "quantity": round(quantity, 2),
            "unit": unit,
            "record_date": "Live",
            "status": animal.status
        })

    return production