from fastapi import APIRouter, Depends
from typing import List
from models.User import User
from services.user_services import *

router = APIRouter()

@router.post("/", status_code=201)
async def create_user_endpoint(user: User):
    user_id = await create_user(user)
    return {"user_id": user_id, "message": "User created successfully"}

@router.get("/{user_Id}")
async def get_user_endpoint(user_Id: str):
    return await get_user(user_Id)

@router.put("/{user_Id}")
async def update_user_endpoint(user_Id: str, updated_data: User):
    return await update_user(user_Id, updated_data)

@router.delete("/{user_Id}")
async def delete_user_endpoint(user_Id: str):
    return await delete_user(user_Id)

@router.get("/", response_model=List[User])
async def list_users_endpoint(limit: int = 100):
    return await list_users(limit)
