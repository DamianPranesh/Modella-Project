from pydantic import BaseModel, Field
from typing import Optional

class Rating(BaseModel):
    rating_id: str
    user_Id: str  # Receiver of the rating
    ratedBy_Id: str  # Giver of the rating
    rating: int = Field(..., ge=1, le=5)  # Rating between 1-5
    review: Optional[str] = None
