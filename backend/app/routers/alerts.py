from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import Animal, HealthRecord 

router = APIRouter(prefix="/api/v1/alerts", tags=["Alerts"])

@router.get("/{farm_id}")
def get_alerts(farm_id: int, db: Session = Depends(get_db)):

    sick_animals = db.query(Animal).filter(
        Animal.farm_id == farm_id,
        Animal.status == "Sick"
    ).all()

    high_risk = db.query(Animal).filter(
        Animal.farm_id == farm_id,
        Animal.risk_level == "High"
    ).all()

    return {
        "sick_animals": len(sick_animals),
        "high_risk": len(high_risk),
        "animals": [
            {
                "animal_id": a.animal_id,
                "status": a.status,
                "risk_level": a.risk_level
            }
            for a in sick_animals + high_risk
        ]
    }