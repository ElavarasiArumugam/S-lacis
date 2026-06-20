from pydantic import BaseModel, EmailStr, Field
from pydantic import EmailStr
class FarmRegistration(BaseModel):
    name: str = Field(..., min_length=2, max_length=50)
    email: EmailStr
    password: str = Field(..., min_length=8, description="Password must be at least 8 characters")
    
    # Initial Livestock Counts
    cattle_count: int = Field(default=0, ge=0)
    sheep_count: int = Field(default=0, ge=0)
    goat_count: int = Field(default=0, ge=0)
    poultry_count: int = Field(default=0, ge=0)

class FarmLogin(BaseModel):
    email: EmailStr
    password: str