from fastapi import APIRouter, HTTPException
from typing import List, Dict
from models.User import User
from services.user_services import *

router = APIRouter(prefix="/users", tags=["Users"])

@router.post("/", status_code=201, response_model=Dict)
async def create_user_endpoint(user: User):
    """Create a new user"""
    created_user = await create_user(user)
    return created_user

@router.get("/{user_Id}", response_model=Dict)
async def get_user_endpoint(user_Id: str):
    """Get a user by their user_Id"""
    return await get_user(user_Id)

@router.put("/{user_Id}", response_model=dict)
async def update_user_endpoint(user_Id: str, updated_data: UserUpdate):
    """Update a user by their user_Id (partial update)."""
    return await update_user(user_Id, updated_data)

@router.delete("/{user_Id}")
async def delete_user_endpoint(user_Id: str):
    """Delete a user by their user_Id"""
    return await delete_user(user_Id)

@router.get("/", response_model=List[Dict])
async def list_users_endpoint(skip: int = 0, limit: int = 100):
    """List all users with pagination"""
    return await list_users(skip=skip, limit=limit)

# @router.post("/generate-fake-users/", response_model=List[Dict])
# async def generate_fake_users_endpoint(num_users: int):
#     """
#     Generate fake users for testing purposes.
    
#     Args:
#         num_users (int): Number of fake users to generate
    
#     Returns:
#         List[Dict]: List of generated user documents
#     """
#     if num_users <= 0:
#         raise HTTPException(
#             status_code=400,
#             detail="Number of users must be greater than 0"
#         )
#     if num_users > 100:
#         raise HTTPException(
#             status_code=400,
#             detail="Cannot generate more than 100 users at once"
#         )
        
#     try:
#         generated_users = await generate_fake_users(num_users)
#         return generated_users
#     except Exception as e:
#         raise HTTPException(
#             status_code=500,
#             detail=f"Error generating fake users: {str(e)}"
#         )


@router.post("/generate-fake-users/", response_model=List[Dict])
async def generate_fake_users_endpoint(request: UserGenerationRequest):
    """
    Generate fake users for testing purposes with a specified type.
    
    Args:
        request (UserGenerationRequest): Number of fake users and type ('model' or 'brand')
    
    Returns:
        List[Dict]: List of generated user documents
    """
    num_users = request.num_users
    user_type = request.user_type

    if num_users <= 0:
        raise HTTPException(
            status_code=400,
            detail="Number of users must be greater than 0"
        )
    if num_users > 100:
        raise HTTPException(
            status_code=400,
            detail="Cannot generate more than 100 users at once"
        )
    if user_type not in ["model", "brand"]:
        raise HTTPException(
            status_code=400,
            detail="User type must be either 'model' or 'brand'"
        )
        
    try:
        generated_users = await generate_fake_users(user_type, num_users)
        return generated_users
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error generating fake users: {str(e)}"
        )
    

# In routes/user_routes.py

@router.delete("/delete-all/", status_code=200)
async def delete_all_users_endpoint():
    """
    Delete all users from the database.
    This is a dangerous operation and should be protected in production.
    """
    try:
        result = await delete_all_users()
        return result
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error deleting all users: {str(e)}"
        )