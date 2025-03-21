from fastapi import APIRouter, HTTPException
from models.rating_model import Rating
from services.rating_services import *
from typing import List, Optional, Dict, Any

router = APIRouter(prefix="/ratings", tags=["Ratings"])

@router.post("/", response_model=dict)
async def create_rating(rating: Rating):
    response = await create_rating_service(rating)
    if "error" in response:
        raise HTTPException(status_code=400, detail=response["error"])
    return response

@router.put("/{rating_id}", response_model=dict)
async def update_rating(rating_id: str, ratedBy_Id: str, update_data: Dict[str, Any]):
    # Call the updated service function with the rating_id, ratedBy_Id, and the update data
    response = await update_rating_service(rating_id, ratedBy_Id, update_data)
    
    if "error" in response:
        raise HTTPException(status_code=400, detail=response["error"])
    
    return response

@router.delete("/{rating_id}", response_model=dict)
async def delete_rating(rating_id: str, ratedBy_Id: str):
    response = await delete_rating_service(rating_id, ratedBy_Id)
    if "error" in response:
        raise HTTPException(status_code=400, detail=response["error"])
    return response

@router.get("/", response_model=List[Rating])
async def get_ratings(user_Id: Optional[str] = None):
    return await get_ratings_service(user_Id)

@router.delete("/delete-all/")
async def delete_all_ratings():
    deleted_count = await delete_all_ratings_service()
    if deleted_count == 0:
        raise HTTPException(status_code=404, detail="No ratings found to delete")
    return {"message": f"Successfully deleted {deleted_count} ratings"}


@router.post("/generate/{num_reviews}")
async def generate_random_reviews(num_reviews: int):
    if num_reviews <= 0:
        raise HTTPException(status_code=400, detail="Number of reviews must be greater than 0")
    
    response = await generate_random_reviews_service(num_reviews)
    if "error" in response:
        raise HTTPException(status_code=400, detail=response["error"])
    
    return response

@router.get("/recent/{user_Id}")
async def get_recent_reviews(user_Id: str):
    """Fetch the 10 most recent reviews for a user from another user."""
    reviews = await get_recent_reviews_service(user_Id)
    if "error" in reviews:
        raise HTTPException(status_code=404, detail=reviews["error"])
    return reviews


@router.get("/level/{user_Id}/{rating_level}")
async def get_ratings_by_level(user_Id: str, rating_level: int):
    """Fetch all ratings for a user at a specific rating level (sorted by most recent)."""
    ratings = await get_ratings_by_level_service(user_Id, rating_level)
    if "error" in ratings:
        raise HTTPException(status_code=400, detail=ratings["error"])
    return ratings