from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.schemas import FarmRegistration, FarmLogin
from app.database import get_db
from app.models import Farmer

router = APIRouter(prefix="/api/v1/auth", tags=["Authentication"])

@router.post("/register")
def register_farmer(farmer_data: FarmRegistration, db: Session = Depends(get_db)):
    # Check if email already exists
    existing_user = db.query(Farmer).filter(Farmer.email == farmer_data.email).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered to a farm")

    new_farmer = Farmer(
        name=farmer_data.name,
        email=farmer_data.email,
        hashed_password=farmer_data.password, # We will hash this later
        cattle_count=farmer_data.cattle_count,
        sheep_count=farmer_data.sheep_count,
        goat_count=farmer_data.goat_count,
        poultry_count=farmer_data.poultry_count
    )
    
    db.add(new_farmer)
    db.commit()
    db.refresh(new_farmer)
    
    return {
        "status": "success",
        "message": f"Welcome {new_farmer.name}! Profile created with ID: {new_farmer.id}",
        "data": {
            "id": new_farmer.id,
            "email": new_farmer.email
        }
    }

@router.post("/login")
def login_farmer(login_data: FarmLogin, db: Session = Depends(get_db)):
    # Find the user by email
    user = db.query(Farmer).filter(Farmer.email == login_data.email).first()
    
    # Check if user exists and password matches
    if not user or user.hashed_password != login_data.password:
        raise HTTPException(status_code=401, detail="Invalid email or password")
        
    return {
        "status": "success",
        "message": f"Welcome back, {user.name}!",
        "data": {
            "id": user.id,
            "name": user.name,
            "email": user.email
        }
    }