from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime , timezone

class User(BaseModel):
    __user_Id: str
    __name: str
    __email: str
    __password_Hash: str
    __profile_Picture_URL: Optional[List[str]] = None 
    __google_Id: Optional[str] = None 
    __apple_Id: Optional[str] = None 
    __auth_Method: Optional[str] = None 
    __role: Optional[str] = None 
    __created_At: Optional[datetime] = Field(default_factory=lambda: datetime.now(timezone.utc))
    __update_At: Optional[datetime] = None
    __bio: Optional[str] = None
    __video_URL:Optional[List[str]] = None 
    __photo_URL:Optional[List[str]] = None 
    __social_Media_URL:Optional[List[str]] = None 
    __tags_Id: Optional[List[str]] = None 
    __booking_Availablity: Optional[str] = None
    __rating: Optional[str] = None
    __preference_Id: Optional[str] = None


