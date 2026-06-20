from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey
from sqlalchemy.sql import func
from app.database import Base

class Farmer(Base):
    __tablename__ = "farmers"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    cattle_count = Column(Integer, default=0)
    sheep_count = Column(Integer, default=0)
    goat_count = Column(Integer, default=0)
    poultry_count = Column(Integer, default=0)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class Animal(Base):
    __tablename__ = "animals"

    id = Column(Integer, primary_key=True, index=True)
    farm_id = Column(Integer, ForeignKey("farmers.id"))

    animal_id = Column(String, index=True)
    animal_type = Column(String)
    breed = Column(String)
    gender = Column(String)
    age = Column(Integer)
    weight = Column(Float)

    status = Column(String, default="Healthy")
    risk_level = Column(String, default="Low")
    pregnancy_status = Column(String, default="Unknown")

    vaccine_name = Column(String, default="Not Assigned")  # ADD THIS

    last_vaccination = Column(String, default="Not Recorded")
    next_vaccination = Column(String, default="Not Recorded")
    expected_delivery = Column(String, default="Not Set")
    breeding_date = Column(String, default="Not Set")
    
class HealthRecord(Base):
    __tablename__ = "health_records"

    id = Column(Integer, primary_key=True, index=True)

    animal_id = Column(Integer, ForeignKey("animals.id"))

    disease = Column(String)
    symptoms = Column(String)
    treatment = Column(String)

    status = Column(String, default="Under Treatment")

    created_at = Column(DateTime(timezone=True), server_default=func.now())
class ProductionRecord(Base):
    __tablename__ = "production_records"

    id = Column(Integer, primary_key=True)

    animal_id = Column(Integer)

    production_type = Column(String)

    quantity = Column(Float)

    record_date = Column(String)