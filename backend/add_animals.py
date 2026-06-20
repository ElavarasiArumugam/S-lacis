#!/usr/bin/env python3
"""Script to add animals to a farm"""

from app.database import SessionLocal
from app.models import Animal, Farmer

# Get database session
db = SessionLocal()

try:
    # Get the first farm (assuming you have one)
    farmer = db.query(Farmer).first()
    
    if not farmer:
        print("❌ No farm found. Please register a farm first!")
        exit(1)
    
    farm_id = farmer.id
    farm_name = farmer.name
    
    print(f"📍 Adding animals to farm: {farm_name} (ID: {farm_id})")
    
    # Create 2 sheep
    sheep_1 = Animal(
        farm_id=farm_id,
        animal_type="Sheep",
        animal_id="SHEEP001",
        breed="Dorper",
        age=12,
        weight=45,
        gender="Female",
        status="Healthy",
        risk_level="Low",
        pregnancy_status="Not Pregnant"
    )
    
    sheep_2 = Animal(
        farm_id=farm_id,
        animal_type="Sheep",
        animal_id="SHEEP002",
        breed="Merino",
        age=18,
        weight=50,
        gender="Male",
        status="Healthy",
        risk_level="Low",
        pregnancy_status="Not Applicable"
    )
    
    # Create 2 goats
    goat_1 = Animal(
        farm_id=farm_id,
        animal_type="Goat",
        animal_id="GOAT001",
        breed="Boer",
        age=8,
        weight=35,
        gender="Female",
        status="Healthy",
        risk_level="Low",
        pregnancy_status="Pregnant"
    )
    
    goat_2 = Animal(
        farm_id=farm_id,
        animal_type="Goat",
        animal_id="GOAT002",
        breed="Alpine",
        age=24,
        weight=40,
        gender="Female",
        status="Healthy",
        risk_level="Low",
        pregnancy_status="Not Pregnant"
    )
    
    # Add all animals
    db.add(sheep_1)
    db.add(sheep_2)
    db.add(goat_1)
    db.add(goat_2)
    db.commit()
    
    print("✅ Animals added successfully!")
    print(f"\n📊 Added to {farm_name}:")
    print("  - SHEEP001 (Female Dorper, 12 months)")
    print("  - SHEEP002 (Male Merino, 18 months)")
    print("  - GOAT001 (Female Boer, Pregnant, 8 months)")
    print("  - GOAT002 (Female Alpine, 24 months)")
    
except Exception as e:
    print(f"❌ Error: {e}")
    db.rollback()
finally:
    db.close()
