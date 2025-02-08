from datetime import *
import random
from config.setting import collection_tags, user_collection
from models.tag import TagData, UpdateTagData, TagFilterRequest
from fastapi import HTTPException
from .keywords import *
import asyncio

data_locks = asyncio.Lock()




def validate_tag_data(data: TagData):
    """Validates tag data against predefined keyword lists and numeric constraints."""

    # Validation for categorical fields
    valid_fields = {
        "eye_color": "eye_colors",
        "body_Type": "body_types",
        "work_Field": "work_fields",
        "skin_Tone": "skin_tones",
        "ethnicity": "ethnicities",
        "hair": "hair_types",
        "gender": "genders",
        "location": "locations",
        "experience_Level": "experience_levels",
        "industry_Type": "work_fields",
    }

    for field, keyword_category in valid_fields.items():
        value = getattr(data, field, None)
        if value:
            allowed_values = get_keywords(keyword_category)

            if isinstance(value, list):  # Handle multiple selections (work_Field, industry_Type)
                if not all(item in allowed_values for item in value):
                    raise HTTPException(
                        status_code=400,
                        detail=f"Invalid value in {field}. Allowed values: {allowed_values}"
                    )
            elif value not in allowed_values:  # Handle single selections
                raise HTTPException(
                    status_code=400,
                    detail=f"Invalid value '{value}' for {field}. Allowed values: {allowed_values}"
                )

    # Numeric field validation
    if data.age is not None and not (8 <= data.age <= 100):
        raise HTTPException(status_code=400, detail="Age must be between 8 and 100.")

    if data.height is not None and not (116 <= data.height <= 191):
        raise HTTPException(status_code=400, detail="Height must be between 116 and 191 cm.")

    if data.shoe_Size is not None and not (31 <= data.shoe_Size <= 50):
        raise HTTPException(status_code=400, detail="Shoe size must be between 31 and 50.")

    if data.price_range is not None and data.price_range < 0:
        raise HTTPException(status_code=400, detail="Price range cannot be negative.")


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
        # Check if user_Id exists in user_collection
        user_exists = await user_collection.find_one({"user_Id": data.user_Id})
        if not user_exists:
            raise HTTPException(status_code=400, detail="Invalid user_Id. User does not exist.")

        # Check if a tag for the user already exists
        if await collection_tags.find_one({"user_Id": data.user_Id}):
            raise HTTPException(status_code=400, detail="Tag for this user_Id already exists.")
        
        validate_tag_data(data)  # Validate before inserting
        clean_model_fields(data)
        result = await collection_tags.insert_one(data.model_dump())
        return {"message": "Tag created successfully", "id": str(result.inserted_id)}


async def create_random_tag(count: int):
    async with data_locks:
        created_count = 0
        for _ in range(count):
            tag = await generate_tag()
            if tag:  # Ensure tag is not None
                await collection_tags.insert_one(tag.model_dump())
                created_count += 1
            else:
                break  # Stop if no more available user IDs
        return {"message": f"{created_count} new tags created successfully."}




async def get_unused_user_ids(client_Type: str):
    """Fetch all user IDs from user_collection and remove those already tagged."""
    all_user_ids = {user["user_Id"] async for user in user_collection.find({"user_Id": {"$regex": f"^{client_Type.lower()}"}})}
    used_user_ids = {tag["user_Id"] async for tag in collection_tags.find({"client_Type": client_Type}, {"user_Id": 1})}

    # Keep only user IDs that don't have a tag yet
    unused_user_ids = list(all_user_ids - used_user_ids)
    return unused_user_ids


async def generate_tag():
    client_type = random.choice(["Model", "Brand"])
    user_Ids = await get_unused_user_ids(client_type)  # Fetch only user IDs that don't have tags

    if not user_Ids:
        return None  # No available user IDs left to tag

    user_Id = random.choice(user_Ids)  # Pick a user ID that doesn't have a tag

    if client_type == "Model":
        tag = TagData(
            client_Type=client_type,
            user_Id=user_Id,
            age=random.randint(8, 100),
            height=random.randint(116, 191),
            eye_color=random.choice(get_keywords("eye_colors")),
            body_Type=random.choice(get_keywords("body_types")),
            work_Field=random.sample(get_keywords("work_fields"), 3),
            skin_Tone=random.choice(get_keywords("skin_tones")),
            ethnicity=random.choice(get_keywords("ethnicities")),
            hair=random.choice(get_keywords("hair_types")),
            experience_Level=random.choice(get_keywords("experience_levels")),
            gender=random.choice(get_keywords("genders")),
            location=random.choice(get_keywords("locations")),
            shoe_Size=random.randint(31, 50),
            price_range=random.randrange(200, 30000, 500),
            saved_time=datetime.now(timezone.utc)  
        )
    else:
        tag = TagData(
            client_Type=client_type,
            user_Id=user_Id,
            industry_Type=random.sample(get_keywords("work_fields"), 3),
            location=random.choice(get_keywords("locations")),
            price_range=random.randrange(200, 30000, 500),
            saved_time=datetime.now(timezone.utc)  
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
        

        # Fetch existing tag data to check client type
        existing_tag = await collection_tags.find_one({"user_Id": user_id})
        if not existing_tag:
            raise HTTPException(status_code=404, detail="Tag not found.")

        # Validate the updates
        validate_tag_updates(existing_tag["client_Type"], update_data)

        result = await collection_tags.update_one({"user_Id": user_id}, {"$set": update_data})
        if result.matched_count == 0:
            raise HTTPException(status_code=404, detail="Tag not found.")
        return {"message": "Tag updated successfully"}

def validate_tag_updates(client_Type: str, update_data: dict):
    """Validates updates against allowed values and numeric constraints."""

    # Define allowed categorical fields
    valid_fields = {
        "eye_color": "eye_colors",
        "body_Type": "body_types",
        "work_Field": "work_fields",
        "skin_Tone": "skin_tones",
        "ethnicity": "ethnicities",
        "hair": "hair_types",
        "gender": "genders",
        "location": "locations",
        "experience_Level": "experience_levels",
        "industry_Type": "work_fields",
    }

    # Validate categorical fields
    for field, category in valid_fields.items():
        if field in update_data:
            value = update_data[field]
            allowed_values = get_keywords(category)

            if isinstance(value, list):  # Handle fields with multiple values
                if not all(item in allowed_values for item in value):
                    raise HTTPException(
                        status_code=400,
                        detail=f"Invalid values in {field}. Allowed values: {allowed_values}"
                    )
            elif value not in allowed_values:  # Handle single selections
                raise HTTPException(
                    status_code=400,
                    detail=f"Invalid value '{value}' for {field}. Allowed values: {allowed_values}"
                )

    # Validate numerical fields
    if "age" in update_data and not (8 <= update_data["age"] <= 100):
        raise HTTPException(status_code=400, detail="Age must be between 8 and 100.")

    if "height" in update_data and not (116 <= update_data["height"] <= 191):
        raise HTTPException(status_code=400, detail="Height must be between 116 and 191 cm.")

    if "shoe_Size" in update_data and not (31 <= update_data["shoe_Size"] <= 50):
        raise HTTPException(status_code=400, detail="Shoe size must be between 31 and 50.")

    if "price_range" in update_data and update_data["price_range"] < 0:
        raise HTTPException(status_code=400, detail="Price range cannot be negative.")

    # Ensure `Model` does not update `industry_Type` and `Brand` does not update `work_Field`
    if client_Type == "Model" and "industry_Type" in update_data:
        raise HTTPException(status_code=400, detail="Models cannot have industry_Type.")

    if client_Type == "Brand" and any(field in update_data for field in ["age", "height", "eye_color", "body_Type", "work_Field", "skin_Tone", "ethnicity", "hair", "experience_Level", "gender", "shoe_Size"]):
        raise HTTPException(status_code=400, detail="Brands cannot update model-specific fields.")

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
    # matched_tags = await collection_tags.find(query).to_list(length=None)

    # Use aggregation with $sample to get 100 random documents
    matched_tags = await collection_tags.aggregate([
        {"$match": query},  # Filter documents based on the query
        {"$sample": {"size": 100}}  # Randomly select 100 documents
    ]).to_list(length=None)
    
    return [tag["user_Id"] for tag in matched_tags]

async def delete_all_tags_service():
    """Deletes all tags from collection_tags."""
    async with data_locks:
        result = await collection_tags.delete_many({})
        return {"message": f"Deleted {result.deleted_count} tags successfully."}