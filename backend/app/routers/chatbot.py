from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import httpx
import re
import json
from sqlalchemy.orm import Session
from fastapi import Depends
from app.database import get_db
from app.models import Animal, Farmer

router = APIRouter(prefix="/api/v1/chat", tags=["Chatbot"])

# Home Remedies Knowledge Base with Cure Duration
HOME_REMEDIES = {
    "cough": {
        "conditions": ["respiratory", "cold", "cough", "congestion"],
        "remedies": [
            "Mix ginger and turmeric with warm water - give twice daily",
            "Add honey to warm milk and feed - helps soothe throat",
            "Use steam inhalation with eucalyptus oil",
            "Provide good ventilation in the shelter",
            "Keep animal warm and dry",
            "Monitor for worsening symptoms - consult vet if persists"
        ],
        "severity": "Medium",
        "cure_days": "5-7",
        "medicine": "Enrofloxacin 50-100mg/kg for severe cases"
    },
    "diarrhea": {
        "conditions": ["diarrhea", "loose motion", "digestive", "upset stomach"],
        "remedies": [
            "Give ORS (Oral Rehydration Solution) - 1 part salt, 1 part sugar in water",
            "Feed rice bran or boiled rice - helps solidify stool",
            "Add probiotics (yogurt) to feed",
            "Provide green fodder and easy to digest food",
            "Restrict water initially, then give small amounts frequently",
            "Watch for dehydration - contact vet if worsens"
        ],
        "severity": "Medium",
        "cure_days": "3-5",
        "medicine": "Furazolidone 4-6mg/kg twice daily or Metronidazole"
    },
    "lameness": {
        "conditions": ["lameness", "limping", "foot problem", "unable to walk"],
        "remedies": [
            "Inspect hooves for wounds or stones - remove if present",
            "Soak affected foot in salt water (warm) for 15-20 minutes daily",
            "Apply turmeric paste on wounds",
            "Restrict movement and provide comfortable bedding",
            "Give anti-inflammatory feed (include neem)",
            "If not improving in 2-3 days, seek veterinary help"
        ],
        "severity": "High",
        "cure_days": "7-14",
        "medicine": "Phenylbutazone 2-4mg/kg or Meloxicam 0.5mg/kg daily"
    },
    "reduced appetite": {
        "conditions": ["not eating", "reduced appetite", "anorexia", "low feed intake"],
        "remedies": [
            "Check for mouth ulcers or dental problems",
            "Offer tempting fresh green fodder",
            "Provide mineral mixture - may indicate deficiency",
            "Add jaggery to water to improve taste",
            "Ensure clean water is always available",
            "If appetite doesn't return in 24 hours, consult vet"
        ],
        "severity": "High",
        "cure_days": "2-4",
        "medicine": "Vitamin B-complex + minerals, consult vet for underlying cause"
    },
    "fever": {
        "conditions": ["fever", "high temperature", "heat", "burning"],
        "remedies": [
            "Give cooling herbs - neem leaves or tulsi",
            "Provide plenty of water with electrolytes",
            "Apply cold compress on forehead and ears",
            "Bathe with lukewarm water if possible",
            "Avoid strenuous activity",
            "If fever persists beyond 24 hours, seek professional help"
        ],
        "severity": "High",
        "cure_days": "3-7",
        "medicine": "Paracetamol 10-15mg/kg or Aspirin 10mg/kg twice daily"
    },
    "bloat": {
        "conditions": ["bloat", "distended", "swollen belly", "gas", "distension"],
        "remedies": [
            "Give cooking oil (100-200ml) - helps release trapped gas",
            "Walk the animal slowly to stimulate digestion",
            "Avoid fresh wet grass - feed dry fodder",
            "Massage the abdomen gently",
            "Provide probiotics to improve digestion",
            "If severe, immediate veterinary care is needed"
        ],
        "severity": "Critical",
        "cure_days": "1-2",
        "medicine": "Simethicone or activated charcoal, may need vet intervention"
    },
    "mastitis": {
        "conditions": ["mastitis", "swollen udder", "painful udder", "milk fever"],
        "remedies": [
            "Warm compress on udder - 15 min, 3-4 times daily",
            "Massage with turmeric-oil paste",
            "Milk frequently to relieve pressure",
            "Feed easily digestible green fodder",
            "Ensure proper hygiene during milking",
            "Consult vet for antibiotics if pus appears"
        ],
        "severity": "High",
        "cure_days": "7-10",
        "medicine": "Intramammary antibiotics (Amoxicillin/Clavulanic acid) + systemic antibiotics"
    },
    "wound": {
        "conditions": ["wound", "cut", "injury", "bleeding", "laceration"],
        "remedies": [
            "Clean wound with clean water",
            "Apply turmeric powder to stop bleeding",
            "Use neem paste as natural antiseptic",
            "Wrap with clean cloth if still bleeding",
            "Change dressing daily",
            "Watch for infection - seek help if swelling increases"
        ],
        "severity": "Medium",
        "cure_days": "7-14",
        "medicine": "Povidone-iodine solution for cleaning, antibiotic ointment"
    },
    "pregnancy": {
        "conditions": ["pregnancy", "pregnant", "delivery", "calving", "lambing", "kidding"],
        "remedies": [
            "Provide balanced nutrition with extra calcium and phosphorus",
            "Ensure shelter from extreme weather",
            "Keep animal calm and stress-free",
            "Provide clean water 24/7",
            "Monitor closely in last month for signs of labor",
            "Have vet on standby for delivery complications"
        ],
        "severity": "High",
        "cure_days": "280 (gestation period)",
        "medicine": "Vitamin + mineral supplements, calcium booster near delivery"
    }
}

class ChatMessage(BaseModel):
    farm_id: int
    message: str
    animal_id: str = None

def detect_sick_animal_and_remedy(message: str) -> tuple:
    """Detect illness in message and suggest remedy"""
    message_lower = message.lower()
    
    detected_remedy = None
    detected_illness = None
    
    for illness, details in HOME_REMEDIES.items():
        for condition in details["conditions"]:
            if condition in message_lower:
                detected_remedy = details
                detected_illness = illness
                break
        if detected_remedy:
            break
    
    return detected_illness, detected_remedy

def mark_animal_as_sick(farm_id: int, animal_id: str, db: Session):
    """Mark animal as sick in the database"""
    try:
        animal = db.query(Animal).filter(
            Animal.farm_id == farm_id,
            Animal.animal_id == animal_id
        ).first()
        
        if animal:
            animal.status = "Sick"
            animal.risk_level = "High"
            db.commit()
            return True
    except:
        pass
    return False

def extract_animal_id(message: str, farm_context: dict) -> str:
    """Extract animal ID from message"""
    message_upper = message.upper()
    animals = farm_context.get('animals', {}).get('by_type', {})
    
    for animal_type, animal_list in animals.items():
        for animal in animal_list:
            animal_id = animal['id']
            if animal_id in message_upper:
                return animal_id
    
    return None

def get_farm_context(farm_id: int, db: Session) -> dict:
    """Fetch farm and animal data for context"""
    farmer = db.query(Farmer).filter(Farmer.id == farm_id).first()
    if not farmer:
        return {}
    
    animals = db.query(Animal).filter(Animal.farm_id == farm_id).all()
    
    animal_summary = {
        "total_animals": len(animals),
        "by_type": {},
        "health_status": {}
    }
    
    for animal in animals:
        animal_type = animal.animal_type
        if animal_type not in animal_summary["by_type"]:
            animal_summary["by_type"][animal_type] = []
        
        animal_summary["by_type"][animal_type].append({
            "id": animal.animal_id,
            "breed": animal.breed,
            "age": animal.age,
            "weight": animal.weight,
            "status": animal.status,
            "pregnancy_status": getattr(animal, 'pregnancy_status', 'N/A'),
            "next_vaccination": getattr(animal, 'next_vaccination', 'Not Recorded')
        })
        
        if animal.status not in animal_summary["health_status"]:
            animal_summary["health_status"][animal.status] = 0
        animal_summary["health_status"][animal.status] += 1
    
    return {
        "farm_name": farmer.name,
        "animals": animal_summary,
        "cattle_registered": farmer.cattle_count,
        "sheep_registered": farmer.sheep_count,
        "goat_registered": farmer.goat_count,
        "poultry_registered": farmer.poultry_count
    }

def generate_personalized_vaccination_response(farm_context: dict) -> str:
    """Generate farm-specific vaccination recommendations"""
    farm_name = farm_context.get('farm_name', 'Your Farm')
    animals_by_type = farm_context.get('animals', {}).get('by_type', {})
    
    response = f"🏥 **VACCINATION SCHEDULE FOR {farm_name.upper()}**\n\n"
    
    # Cattle vaccination schedule
    if 'Cow' in animals_by_type or 'cattle' in farm_context:
        cattle_count = farm_context.get('cattle_registered', 0)
        response += f"🐄 **CATTLE ({cattle_count} registered):**\n"
        response += "- Birth: First vaccination dose\n"
        response += "- 1 month: Booster dose\n"
        response += "- 3 months: Deworming\n"
        response += "- 6 months: Vaccination\n"
        response += "- Every 12 months: Annual booster\n\n"
    
    # Sheep vaccination schedule
    if 'Sheep' in animals_by_type or farm_context.get('sheep_registered', 0) > 0:
        sheep_count = farm_context.get('sheep_registered', 0)
        response += f"🐑 **SHEEP ({sheep_count} registered):**\n"
        response += "- 1-2 months: First dose\n"
        response += "- 3-4 months: Booster\n"
        response += "- Every 6 months: Deworming\n"
        response += "- Every 12 months: Annual booster\n\n"
    
    # Goat vaccination schedule
    if 'Goat' in animals_by_type or farm_context.get('goat_registered', 0) > 0:
        goat_count = farm_context.get('goat_registered', 0)
        response += f"🐐 **GOATS ({goat_count} registered):**\n"
        response += "- 1-2 months: First dose\n"
        response += "- 3-4 months: Booster\n"
        response += "- Every 6 months: Deworming\n"
        response += "- Every 12 months: Annual booster\n\n"
    
    # Poultry vaccination schedule
    if 'Poultry' in animals_by_type or farm_context.get('poultry_registered', 0) > 0:
        poultry_count = farm_context.get('poultry_registered', 0)
        response += f"🐔 **POULTRY ({poultry_count} registered):**\n"
        response += "- 1 week: Vaccination\n"
        response += "- 3 weeks: Booster\n"
        response += "- Every 6 months: Revaccination\n\n"
    
    response += "⚠️  **NOTE:** Keep vaccination records updated and schedule regular check-ups with your veterinarian."
    return response

def generate_chatbot_response(message: str, farm_context: dict, db: Session = None, farm_id: int = None) -> str:
    """Generate response with home remedies and sick animal detection - FARM SPECIFIC"""
    
    # Detect illness and get remedy
    illness, remedy_details = detect_sick_animal_and_remedy(message)
    
    # Try to extract animal ID
    animal_id = extract_animal_id(message, farm_context)
    
    # If animal is sick and we have animal ID, mark it in database
    if illness and animal_id and db and farm_id:
        mark_animal_as_sick(farm_id, animal_id, db)
    
    message_lower = message.lower()
    farm_name = farm_context.get('farm_name', 'Your Farm')
    animals_summary = farm_context.get('animals', {})
    total_animals = animals_summary.get('total_animals', 0)
    health_status = animals_summary.get('health_status', {})
    
    # Build response
    if remedy_details:
        response = f"**DETECTED: {illness.upper()} - SEVERITY: {remedy_details['severity']}**\n\n"
        response += f"⏱️ **Expected Cure Duration:** {remedy_details['cure_days']} days\n"
        response += f"💊 **Recommended Medicine:** {remedy_details['medicine']}\n\n"
        
        if animal_id:
            response += f"✅ **Status Update:** Animal {animal_id} has been marked as SICK in your farm records.\n\n"
        
        response += "**HOME REMEDIES & CARE RECOMMENDATIONS:**\n\n"
        
        for i, remedy in enumerate(remedy_details["remedies"], 1):
            response += f"{i}. {remedy}\n"
        
        response += f"\n**SEVERITY LEVEL: {remedy_details['severity']}**\n"
        
        if remedy_details['severity'] in ['High', 'Critical']:
            response += "\n⚠️  This is a serious condition. If home remedies don't improve the animal's condition within 24-48 hours, **CONSULT A VETERINARIAN IMMEDIATELY**."
        
        return response
    
    # Greeting with farm-specific info
    if any(word in message_lower for word in ["hello", "hi", "how are you", "what can you do", "introduction"]):
        response = f"👋 Hello! I'm S-LACIS, your AI Farm Assistant for **{farm_name}**.\n\n"
        response += f"📊 **Your Farm Status:**\n"
        response += f"- Total Animals: {total_animals}\n"
        
        # Show breakdown by type
        animals_by_type = animals_summary.get('by_type', {})
        for animal_type, animals_list in animals_by_type.items():
            response += f"- {animal_type}: {len(animals_list)}\n"
        
        # Show health status
        if health_status:
            response += f"\n**Health Status:**\n"
            for status, count in health_status.items():
                response += f"- {status}: {count}\n"
        
        response += f"\n**I can help you with:**\n"
        response += "1. 🏥 **DISEASE DETECTION** - Describe your animal's symptoms (cough, diarrhea, lameness, etc.)\n"
        response += "2. 💊 **HOME REMEDIES** - Get traditional care and treatment suggestions\n"
        response += "3. 💉 **VACCINATION GUIDANCE** - Ask 'Which animals need vaccination?'\n"
        response += "4. 🚨 **EMERGENCY SUPPORT** - Identify critical situations\n"
        response += "5. 🌾 **FARM MANAGEMENT** - Feeding, care, and housing advice\n\n"
        response += "What would you like help with today?"
        
        return response
    
    # Vaccination - provide personalized response
    elif any(word in message_lower for word in ["vaccination", "vaccinate", "vaccine", "when to vaccinate", "which animals"]):
        return generate_personalized_vaccination_response(farm_context)
    
    # Care and feeding - farm-specific
    elif any(word in message_lower for word in ["care", "feeding", "food", "diet", "how to feed"]):
        response = f"🌾 **LIVESTOCK CARE & FEEDING FOR {farm_name}**\n\n"
        
        animals_by_type = animals_summary.get('by_type', {})
        
        if 'Cow' in animals_by_type or animals_by_type.get('Cow'):
            response += "🐄 **CATTLE (Daily)**\n"
            response += "- Green fodder: 20-30 kg\n"
            response += "- Concentrate: 2-4 kg (based on milk production)\n"
            response += "- Water: 40-60 liters\n"
            response += "- Minerals: Salt and mineral mixture\n\n"
        
        if 'Sheep' in animals_by_type or animals_by_type.get('Sheep'):
            response += "🐑 **SHEEP (Daily)**\n"
            response += "- Green fodder: 3-5 kg\n"
            response += "- Dry fodder: 1-2 kg\n"
            response += "- Concentrate: 0.5-1 kg\n"
            response += "- Water: 4-6 liters\n\n"
        
        if 'Goat' in animals_by_type or animals_by_type.get('Goat'):
            response += "🐐 **GOATS (Daily)**\n"
            response += "- Green fodder: 3-5 kg\n"
            response += "- Dry fodder: 1-2 kg\n"
            response += "- Concentrate: 0.5-1 kg\n"
            response += "- Water: 4-6 liters\n\n"
        
        if 'Poultry' in animals_by_type or animals_by_type.get('Poultry'):
            response += "🐔 **POULTRY (Daily)**\n"
            response += "- Feed: 100-150g per bird\n"
            response += "- Water: Available all day\n"
            response += "- Greens: 20-30g per bird\n\n"
        
        response += "**HOUSING REQUIREMENTS:**\n"
        response += "- Good ventilation\n"
        response += "- Clean, dry bedding\n"
        response += "- Protection from extreme weather\n"
        response += "- Adequate space per animal\n"
        
        return response
    
    # General farm health
    elif any(word in message_lower for word in ["status", "animals", "herd", "farm health", "how many"]):
        response = f"📊 **FARM STATUS - {farm_name}**\n\n"
        response += f"**Total Animals:** {total_animals}\n\n"
        
        animals_by_type = animals_summary.get('by_type', {})
        if animals_by_type:
            response += "**Animals by Type:**\n"
            for animal_type, animals_list in animals_by_type.items():
                response += f"- {animal_type}: {len(animals_list)} animals\n"
                for animal in animals_list:
                    response += f"  - {animal['id']}: {animal['breed']}, Age: {animal['age']} months, Status: {animal['status']}\n"
        
        response += f"\n**Health Summary:**\n"
        if health_status:
            for status, count in health_status.items():
                response += f"- {status}: {count} animals\n"
        else:
            response += "- All animals healthy\n"
        
        return response
    
    else:
        response = f"👨‍🌾 **Advice for {farm_name}**\n\n"
        response += "I can help with livestock health and care. To get the best advice:\n\n"
        response += "1. **Describe the symptom** - What's wrong? (fever, cough, diarrhea, etc.)\n"
        response += "2. **Mention the animal** - Which one? (Animal ID or type)\n"
        response += "3. **Tell the duration** - How long has this been happening?\n\n"
        response += "Example: \"My cow C001 has a cough for 2 days\"\n\n"
        response += "Or ask me about:\n"
        response += "- Vaccination schedules\n"
        response += "- Feeding and care\n"
        response += "- Your farm's animal status\n"
        return response

@router.post("/message")
async def chat_with_ollama(message: ChatMessage, db: Session = Depends(get_db)):
    """Send a message and get response with home remedies and sick animal tracking"""
    try:
        farm_context = get_farm_context(message.farm_id, db)
        if not farm_context:
            raise HTTPException(status_code=404, detail="Farm not found")
        
        # Check if farmer is reporting sick animal
        message_lower = message.message.lower()
        sick_keywords = ["sick", "ill", "disease", "dying", "fever", "cough", "diarrhea", "lame", "not eating", "wound"]
        is_sick_report = any(keyword in message_lower for keyword in sick_keywords)
        
        # If reporting illness, mark latest animal as sick
        sick_updated = False
        if is_sick_report:
            latest_animal = db.query(Animal).filter(
                Animal.farm_id == message.farm_id
            ).order_by(Animal.id.desc()).first()
            
            if latest_animal and latest_animal.status != "Sick":
                latest_animal.status = "Sick"
                latest_animal.risk_level = "High"
                db.commit()
                sick_updated = True
        
        # Generate smart response with home remedies
        response = generate_chatbot_response(
            message.message,
            farm_context,
            db,
            message.farm_id
        )
        
        if sick_updated:
            response = f"✅ **Animal {latest_animal.animal_id} marked as SICK in your farm records.**\n\n{response}"
        
        return {
            "response": response,
            "context": farm_context,
            "sick_animals_updated": sick_updated
        }
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Chatbot error: {str(e)}")