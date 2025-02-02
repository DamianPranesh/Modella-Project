from typing import List
from fastapi import APIRouter
from models.tag import CreateRandomTagsRequest, TagData, UpdateTagData, TagFilterRequest
from services.preferences_services import *

router = APIRouter(prefix="/preferences", tags=["Preferences"])

@router.post("/create_preferences/", response_model=dict)
async def create_preferences_endpoint(data: TagData):
    return await create_Preferences(data)

@router.get("/get_preferences/{user_id}/", response_model=dict)
async def get_preferences_endpoint(user_id: str):
    return await get_Preferences(user_id)

@router.put("/update_preferences/{user_id}/", response_model=dict)
async def update_preferences_endpoint(user_id: str, updates: UpdateTagData):
    return await update_Preferences(user_id, updates)

@router.delete("/delete_preferences/{user_id}/", response_model=dict)
async def delete_preferences_endpoint(user_id: str):
    return await delete_Preferences(user_id)

@router.get("/list_preferences/", response_model=list)
async def list_preferences_endpoint():
    return await list_Preferences()

@router.post("/filter_preferences/", response_model=List[str])
async def filter_preferences_endpoint(data: TagFilterRequest):
    """
    Filter tags based on the provided parameters and return matching user_Id values.
    """
    print(data)
    return await filter_Preferences(data)

@router.get("/preferences/{user_id}/filtered", response_model=TagFilterRequest)
async def get_filtered_preferences(user_id: str):
    return await get_filtered_Preferences(user_id)


@router.get("/tags_on_preferences/{user_id}/filtered", response_model=List[str])
async def get_filtered_tags_on_preferences(user_id: str):
    """
    Retrieves tags based on a user's preferences.

    - **user_id**: The ID of the user whose preferences will be used for filtering tags.
    """
    return await get_filtered_Tags_On_Preferences(user_id)


@router.post("/create-random-preferences/")
async def create_random_tags(request: CreateRandomTagsRequest):
    try:
        # Call the service function to create random tags
        result = await create_random_preference(request.count)
        return result  # Return the result with a success message
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    

@router.delete("/preferences/delete-all")
async def delete_all_preferences():
    """API to delete all tags from collection_preferences."""
    return await delete_all_preferences_service()