from datetime import datetime, timezone
import random
import string
from bson import ObjectId
from fastapi import HTTPException, status
from pydantic import BaseModel
from models.User import User, UserUpdate
from config.setting import user_collection

async def create_user(user: User):
    # Check for existing email
    existing_user = await user_collection.find_one({"email": user.email})
    if existing_user:
        return existing_user.get("user_Id")
    
    # Convert to dict and get all fields from User model
    user_dict = {
        "name": user.name or None,
        "email": user.email,
        "password_Hash": user.password_Hash or None,
        "profile_Picture_URL": user.profile_Picture_URL or None,
        "google_Id": user.google_Id or None,
        "apple_Id": user.apple_Id or None,
        "auth_Method": user.auth_Method or None,
        "role": user.role,
        "created_At": user.created_At or datetime.now(timezone.utc),
        "updated_At": user.updated_At or None,
        "description": user.description or None,
        "bio": user.bio or None,
        "video_URL": user.video_URL or None,
        "photo_URL": user.photo_URL or None,
        "social_Media_URL": user.social_Media_URL or None,
        "tags_Id": user.tags_Id or None,
        "booking_Availability": user.booking_Availability or None,
        "preference_Id": user.preference_Id or None,
        "portfolio_URL": user.portfolio_URL or None 
    }
    
    # Insert the user and get the _id
    result = await user_collection.insert_one(user_dict)
    
    # Generate the user_Id using role and _id
    generated_user_id = f"{user.role}_{str(result.inserted_id)}"
    
    # Update the document with the generated user_Id
    await user_collection.update_one(
        {"_id": result.inserted_id},
        {"$set": {"user_Id": generated_user_id}}
    )
    
    # Return the complete user data
    # created_user = await user_collection.find_one({"_id": result.inserted_id})
    # created_user["_id"] = str(created_user["_id"])
    # return created_user
    return generated_user_id 

async def get_user(user_Id: str):
    user = await user_collection.find_one({"user_Id": user_Id})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    user["_id"] = str(user["_id"])
    return user

async def update_user(user_Id: str, updated_data: UserUpdate):
    # Convert Pydantic model to dictionary and remove None values
    update_fields = updated_data.model_dump(exclude_unset=True)

    # Prevent updates to immutable fields
    protected_fields = {"user_Id", "role", "_id"}
    update_fields = {key: value for key, value in update_fields.items() if key not in protected_fields}

    # Add updated_At timestamp
    update_fields["updated_At"] = datetime.now(timezone.utc)

    # Get the existing user
    existing_user = await user_collection.find_one({"user_Id": user_Id})
    if not existing_user:
        raise HTTPException(status_code=404, detail="User not found")

    # Update the user only if there are valid fields to update
    if update_fields:
        await user_collection.update_one({"user_Id": user_Id}, {"$set": update_fields})

    # Return the updated user
    updated_user = await user_collection.find_one({"user_Id": user_Id})
    updated_user["_id"] = str(updated_user["_id"])  # Convert ObjectId to string for JSON response
    return updated_user


async def delete_user(user_Id: str):
    result = await user_collection.delete_one({"user_Id": user_Id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="User not found")
    return {"detail": "User deleted successfully"}

async def list_users(skip: int = 0, limit: int = 100):
    users = await user_collection.find().skip(skip).limit(limit).to_list(limit)
    for user in users:
        user["_id"] = str(user["_id"])
    return users


async def delete_all_users():
    """
    Delete all users from the collection.
    Returns the count of deleted users.
    """
    try:
        # First get the count of users for the return message
        count = await user_collection.count_documents({})
        
        # Delete all documents
        result = await user_collection.delete_many({})
        
        if result.deleted_count > 0:
            return {
                "success": True,
                "message": f"Successfully deleted {result.deleted_count} users",
                "deleted_count": result.deleted_count
            }
        else:
            return {
                "success": True,
                "message": "No users found to delete",
                "deleted_count": 0
            }
            
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error deleting users: {str(e)}"
        )
    
# Define a model to specify user type and number
class UserGenerationRequest(BaseModel):
    num_users: int
    user_type: str  # Either 'model' or 'brand'



async def generate_fake_users(user_type: str, num_users: int):
    fake_users = []

    for _ in range(num_users):
        # Use the provided user type directly
        role = user_type
        mongo_id = ObjectId()  # Generate MongoDB _id in advance
        user_id = f"{role}_{mongo_id}"  # Generate user_Id before inserting

        user_dict = {
            "_id": mongo_id,  # Set _id manually
            "user_Id": user_id,  # Pre-generated user_Id to avoid null errors
            "name": f"Fake {user_id}",
            "email": f"{user_id}@gmail.com",  # Set correct email before inserting
            "password_Hash": generate_secure_password(),
            "profile_Picture_URL": None,
            "google_Id": None,
            "apple_Id": None,
            "auth_Method": None,
            "role": role,
            "created_At": datetime.now(timezone.utc),
            "updated_At": None,
            "description":None,
            "bio": None,
            "video_URL": None,
            "photo_URL": None,
            "social_Media_URL": None,
            "tags_Id": None,
            "booking_Availability": None,
            "preference_Id": None,
            "portfolio_URL": None
        }
        fake_users.append(user_dict)

    try:
        result = await user_collection.insert_many(fake_users)  # Insert all at once
        
        # Convert ObjectId to string for the response
        for user in fake_users:
            user["_id"] = str(user["_id"])

        return fake_users

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error generating fake users: {str(e)}"
        )

def generate_secure_password() -> str:
    special_chars = "!@#$%^&*()-_=+[]{}|;:'\",.<>?/`~"
    password_length = random.randint(12, 20)
    password_chars = (
        random.choice(string.ascii_uppercase) +
        random.choice(string.ascii_lowercase) +
        random.choice(string.digits) +
        random.choice(special_chars) +
        "".join(random.choices(string.ascii_letters + string.digits + special_chars, k=password_length - 4))
    )
    return "".join(random.sample(password_chars, len(password_chars)))