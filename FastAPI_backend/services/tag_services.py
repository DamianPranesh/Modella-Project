from config.setting import collection_tags
from models.tag import TagData, UpdateTagData, TagFilterRequest
from fastapi import HTTPException
import asyncio

data_locks = asyncio.Lock()

async def create_tag(data: TagData):
    async with data_locks:
        existing_tag = await collection_tags.find_one({"user_Id": data.user_Id})
        if existing_tag:
            raise HTTPException(status_code=400, detail="Tag for this user_Id already exists.")

        # Set attributes to None based on client_Type
        if data.client_Type == "Brand":
            data.age = data.height = data.eye_color = data.body_Type = data.work_Field = \
            data.skin_Tone = data.ethnicity = data.hair = data.experience_Level = \
            data.gender = data.shoe_Size = None
        elif data.client_Type == "Model":
            data.industry_Type = None

        result = await collection_tags.insert_one(data.model_dump())
        return {"message": "Tag created successfully", "id": str(result.inserted_id)}

async def get_tag(user_id: str):
    tag = await collection_tags.find_one({"user_Id": user_id})
    if not tag:
        raise HTTPException(status_code=404, detail="Tag not found.")
    tag["_id"] = str(tag["_id"])
    return tag

async def update_tag(user_id: str, updates: UpdateTagData):
    async with data_locks:
        update_data = {k: v for k, v in updates.model_dump(exclude_unset=True).items()}
        if not update_data:
            raise HTTPException(status_code=400, detail="No fields to update.")

        result = await collection_tags.update_one({"user_Id": user_id}, {"$set": update_data})
        if result.matched_count == 0:
            raise HTTPException(status_code=404, detail="Tag not found.")
        return {"message": "Tag updated successfully"}

async def delete_tag(user_id: str):
    async with data_locks:
        result = await collection_tags.delete_one({"user_Id": user_id})
        if result.deleted_count == 0:
            raise HTTPException(status_code=404, detail="Tag not found.")
        return {"message": "Tag deleted successfully"}

async def list_tags():
    tags = []
    async for tag in collection_tags.find():
        tag["_id"] = str(tag["_id"])
        tags.append(tag)
    return tags


async def filter_tags(data: TagFilterRequest):
    query = {"client_Type": data.client_Type}
    
    # Dynamically build the query based on the client_Type and provided fields
    if data.client_Type == "Model":
        if data.location:
            query["location"] = data.location
        if data.industry_Type:
            query["industry_Type"] = data.industry_Type
        if data.price_range:
            query["price_range"] = data.price_range
    elif data.client_Type == "Brand":
        optional_fields = [
            "age", "height", "eye_color", "body_Type", "work_Field",
            "skin_Tone", "ethnicity", "hair", "experience_Level",
            "gender", "location", "shoe_Size", "price_range"
        ]
        for field in optional_fields:
            value = getattr(data, field)
            if value is not None:
                query[field] = value

    # Query the collection
    matched_tags = await collection_tags.find(query).to_list(length=None)
    # Return only the user_Id fields from matched documents
    return [tag["user_Id"] for tag in matched_tags]
