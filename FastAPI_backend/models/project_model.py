from pydantic import BaseModel, Field, field_validator
from typing import List, Optional
from datetime import datetime, timezone

class Project(BaseModel):
    user_Id: str
    project_Id: Optional[str] = None
    name: Optional[str] = None
    description: Optional[str] = None
    about: Optional[str] = None
    saved_time: Optional[datetime] = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_At: Optional[datetime] = None

class UpdateProject(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    about: Optional[str] = None
    updated_At: Optional[datetime] = Field(default_factory=lambda: datetime.now(timezone.utc))