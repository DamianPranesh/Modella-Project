
from datetime import datetime, timezone
from typing import Optional
from fastapi import HTTPException
import uuid
import logging
from config.setting import *
from bson import ObjectId
from botocore.exceptions import NoCredentialsError

# Import logger
#from config.logging_config import logger

logger = logging.getLogger(__name__)



# Define allowed folders
ALLOWED_FOLDERS = {"image", "profile-pic", "portfolio", "video"}

# Allowed MIME types
ALLOWED_FILE_TYPES = {
    "image/jpeg", "image/png",  # Images
    "application/pdf",          # Documents
    "video/mp4"                 # Videos
}

async def upload_file(file, user_id: str, folder: str, is_private: bool = False):
    """ Upload a file to AWS S3 and store metadata in MongoDB """
    if folder not in ALLOWED_FOLDERS:
        logger.warning(f"Invalid folder attempt by {user_id}: {folder}")
        raise HTTPException(status_code=400, detail="Invalid folder name")

    file_type = file.content_type

    if file_type not in ALLOWED_FILE_TYPES:
        logger.warning(f"Unsupported file type upload attempt: {file_type} by {user_id}")
        raise HTTPException(status_code=400, detail="Unsupported file type")

    file_id = str(uuid.uuid4())
    file_name = file.filename
    file_size = len(await file.read())
    
    
    # File size validation (Max: 25MB)
    if file_size > 25 * 1024 * 1024:
        logger.warning(f"File size exceeded by {user_id}: {file_name} ({file_size} bytes)")
        raise HTTPException(status_code=400, detail="File size exceeds 25MB limit")

    # Upload to S3 in correct folder
    file_key = f"{folder}/{file_id}_{file_name}"
    file.file.seek(0)  # Reset file pointer
    s3_client.upload_fileobj(file.file, AWS_BUCKET_NAME, file_key)
    
    # Generate S3 URL
    s3_url = f"https://{AWS_BUCKET_NAME}.s3.{AWS_REGION}.amazonaws.com/{file_key}"

    # Save metadata to MongoDB
    file_metadata = {
        "file_id": file_id,
        "file_name": file_name,
        "file_type": file_type,
        "file_size": file_size,
        "uploaded_at": datetime.now(timezone.utc),
        "s3_url": s3_url,
        "uploaded_by": user_id,
        "folder": folder,
        "is_private": is_private
    }
    await file_collection.insert_one(file_metadata)
    logger.info(f"File uploaded successfully by {user_id}: {file_name} (Private: {is_private})")

    return {"message": "File uploaded successfully", "file_url": s3_url}


async def get_files(user_id: str = None):
    """ Retrieve files, filter by user if provided """
    query = {"uploaded_by": user_id} if user_id else {}
    files = await file_collection.find(query, {"_id": 0}).to_list(None)

    logger.info(f"Retrieved files for user: {user_id if user_id else 'all users'}")
    return files



async def download_file(file_id: str, user_id: str):
    """ Generate a pre-signed S3 URL for private files """
    file_metadata = await file_collection.find_one({"file_id": file_id})
    if not file_metadata:
        logger.warning(f"Download attempt for non-existing file: {file_id} by {user_id}")
        raise HTTPException(status_code=404, detail="File not found")

    # Check if the file is private and not owned by the user
    if file_metadata["is_private"] and file_metadata["uploaded_by"] != user_id:
        logger.warning(f"Unauthorized download attempt by {user_id} for {file_id}")
        raise HTTPException(status_code=403, detail="Unauthorized access")

    file_key = f"{file_metadata['folder']}/{file_id}_{file_metadata['file_name']}"
    url = s3_client.generate_presigned_url(
        "get_object",
        Params={"Bucket": AWS_BUCKET_NAME, "Key": file_key},
        ExpiresIn=3600
    )

    logger.info(f"Download link generated for {file_id} by {user_id}")

    return {"download_url": url}



async def delete_file(file_id: str, user_id: str):
    """ Delete file from S3 and MongoDB """
    file_metadata = await file_collection.find_one({"file_id": file_id})
    if not file_metadata:
        logger.warning(f"Delete attempt for non-existing file: {file_id} by {user_id}")
        raise HTTPException(status_code=404, detail="File not found")

    # Ensure only the owner can delete
    if file_metadata["uploaded_by"] != user_id:
        logger.warning(f"Unauthorized delete attempt by {user_id} for {file_id}")
        raise HTTPException(status_code=403, detail="Unauthorized")

    file_key = f"{file_metadata['folder']}/{file_id}_{file_metadata['file_name']}"
    s3_client.delete_object(Bucket=AWS_BUCKET_NAME, Key=file_key)

    await file_collection.delete_one({"file_id": file_id})

    logger.info(f"File deleted successfully by {user_id}: {file_id}")

    return {"message": "File deleted successfully"}

async def update_visibility(file_id: str, user_id: str, is_private: bool):
    """ Change file visibility (private/public) """
    file_metadata = await file_collection.find_one({"file_id": file_id})
    if not file_metadata:
        logger.warning(f"Visibility update attempt for non-existing file: {file_id} by {user_id}")
        raise HTTPException(status_code=404, detail="File not found")

    # Ensure only the owner can change visibility
    if file_metadata["uploaded_by"] != user_id:
        logger.warning(f"Unauthorized visibility change attempt by {user_id} for {file_id}")
        raise HTTPException(status_code=403, detail="Unauthorized")

    await file_collection.update_one({"file_id": file_id}, {"$set": {"is_private": is_private}})
    logger.info(f"File visibility updated by {user_id}: {file_id} (Private: {is_private})")
    return {"message": "Visibility updated successfully"}




async def get_file_url(user_id: Optional[str] = None):
    """Retrieve file URLs, excluding private files unless the user is the owner."""
    
    pipeline = []

    if user_id:
        pipeline.append({
            "$match": {
                "$or": [
                    {"uploaded_by": user_id},  # User's own files
                    {"is_private": False}      # Public files
                ]
            }
        })
    else:
        pipeline.append({"$match": {"is_private": False}})

    pipeline.append({
        "$project": {
            "file_id": 1,  # Include file_id to construct the correct file path
            "file_name": 1,
            "folder": 1,   # Include folder to construct the S3 file key
            "s3_url": 1,
            "is_private": 1,
            "uploaded_by": 1,
            "file_type": 1
        }
    })

    files = await file_collection.aggregate(pipeline).to_list(None)

    for file in files:
        file_key = f"{file['folder']}/{file['file_id']}_{file['file_name']}"
        file_type = file.get('file_type', 'application/octet-stream')


        if file.get("is_private", False):
            if file.get("uploaded_by") == user_id:
                try:
                    file["s3_url"] = generate_presigned_url(file_key, file_type)
                except NoCredentialsError:
                    file["s3_url"] = None  # Handle missing credentials
            else:
                file["s3_url"] = None  # Hide private files from non-owners
        else:
            file["s3_url"] = generate_presigned_url(file_key, file_type)

    logger.info(f"Retrieved file URLs for user: {user_id if user_id else 'all users'}")
    return files


def generate_presigned_url(file_key: str, file_type: str, expiration: int = 3600):
    """Generate a pre-signed URL for private files."""
    try:
        content_type = file_type

        url = s3_client.generate_presigned_url(
            "get_object",
            Params={"Bucket": AWS_BUCKET_NAME, "Key": file_key, 'ResponseContentDisposition': 'inline','ResponseContentType': content_type},
            ExpiresIn=expiration
        )
        return url
    except Exception as e:
        logger.error(f"Error generating presigned URL: {e}")
        return None