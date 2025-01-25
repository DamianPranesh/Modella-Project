from datetime import *
import random
from config.setting import collection_tags
from models.tag import TagData, UpdateTagData, TagFilterRequest
from fastapi import HTTPException
from .keywords import *
import asyncio

data_locks = asyncio.Lock()


def clean_model_fields(data: TagData):
    """Set fields to None based on client_Type."""
    if data.client_Type == "Brand":
        for field in [
            "age", "height", "eye_color", "body_Type", "work_Field", "skin_Tone",
            "ethnicity", "hair", "experience_Level", "gender", "shoe_Size"
        ]:
            setattr(data, field, None)
    elif data.client_Type == "Model":
        data.industry_Type = None


def build_query(data: TagFilterRequest):
    """Dynamically build the query based on client_Type and fields."""
    query = {"client_Type": data.client_Type}
    optional_fields = {
        "Brand": ["location", "industry_Type", "price_range"],
        "Model": [
            "age", "height", "eye_color", "body_Type", "work_Field", "skin_Tone",
            "ethnicity", "hair", "experience_Level", "gender", "location", "shoe_Size", "price_range"
        ],
    }.get(data.client_Type, [])
    
    for field in optional_fields:
        value = getattr(data, field, None)
        if value is not None:
            query[field] = value
    return query


async def create_tag(data: TagData):
    async with data_locks:
        if await collection_tags.find_one({"user_Id": data.user_Id}):
            raise HTTPException(status_code=400, detail="Tag for this user_Id already exists.")
        
        clean_model_fields(data)
        result = await collection_tags.insert_one(data.model_dump())
        return {"message": "Tag created successfully", "id": str(result.inserted_id)}





async def create_random_tag(count : int):
    async with data_locks:
        for i in range(count):
            tag = await generate_tag()
            if tag:  # Ensure tag is not None or empty
                result = await collection_tags.insert_one(tag.model_dump())  # Insert the tag into the collection
        return {"message": f"{count} tags created successfully."}

async def get_all_user_ids(client_Type: str):
    user_ids = []
    async for tag in collection_tags.find({"client_Type": client_Type}, {"user_Id": 1}):  # Select only the user_Id field
        user_ids.append(tag["user_Id"])
    return user_ids

def generate_ids(user_Ids: list, client_Type: str):
    unique = False
    while not unique:
        user_Id = client_Type.lower()+ str(random.randint(100,1000))
        if user_Id not in user_Ids:
            unique = True
    return user_Id

async def generate_tag():
    client_type = random.choice(["Model", "Brand"])
    user_Ids = await get_all_user_ids(client_type)
    user_Id = generate_ids(user_Ids, client_type)  # Get a unique user_Id

    if client_type == "Model":
        tag = TagData(
            client_Type=client_type,
            user_Id=user_Id,
            age=random.randint(8, 100),
            height=random.randint(116, 191),
            eye_color=random.choice(get_keywords("eye_colors")),
            body_Type=random.choice(get_keywords("body_types")),
            work_Field=random.choice(get_keywords("work_fields")),
            skin_Tone=random.choice(get_keywords("skin_tones")),
            ethnicity=random.choice(get_keywords("ethnicities")),
            hair=random.choice(get_keywords("hair_types")),
            experience_Level=random.choice(get_keywords("experience_levels")),
            gender=random.choice(get_keywords("genders")),
            location=random.choice(get_keywords("locations")),
            shoe_Size=random.randint(31, 50),
            price_range=random.randrange(200, 30000, 500),
            saved_time=datetime.now(timezone.utc)  # Add the saved_time field
        )
    else:
        tag = TagData(
            client_Type=client_type,
            user_Id=user_Id,
            industry_Type=random.choice(get_keywords("work_fields")),
            location=random.choice(get_keywords("locations")),
            price_range=random.randrange(200, 30000, 500),
            saved_time=datetime.now(timezone.utc)  # Add the saved_time field
        )

    return tag





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
    return [
        {**tag, "_id": str(tag["_id"])}
        async for tag in collection_tags.find()
    ]


async def filter_tags(data: TagFilterRequest):
    query = build_query(data)
    print(f"Generated Query: {query}")
    matched_tags = await collection_tags.find(query).to_list(length=None)
    return [tag["user_Id"] for tag in matched_tags]

