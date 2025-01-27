from typing import List, Optional

from FastAPI_backend.models import User

class Model(User):
    __portfolio_URL: Optional[List[str]] = None 
