"""Home remedies and livestock health knowledge base"""

HOME_REMEDIES = {
    "cough": [
        "Provide warm water with honey and ginger",
        "Ensure good ventilation in the barn",
        "Add salt to feed to improve appetite",
        "Keep animal away from dusty areas",
        "Monitor for 2-3 days; consult vet if worsens"
    ],
    "diarrhea": [
        "Offer electrolyte solution (salt + sugar + water)",
        "Provide probiotics or yogurt",
        "Reduce fresh feed and give dry hay",
        "Ensure clean water supply",
        "Apply ginger or fenugreek to feed"
    ],
    "fever": [
        "Cool water baths during morning/evening",
        "Provide shaded, well-ventilated area",
        "Give turmeric with feed (anti-inflammatory)",
        "Ensure adequate water intake",
        "Monitor temperature; veterinary care if above 105°F"
    ],
    "lameness": [
        "Check hooves for cracks or stones",
        "Soak affected foot in warm salt water (10 mins)",
        "Apply mustard oil to the foot",
        "Provide clean, dry bedding",
        "Limit movement and observe for 3 days"
    ],
    "loss_of_appetite": [
        "Offer tempting feeds like grains or greens",
        "Provide salt blocks to stimulate appetite",
        "Give small frequent meals instead of one large meal",
        "Ensure water is fresh and available",
        "Check for mouth ulcers or dental issues"
    ],
    "wounds": [
        "Clean with mild salt water solution",
        "Apply turmeric paste (antiseptic)",
        "Bandage if necessary to prevent infection",
        "Monitor for swelling or discharge",
        "Provide antibiotics if signs of infection"
    ],
    "bloating": [
        "Give oil massage to the abdomen",
        "Provide ginger tea (cooled)",
        "Reduce fresh feed temporarily",
        "Encourage movement/walking",
        "Emergency vet if severe breathing difficulty"
    ],
    "mastitis": [
        "Warm compress on udder (15 mins)",
        "Hand milk out infected udder gently",
        "Apply turmeric solution to udder",
        "Increase water intake",
        "Contact vet for antibiotics if fever"
    ]
}

EMERGENCY_SYMPTOMS = {
    "inability_to_stand": "CRITICAL - Possible paralysis, seek immediate vet care",
    "severe_bleeding": "CRITICAL - Apply pressure and seek immediate vet care",
    "difficulty_breathing": "CRITICAL - Check airways, provide oxygen, emergency vet",
    "choking": "CRITICAL - Clear throat, provide water, emergency vet",
    "unconsciousness": "CRITICAL - Immediate veterinary intervention needed",
    "high_fever_above_105": "URGENT - Cool down and seek vet care immediately",
    "no_urination_for_24_hours": "URGENT - Possible urinary blockage, vet needed",
    "unable_to_defecate": "URGENT - Possible impaction, vet consultation needed"
}

SYMPTOM_PATTERNS = {
    "sick|illness|unwell": ["loss_of_appetite", "fever", "lethargy"],
    "cough|coughing|respiratory|breathing": ["cough", "fever"],
    "diarrhea|loose|stool|runny": ["diarrhea", "loss_of_appetite"],
    "fever|temperature|hot": ["fever", "lethargy"],
    "lame|limping|lame|foot": ["lameness"],
    "wound|injury|cut|bleeding": ["wounds"],
    "bloat|bloating|swollen": ["bloating"],
    "udder|mastitis|milk": ["mastitis"]
}

def get_remedies_for_symptoms(symptoms: str) -> list:
    """Extract symptoms and return home remedies"""
    remedies = []
    symptoms_lower = symptoms.lower()
    
    # Check for emergency symptoms
    for emergency_key, emergency_msg in EMERGENCY_SYMPTOMS.items():
        if emergency_key.replace("_", " ") in symptoms_lower or emergency_key.replace("_", " ") in symptoms_lower:
            remedies.append(f"⚠️ EMERGENCY: {emergency_msg}")
    
    # Check for common symptoms
    for key, remedy_list in HOME_REMEDIES.items():
        if key.replace("_", " ") in symptoms_lower or key in symptoms_lower:
            remedies.extend([f"• {r}" for r in remedy_list])
    
    # Pattern matching for related symptoms
    for pattern, related_symptoms in SYMPTOM_PATTERNS.items():
        if any(word in symptoms_lower for word in pattern.split("|")):
            for symptom in related_symptoms:
                if symptom in HOME_REMEDIES:
                    remedies.extend([f"• {r}" for r in HOME_REMEDIES[symptom]])
            break
    
    return list(set(remedies)) if remedies else [
        "• Provide fresh water and clean shelter",
        "• Monitor the animal closely",
        "• If symptoms persist beyond 2 days, consult a veterinarian"
    ]
