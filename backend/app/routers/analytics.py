from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import Animal

router = APIRouter(
    prefix="/api/v1/analytics",
    tags=["Analytics"]
)

@router.get("/{farm_id}")
def analytics(
    farm_id: int,
    db: Session = Depends(get_db)
):

    total = db.query(Animal).filter(
        Animal.farm_id == farm_id
    ).count()

    healthy = db.query(Animal).filter(
        Animal.farm_id == farm_id,
        Animal.status == "Healthy"
    ).count()

    sick = db.query(Animal).filter(
        Animal.farm_id == farm_id,
        Animal.status == "Sick"
    ).count()

    pregnant = db.query(Animal).filter(
        Animal.farm_id == farm_id,
        Animal.pregnancy_status == "Pregnant"
    ).count()

    vaccinated = db.query(Animal).filter(
        Animal.farm_id == farm_id,
        Animal.last_vaccination != "Not Recorded"
    ).count()

    cows = db.query(Animal).filter(
        Animal.farm_id == farm_id,
        Animal.animal_type == "Cow"
    ).count()

    goats = db.query(Animal).filter(
        Animal.farm_id == farm_id,
        Animal.animal_type == "Goat"
    ).count()

    sheep = db.query(Animal).filter(
        Animal.farm_id == farm_id,
        Animal.animal_type == "Sheep"
    ).count()

    high_risk = db.query(Animal).filter(
        Animal.farm_id == farm_id,
        Animal.risk_level == "High"
    ).count()

    medium_risk = db.query(Animal).filter(
        Animal.farm_id == farm_id,
        Animal.risk_level == "Medium"
    ).count()

    low_risk = db.query(Animal).filter(
        Animal.farm_id == farm_id,
        Animal.risk_level == "Low"
    ).count()

    return {
        "total": total,
        "healthy": healthy,
        "sick": sick,
        "pregnant": pregnant,
        "vaccinated": vaccinated,

        "cows": cows,
        "goats": goats,
        "sheep": sheep,

        "high_risk": high_risk,
        "medium_risk": medium_risk,
        "low_risk": low_risk
    }