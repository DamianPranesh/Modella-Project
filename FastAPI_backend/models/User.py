# from pydantic import BaseModel, Field
# from typing import List, Optional
# from datetime import datetime , timezone

# class User(BaseModel):
#     _user_Id: str
#     _name: str
#     _email: str #for now this can be any fake value
#     _password_Hash: str
#     _profile_Picture_URL: Optional[List[str]] = None 
#     _google_Id: Optional[str] = None #for now this can be any fake value
#     _apple_Id: Optional[str] = None #for now this can be any fake value
#     _auth_Method: Optional[str] = None 
#     _role: Optional[str] = None 
#     _created_At: Optional[datetime] = Field(default_factory=lambda: datetime.now(timezone.utc))
#     _update_At: Optional[datetime] = None
#     _bio: Optional[str] = None
#     _video_URL:Optional[List[str]] = None 
#     _photo_URL:Optional[List[str]] = None 
#     _social_Media_URL:Optional[List[str]] = None 
#     _tags_Id: Optional[List[str]] = None 
#     _booking_Availablity: Optional[str] = None
#     _rating: Optional[str] = None
#     _preference_Id: Optional[str] = None


from pydantic import BaseModel, Field, EmailStr, field_validator, validator
from typing import List, Optional
from datetime import datetime, timezone
import re

class User(BaseModel):
    user_Id: str = Field(..., pattern=r"^(model|brand)\d+$")
    name: str
    email: str
    password_Hash: str
    profile_Picture_URL: Optional[List[str]] = None
    google_Id: Optional[str] = None
    apple_Id: Optional[str] = None
    auth_Method: Optional[str] = None
    role: Optional[str] = None
    created_At: Optional[datetime] = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_At: Optional[datetime] = None
    bio: Optional[str] = None
    video_URL: Optional[List[str]] = None
    photo_URL: Optional[List[str]] = None
    social_Media_URL: Optional[List[str]] = None
    tags_Id: Optional[List[str]] = None
    booking_Availability: Optional[str] = None
    rating: Optional[str] = None
    preference_Id: Optional[str] = None


    @field_validator("user_Id")
    def validate_user_id(cls, value):
        if not re.match(r"^(model|brand)\d+$", value):
            raise ValueError("user_Id must start with 'model' or 'brand' followed by numbers.")
        return value



