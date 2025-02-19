from pydantic import BaseModel, Field, field_validator
from typing import List, Optional
from datetime import datetime, timezone

class User(BaseModel):
    user_Id: Optional[str] = None  # Now optional since we'll generate it
    name: Optional[str] = None
    email: str
    password_Hash: Optional[str] = None
    profile_Picture_URL: Optional[List[str]] = None
    google_Id: Optional[str] = None
    apple_Id: Optional[str] = None
    google_calendar_token: Optional[str] = None  # For Google Calendar access tokens
    google_refresh_token: Optional[str] = None  # For refreshing Calendar token
    auth_Method: Optional[str] = None
    role: str = Field(..., pattern=r"^(model|brand|admin)$")  # Made required and added validation
    created_At: Optional[datetime] = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_At: Optional[datetime] = None
    bio: Optional[str] = None
    video_URL: Optional[List[str]] = None
    photo_URL: Optional[List[str]] = None
    social_Media_URL: Optional[List[str]] = None
    tags_Id: Optional[List[str]] = None
    booking_Availability: Optional[str] = None
    preference_Id: Optional[str] = None
    portfolio_URL: Optional[List[str]] = None 

    @field_validator("role")
    def validate_role(cls, value):
        valid_roles = ["model", "brand", "admin"]
        if value.lower() not in valid_roles:
            raise ValueError("role must be one of: model, brand, or admin")
        return value.lower()
    


class UserUpdate(BaseModel):
    name: Optional[str] = None
    email: Optional[str] = None
    password_Hash: Optional[str] = None
    profile_Picture_URL: Optional[List[str]] = None
    google_Id: Optional[str] = None
    apple_Id: Optional[str] = None
    google_calendar_token: Optional[str] = None  # For Google Calendar access tokens
    google_refresh_token: Optional[str] = None  # For refreshing Calendar token
    auth_Method: Optional[str] = None
    bio: Optional[str] = None
    video_URL: Optional[List[str]] = None
    photo_URL: Optional[List[str]] = None
    social_Media_URL: Optional[List[str]] = None
    tags_Id: Optional[List[str]] = None
    booking_Availability: Optional[str] = None
    preference_Id: Optional[str] = None
    portfolio_URL: Optional[List[str]] = None 
    