from typing import Optional
from pydantic import BaseModel
from datetime import datetime

class FileMetadata(BaseModel):
    file_id: str
    file_name: str
    file_type: str
    file_size: int
    uploaded_at: datetime
    s3_url: str
    uploaded_by: str  # User who uploaded the file
    folder: str  # Category (image, profile-pic, portfolio, video)
    is_private: bool = False  # Default: public


class FileMetadataOnURL(BaseModel):
    file_id: str
    file_name: str
    s3_url: Optional[str]
    is_private: bool
