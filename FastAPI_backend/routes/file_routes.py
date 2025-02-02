from fastapi import APIRouter, UploadFile, File
from typing import List, Optional
from services.file_service import (
    upload_file, get_files, download_file, delete_file, update_visibility, get_file_url
)

from models.file_model import FileMetadataOnURL

router = APIRouter(prefix="/files", tags=["File Management"])

@router.post("/upload/")
async def upload(file: UploadFile = File(...), user_id: str = "default_user", folder: str = "image", is_private: bool = False):
    return await upload_file(file, user_id, folder, is_private)

@router.get("/files/", response_model=List[dict])
async def list_files(user_id: str = None):
    return await get_files(user_id)

@router.get("/download/{file_id}")
async def download(file_id: str, user_id: str):
    return await download_file(file_id, user_id)

@router.delete("/delete/{file_id}")
async def delete(file_id: str, user_id: str):
    return await delete_file(file_id, user_id)

@router.patch("/visibility/{file_id}")
async def change_visibility(file_id: str, user_id: str, is_private: bool):
    return await update_visibility(file_id, user_id, is_private)



@router.get("/files/urls", response_model=List[FileMetadataOnURL])
async def get_file_urls(user_id: Optional[str] = None):
    """
    Get file URLs for a specific user or all public files if user_id is not provided.
    Excludes private files unless the user is the owner.
    """
    # Call the get_file_url function to retrieve the file URLs
    files = await get_file_url(user_id=user_id)
    return files