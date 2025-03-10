from pydantic import BaseModel, Field
from typing import List, Optional, Tuple
from datetime import datetime , timezone


class ModelTagData(BaseModel):
    client_Type: str = "Model"
    user_Id: str
    age: Optional[int] = None
    height: Optional[int] = None
    natural_eye_color: Optional[str] = None
    body_Type: Optional[str] = None
    work_Field: Optional[List[str]] = None
    skin_Tone: Optional[str] = None
    ethnicity: Optional[str] = None
    natural_hair_type: Optional[str] = None
    experience_Level: Optional[str] = None
    gender: Optional[str] = None
    location: Optional[str] = None
    shoe_Size: Optional[int] = None
    bust_chest: Optional[int] = None
    waist: Optional[int] = None
    hips: Optional[int] = None
    saved_time: Optional[datetime] = Field(default_factory=lambda: datetime.now(timezone.utc))


class ModelTagFilterRequest(BaseModel):
    user_Id: Optional[str] = None
    age: Optional[int] = None
    height: Optional[int] = None
    natural_eye_color: Optional[str] = None
    body_Type: Optional[str] = None
    work_Field: Optional[List[str]] = None
    skin_Tone: Optional[str] = None
    ethnicity: Optional[str] = None
    natural_hair_type: Optional[str] = None
    experience_Level: Optional[str] = None
    gender: Optional[str] = None
    location: Optional[str] = None
    shoe_Size: Optional[int] = None
    bust_chest: Optional[int] = None
    waist: Optional[int] = None
    hips: Optional[int] = None

class BrandTagData(BaseModel):
    client_Type: str = "Brand"
    user_Id: str 
    is_project: bool = False
    work_Field: Optional[List[str]] = None
    location: Optional[str] = None
    saved_time: Optional[datetime] = Field(default_factory=lambda: datetime.now(timezone.utc))

class BrandTagFilterRequest(BaseModel):
    user_Id: Optional[str] = None 
    work_Field: Optional[List[str]] = None
    location: Optional[str] = None

class ProjectTagData(BaseModel):
    client_Type: str = "Brand"
    project_Id: Optional[str] = None
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
    location: Optional[str] = None
    shoe_Size: Optional[Tuple[int,int]] = None
    bust_chest: Optional[Tuple[int,int]] = None
    waist: Optional[Tuple[int,int]] = None
    hips: Optional[Tuple[int,int]] = None
    saved_time: Optional[datetime] = Field(default_factory=lambda: datetime.now(timezone.utc))

class ProjectTagFilterRequest(BaseModel):
    user_Id: Optional[str] = None 
    project_Id: Optional[str] = None 
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
    location: Optional[str] = None
    shoe_Size: Optional[Tuple[int,int]] = None
    bust_chest: Optional[Tuple[int,int]] = None
    waist: Optional[Tuple[int,int]] = None
    hips: Optional[Tuple[int,int]] = None

class CreateRandomTagsRequest(BaseModel):
    count: int
    tag_type: str