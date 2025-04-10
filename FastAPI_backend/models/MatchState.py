from typing import Optional, List
from pydantic import BaseModel
from datetime import datetime, timezone
from enum import Enum

class MatchStatus(str, Enum):
    PENDING = "pending"  # Business swiped right, waiting for model to respond
    MATCHED = "matched"  # Both users swiped right, confirmed match
    REJECTED = "rejected"  # Model swiped left on business request

class MatchState(BaseModel):
    business_id: str  # The business user
    model_id: str  # The model user
    status: MatchStatus
    initiated_at: datetime = datetime.now(timezone.utc)
    responded_at: Optional[datetime] = None
    
class PendingRequest(BaseModel):
    user_id: str
    name: str
    profile_pic: Optional[str] = None
    description: Optional[str] = None
    requested_at: datetime