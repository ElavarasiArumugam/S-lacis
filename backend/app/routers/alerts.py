from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import Animal, HealthRecord

router = APIRouter(
    prefix="/api/v1/alerts",
    tags=["Alerts"]
)


@router.get("/{farm_id}")
def get_alerts(farm_id: int, db: Session = Depends(get_db)):

    sick_animals = db.query(Animal).filter(
        Animal.farm_id == farm_id,
        Animal.status == "Sick"
    ).all()

    alerts = []

    for animal in sick_animals:

        latest_record = db.query(HealthRecord).filter(
            HealthRecord.animal_id == animal.id
        ).order_by(
            HealthRecord.id.desc()
        ).first()

        alerts.append({
            "animal_id": animal.animal_id,
            "status": animal.status,
            "risk_level": animal.risk_level,
            "disease": latest_record.disease if latest_record else "Unknown",
            "symptoms": latest_record.symptoms if latest_record else "Unknown",
            "treatment": latest_record.treatment if latest_record else "Unknown"
        })

    return {
        "sick_animals": len(sick_animals),
        "high_risk": len(sick_animals),
        "animals": alerts
    }