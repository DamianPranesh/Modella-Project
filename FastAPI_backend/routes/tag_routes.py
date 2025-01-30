from typing import List
from fastapi import APIRouter, HTTPException
from models.tag import TagData, UpdateTagData, TagFilterRequest, CreateRandomTagsRequest
from services.tag_services import create_random_tag, create_tag, get_tag, update_tag, delete_tag, list_tags, filter_tags

router = APIRouter()

@router.post("/create_tag/", response_model=dict)
async def create_tag_endpoint(data: TagData):
    return await create_tag(data)

@router.get("/get_tag/{user_id}/", response_model=dict)
async def get_tag_endpoint(user_id: str):
    return await get_tag(user_id)

@router.put("/update_tag/{user_id}/", response_model=dict)
async def update_tag_endpoint(user_id: str, updates: UpdateTagData):
    return await update_tag(user_id, updates)

@router.delete("/delete_tag/{user_id}/", response_model=dict)
async def delete_tag_endpoint(user_id: str):
    return await delete_tag(user_id)

@router.get("/list_tags/", response_model=list)
async def list_tags_endpoint():
    return await list_tags()

@router.post("/filter_tags/", response_model=List[str])
async def filter_tags_endpoint(data: TagFilterRequest):
    """
    Filter tags based on the provided parameters and return matching user_Id values.
    """
    print(data)
    return await filter_tags(data)


@router.post("/create-random-tags/")
async def create_random_tags(request: CreateRandomTagsRequest):
    try:
        # Call the service function to create random tags
        result = await create_random_tag(request.count)
        return result  # Return the result with a success message
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

