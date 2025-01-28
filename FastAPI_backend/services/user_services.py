from datetime import datetime, timezone
from fastapi import HTTPException, status
from models.User import User
from config.setting import user_collection

async def create_user(user: User):
    # Check for existing user_Id or email
    existing_user = await user_collection.find_one(
        {"$or": [{"user_Id": user.user_Id}, {"email": user.email}]}
    )
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="User with this user_Id or email already exists.",
        )
    
    user_dict = user.model_dump()
    result = await user_collection.insert_one(user_dict)
    return str(result.inserted_id)

async def get_user(user_Id: str):
    user = await user_collection.find_one({"user_Id": user_Id})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    user["_id"] = str(user["_id"])
    return user

async def update_user(user_Id: str, updated_data: User):
    updated_data_dict = {k: v for k, v in updated_data.model_dump().items() if v is not None}
    updated_data_dict["updated_At"] = datetime.now(timezone.utc)
    
    result = await user_collection.update_one(
        {"user_Id": user_Id}, {"$set": updated_data_dict}
    )
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="User not found")
    
    updated_user = await user_collection.find_one({"user_Id": user_Id})
    updated_user["_id"] = str(updated_user["_id"])
    return updated_user

async def delete_user(user_Id: str):
    result = await user_collection.delete_one({"user_Id": user_Id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="User not found")
    return {"detail": "User deleted successfully"}

async def list_users(limit: int = 100):
    users = await user_collection.find().to_list(limit)
    for user in users:
        user["_id"] = str(user["_id"])
    return users
