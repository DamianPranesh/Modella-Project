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
ALLOWED_FOLDERS = {"image", "profile-pic", "portfolio", "video","project"}

# Allowed MIME types
ALLOWED_FILE_TYPES = {
    "image/jpeg", "image/png",  # Images
    "application/pdf",          # Documents
    "video/mp4"                 # Videos
}

async def _validate_user(user_id: str) -> bool:
    """Helper function to validate if a user exists"""
    if not user_id:
        return False
    user = await user_collection.find_one({"user_Id": user_id})
    return user is not None

async def _validate_project(project_id: str) -> bool:
    """Helper function to validate if a user exists"""
    if not project_id:
        return False
    project = await project_collection.find_one({"project_Id": project_id})
    return project is not None

async def upload_file(file, user_id: str, folder: str, is_private: bool = False, description: str ="No description", project_id: Optional[str] = None):
    """ Upload a file to AWS S3 and store metadata in MongoDB """
    # Validate user existence
    if not await _validate_user(user_id):
        logger.warning(f"Upload attempt by non-existent user: {user_id}")
        raise HTTPException(status_code=404, detail="User not found")
    
    if project_id is not None:
        if not await _validate_project(project_id):
            logger.warning(f"Upload attempt by non-existent project: {project_id}")
            raise HTTPException(status_code=404, detail="project not found")

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
        "is_private": is_private,
        "description": description,
        "project_id": project_id
    }
    await file_collection.insert_one(file_metadata)
    logger.info(f"File uploaded successfully by {user_id}: {file_name} (Private: {is_private})")

    return {"message": "File uploaded successfully", "file_url": s3_url}


async def get_files(user_id: str = None):
    """ Retrieve files, filter by user if provided """
    if user_id and not await _validate_user(user_id):
        logger.warning(f"File retrieval attempt by non-existent user: {user_id}")
        raise HTTPException(status_code=404, detail="User not found")

    query = {"uploaded_by": user_id} if user_id else {}
    files = await file_collection.find(query, {"_id": 0}).to_list(None)

    logger.info(f"Retrieved files for user: {user_id if user_id else 'all users'}")
    return files



async def download_file(file_id: str, user_id: str):
    """ Generate a pre-signed S3 URL for private files """
    if not await _validate_user(user_id):
        logger.warning(f"Download attempt by non-existent user: {user_id}")
        raise HTTPException(status_code=404, detail="User not found")

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
    if not await _validate_user(user_id):
        logger.warning(f"Delete attempt by non-existent user: {user_id}")
        raise HTTPException(status_code=404, detail="User not found")

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
    if not await _validate_user(user_id):
        logger.warning(f"Visibility update attempt by non-existent user: {user_id}")
        raise HTTPException(status_code=404, detail="User not found")

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
    if user_id and not await _validate_user(user_id):
        logger.warning(f"File URL retrieval attempt by non-existent user: {user_id}")
        raise HTTPException(status_code=404, detail="User not found")
    
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
            "file_type": 1,
            "description": {"$ifNull": ["$description", "No description"]},
            "project_id":{"$ifNull": ["$project_id", ""]}
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


async def get_files_urls_by_folder(user_id: Optional[str] = None, folder: Optional[str] = None, limit: Optional[int] = None):
    """Retrieve file URLs based on optional user_id and folder, excluding private files unless the user is the owner."""
    
    # Validate user if user_id is provided
    if user_id and not await _validate_user(user_id):
        logger.warning(f"File retrieval attempt by non-existent user: {user_id}")
        raise HTTPException(status_code=404, detail="User not found")

    pipeline = []

    # Filtering based on user_id and folder
    match_conditions = []

    if user_id:
        match_conditions.append({
            "$or": [
                {"uploaded_by": user_id},  # User's own files (including private)
                {"is_private": False}      # Public files
            ]
        })

    if folder and folder in ALLOWED_FOLDERS:
        match_conditions.append({"folder": folder})

    if match_conditions:
        pipeline.append({"$match": {"$and": match_conditions}})

    # Projection stage
    pipeline.append({
        "$project": {
            "file_id": 1,
            "file_name": 1,
            "folder": 1,
            "s3_url": 1,
            "is_private": 1,
            "uploaded_by": 1,
            "file_type": 1,
            "description": {"$ifNull": ["$description", "No description"]},
            "project_id":{"$ifNull": ["$project_id", ""]} 
        }
    })

    # Apply limit if provided
    if limit and limit > 0:
        pipeline.append({"$limit": limit})

    files = await file_collection.aggregate(pipeline).to_list(None)

    # Generate presigned URLs where needed
    for file in files:
        file_key = f"{file['folder']}/{file['file_id']}_{file['file_name']}"
        file_type = file.get('file_type', 'application/octet-stream')

        # Handle private files
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

    logger.info(f"Retrieved files for user: {user_id if user_id else 'all users'}, folder: {folder if folder else 'all folders'}")
    return files




async def get_files_urls_by_user_folders(
    user_id: str,  # Required parameter
    folder: Optional[str] = None,  # Optional parameter
    limit: Optional[int] = None    # Optional parameter
):
    """Retrieve file URLs based on user_id and optional folder, limiting the number of files if provided."""
    
    # Validate user if user_id is provided
    if not await _validate_user(user_id):
        logger.warning(f"File retrieval attempt by non-existent user: {user_id}")
        raise HTTPException(status_code=404, detail="User not found")

    pipeline = []

    # Filtering based on user_id and folder
    match_conditions = [
        {"uploaded_by": user_id}  # User's own files (including private)
    ]

    if folder and folder in ALLOWED_FOLDERS:
        match_conditions.append({"folder": folder})  # Filter by folder if provided

    # Append the match condition to the pipeline
    pipeline.append({"$match": {"$and": match_conditions}})

    # Projection stage
    pipeline.append({
        "$project": {
            "file_id": 1,
            "file_name": 1,
            "folder": 1,
            "s3_url": 1,
            "is_private": 1,
            "uploaded_by": 1,
            "file_type": 1,
            "description": {"$ifNull": ["$description", "No description"]},
            "project_id":{"$ifNull": ["$project_id", ""]}
        }
    })

    # Apply limit if provided
    if limit and limit > 0:
        pipeline.append({"$limit": limit})

    # Perform the aggregation to get the files
    files = await file_collection.aggregate(pipeline).to_list(None)

    # Generate presigned URLs where needed
    for file in files:
        file_key = f"{file['folder']}/{file['file_id']}_{file['file_name']}"
        file_type = file.get('file_type', 'application/octet-stream')

        # Always generate the URL for the file, without checking privacy
        try:
            file["s3_url"] = generate_presigned_url(file_key, file_type)
        except NoCredentialsError:
            file["s3_url"] = None

    logger.info(f"Retrieved files for user: {user_id}, folder: {folder if folder else 'all folders'}")
    return files


async def get_latest_file_by_user_folder(user_id: str, folder: Optional[str] = None):
    """Retrieve the latest file added by the user to a specific folder."""
    
    # Validate user existence
    if not await _validate_user(user_id):
        logger.warning(f"File retrieval attempt by non-existent user: {user_id}")
        raise HTTPException(status_code=404, detail="User not found")
    
    pipeline = []
    
    # Filtering based on user_id and optional folder
    match_conditions = [{"uploaded_by": user_id}]
    
    if folder and folder in ALLOWED_FOLDERS:
        match_conditions.append({"folder": folder})
    
    pipeline.append({"$match": {"$and": match_conditions}})
    
    # Sorting to get the latest file
    pipeline.append({"$sort": {"uploaded_at": -1}})  # Assuming 'uploaded_at' field exists
    
    # Limiting to the most recent file
    pipeline.append({"$limit": 1})
    
    # Projection stage
    pipeline.append({
        "$project": {
            "file_id": 1,
            "file_name": 1,
            "folder": 1,
            "s3_url": 1,
            "is_private": 1,
            "uploaded_by": 1,
            "file_type": 1,
            "uploaded_at": 1,
            "description": {"$ifNull": ["$description", "No description"]},
            "project_id":{"$ifNull": ["$project_id", ""]} 
        }
    })
    
    # Perform the aggregation
    latest_file = await file_collection.aggregate(pipeline).to_list(1)
    
    if not latest_file:
        return None  # No file found
    
    file = latest_file[0]
    file_key = f"{file['folder']}/{file['file_id']}_{file['file_name']}"
    file_type = file.get('file_type', 'application/octet-stream')
    
    # Generate presigned URL
    try:
        file["s3_url"] = generate_presigned_url(file_key, file_type)
    except NoCredentialsError:
        file["s3_url"] = None
    
    logger.info(f"Retrieved latest file for user: {user_id}, folder: {folder if folder else 'all folders'}")
    return file


async def get_file_by_project(user_id: str, project_id: str):
    """Retrieve the latest file added by the user to the 'project' folder for a specific project."""
    
    # Validate user existence
    if not await _validate_user(user_id):
        logger.warning(f"File retrieval attempt by non-existent user: {user_id}")
        raise HTTPException(status_code=404, detail="User not found")
    
    # Validate project existence (Optional: Implement if necessary)
    if not await _validate_project(project_id):
        logger.warning(f"File retrieval attempt for non-existent project: {project_id}")
        raise HTTPException(status_code=404, detail="Project not found")
    
    pipeline = [
        {"$match": {"$and": [
            {"uploaded_by": user_id},
            {"project_id": project_id},
            {"folder": "project"}
        ]}},
        {"$project": {
            "file_id": 1,
            "file_name": 1,
            "folder": 1,
            "s3_url": 1,
            "is_private": 1,
            "uploaded_by": 1,
            "file_type": 1,
            "uploaded_at": 1,
            "description": {"$ifNull": ["$description", "No description"]},
            "project_id": {"$ifNull": ["$project_id", ""]}
        }}
    ]
    
    project_file = await file_collection.aggregate(pipeline).to_list(1)
    
    if not project_file:
        return None  # No file found
    
    file = project_file[0]
    file_key = f"{file['folder']}/{file['file_id']}_{file['file_name']}"
    file_type = file.get('file_type', 'application/octet-stream')
    
    # Generate presigned URL
    try:
        file["s3_url"] = generate_presigned_url(file_key, file_type)
    except NoCredentialsError:
        file["s3_url"] = None
    
    logger.info(f"Retrieved latest file for user: {user_id}, project: {project_id}, folder: 'project'")
    return file