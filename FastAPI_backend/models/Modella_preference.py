from pydantic import BaseModel, Field, field_validator
from typing import List, Optional, Tuple
from datetime import datetime , timezone


class ModelProjectPreferenceData(BaseModel):
    client_Type: str = "Model"
    user_Id: str
    is_project: bool = True
    age: Optional[Tuple[int,int]] = None
    height: Optional[Tuple[int,int]] = None
    natural_eye_color: Optional[List[str]] = None
    body_Type: Optional[List[str]] = None
    work_Field: Optional[List[str]] = None
    skin_Tone: Optional[List[str]] = None
    ethnicity: Optional[List[str]] = None
    natural_hair_type: Optional[List[str]] = None
    experience_Level: Optional[List[str]] = None
    gender: Optional[List[str]] = None
    location: Optional[List[str]] = None
    shoe_Size: Optional[Tuple[int,int]] = None
    bust_chest: Optional[Tuple[int,int]] = None
    waist: Optional[Tuple[int,int]] = None
    hips: Optional[Tuple[int,int]] = None
    saved_time: Optional[datetime] = Field(default_factory=lambda: datetime.now(timezone.utc))

    
class ModelProjectPreferenceFilterRequest(BaseModel):
    user_Id: Optional[str] = None 
    age: Optional[Tuple[int,int]] = None
    height: Optional[Tuple[int,int]] = None
    natural_eye_color: Optional[List[str]] = None
    body_Type: Optional[List[str]] = None
    work_Field: Optional[List[str]] = None
    skin_Tone: Optional[List[str]] = None
    ethnicity: Optional[List[str]] = None
    natural_hair_type: Optional[List[str]] = None
    experience_Level: Optional[List[str]] = None
    gender: Optional[List[str]] = None
    location: Optional[List[str]] = None
    shoe_Size: Optional[Tuple[int,int]] = None
    bust_chest: Optional[Tuple[int,int]] = None
    waist: Optional[Tuple[int,int]] = None
    hips: Optional[Tuple[int,int]] = None



class BrandModelPreferenceData(BaseModel):
    client_Type: str = "Brand"
    user_Id: str
    age: Optional[Tuple[int,int]] = None
    height: Optional[Tuple[int,int]] = None
    natural_eye_color: Optional[List[str]] = None
    body_Type: Optional[List[str]] = None
    work_Field: Optional[List[str]] = None
    skin_Tone: Optional[List[str]] = None
    ethnicity: Optional[List[str]] = None
    natural_hair_type: Optional[List[str]] = None
    experience_Level: Optional[List[str]] = None
    gender: Optional[List[str]] = None
    location: Optional[List[str]] = None
    shoe_Size: Optional[Tuple[int,int]] = None
    bust_chest: Optional[Tuple[int,int]] = None
    waist: Optional[Tuple[int,int]] = None
    hips: Optional[Tuple[int,int]] = None
    rating_level: Optional[int] = None
    saved_time: Optional[datetime] = Field(default_factory=lambda: datetime.now(timezone.utc))

    @field_validator("rating_level")
    def validate_rating_level(cls, value):
        if value is not None and (value < 1 or value > 5):
            raise ValueError("rating_level must be between 1 and 5")
        return value

class BrandModelPreferenceFilterRequest(BaseModel):
    user_Id: Optional[str] = None 
    age: Optional[Tuple[int,int]] = None
    height: Optional[Tuple[int,int]] = None
    natural_eye_color: Optional[List[str]] = None
    body_Type: Optional[List[str]] = None
    work_Field: Optional[List[str]] = None
    skin_Tone: Optional[List[str]] = None
    ethnicity: Optional[List[str]] = None
    natural_hair_type: Optional[List[str]] = None
    experience_Level: Optional[List[str]] = None
    gender: Optional[List[str]] = None
    location: Optional[List[str]] = None
    shoe_Size: Optional[Tuple[int,int]] = None
    bust_chest: Optional[Tuple[int,int]] = None
    waist: Optional[Tuple[int,int]] = None
    hips: Optional[Tuple[int,int]] = None
    rating_level: Optional[int] = None

    @field_validator("rating_level")
    def validate_rating_level(cls, value):
        if value is not None and (value < 1 or value > 5):
            raise ValueError("rating_level must be between 1 and 5")
        return value

class ModelBrandPreferenceData(BaseModel):
    client_Type: str = "Model"
    user_Id: str
    is_project: bool = False
    work_Field: Optional[List[str]] = None
    location: Optional[List[str]] = None
    rating_level: Optional[int] = None
    saved_time: Optional[datetime] = Field(default_factory=lambda: datetime.now(timezone.utc))

    @field_validator("rating_level")
    def validate_rating_level(cls, value):
        if value is not None and (value < 1 or value > 5):
            raise ValueError("rating_level must be between 1 and 5")
        return value
    

class ModelBrandPreferenceFilterRequest(BaseModel):
    user_Id: Optional[str] = None
    work_Field: Optional[List[str]] = None
    location: Optional[List[str]] = None
    rating_level: Optional[int] = None

    @field_validator("rating_level")
    def validate_rating_level(cls, value):
        if value is not None and (value < 1 or value > 5):
            raise ValueError("rating_level must be between 1 and 5")
        return value