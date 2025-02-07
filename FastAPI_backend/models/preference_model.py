from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime , timezone

class PreferenceData(BaseModel):
    client_Type: str  # "Model" or "Brand"
    user_Id: str
    age: Optional[int] = None
    height: Optional[float] = None
    eye_color: Optional[str] = None
    body_Type: Optional[str] = None
    work_Field: Optional[str] = None
    industry_Type: Optional[str] = None
    skin_Tone: Optional[str] = None
    ethnicity: Optional[str] = None
    hair: Optional[str] = None
    experience_Level: Optional[str] = None
    gender: Optional[str] = None
    location: Optional[str] = None
    shoe_Size: Optional[float] = None
    price_range: Optional[float] = None
    rating_level: Optional[int] = None
    saved_time: Optional[datetime] = Field(default_factory=lambda: datetime.now(timezone.utc))

class UpdatePreferenceData(BaseModel):
    client_Type: Optional[str] = None
    age: Optional[int] = None
    height: Optional[float] = None
    eye_color: Optional[str] = None
    body_Type: Optional[str] = None
    work_Field: Optional[str] = None
    industry_Type: Optional[str] = None
    skin_Tone: Optional[str] = None
    ethnicity: Optional[str] = None
    hair: Optional[str] = None
    experience_Level: Optional[str] = None
    gender: Optional[str] = None
    location: Optional[str] = None
    shoe_Size: Optional[float] = None
    price_range: Optional[float] = None
    rating_level: Optional[int] = None

class PreferenceFilterRequest(BaseModel):
    client_Type: str  # "Model" or "Brand"
    location: Optional[str] = None
    industry_Type: Optional[str] = None
    price_range: Optional[float] = None
    # Fields for "Brand" users
    age: Optional[int] = None

    height: Optional[float] = None
    eye_color: Optional[str] = None
    body_Type: Optional[str] = None
    work_Field: Optional[str] = None
    skin_Tone: Optional[str] = None
    ethnicity: Optional[str] = None
    hair: Optional[str] = None
    experience_Level: Optional[str] = None
    gender: Optional[str] = None
    shoe_Size: Optional[float] = None
    rating_level: Optional[int] = None


class CreateRandomPreferencesRequest(BaseModel):
    count: int  # Number of random preferences to create