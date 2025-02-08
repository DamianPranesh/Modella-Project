from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime , timezone

class TagData(BaseModel):
    # tags_Id: str
    client_Type: str  # "Model" or "Brand"
    user_Id: str
    age: Optional[int] = None
    height: Optional[float] = None
    eye_color: Optional[str] = None
    body_Type: Optional[str] = None
    work_Field: Optional[List[str]] = None
    industry_Type: Optional[List[str]] = None
    skin_Tone: Optional[str] = None
    ethnicity: Optional[str] = None
    hair: Optional[str] = None
    experience_Level: Optional[str] = None
    gender: Optional[str] = None
    location: Optional[str] = None
    shoe_Size: Optional[float] = None
    price_range: Optional[float] = None
    saved_time: Optional[datetime] = Field(default_factory=lambda: datetime.now(timezone.utc))

class UpdateTagData(BaseModel):
    # tags_Id: Optional[str] = None
    client_Type: Optional[str] = None
    age: Optional[int] = None
    height: Optional[float] = None
    eye_color: Optional[str] = None
    body_Type: Optional[str] = None
    work_Field: Optional[List[str]] = None
    industry_Type: Optional[List[str]] = None
    skin_Tone: Optional[str] = None
    ethnicity: Optional[str] = None
    hair: Optional[str] = None
    experience_Level: Optional[str] = None
    gender: Optional[str] = None
    location: Optional[str] = None
    shoe_Size: Optional[float] = None
    price_range: Optional[float] = None

class TagFilterRequest(BaseModel):
    client_Type: str  # "Model" or "Brand"
    location: Optional[str] = None
    industry_Type: Optional[List[str]] = None
    price_range: Optional[float] = None
    # Fields for "Brand" users
    age: Optional[int] = None
    height: Optional[float] = None
    eye_color: Optional[str] = None
    body_Type: Optional[str] = None
    work_Field: Optional[List[str]] = None
    skin_Tone: Optional[str] = None
    ethnicity: Optional[str] = None
    hair: Optional[str] = None
    experience_Level: Optional[str] = None
    gender: Optional[str] = None
    shoe_Size: Optional[float] = None


class CreateRandomTagsRequest(BaseModel):
    count: int  # Number of random tags to create