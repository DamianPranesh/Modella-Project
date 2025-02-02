from datetime import *
import random
from config.setting import collection_preferences,user_collection
from models.tag import TagData, UpdateTagData, TagFilterRequest
from fastapi import HTTPException
import asyncio

from services.keywords import get_keywords
from services.tag_services import filter_tags

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

async def create_Preferences(data: TagData):
    async with data_locks:
        # Check if user_Id exists in user_collection
        user_exists = await user_collection.find_one({"user_Id": data.user_Id})
        if not user_exists:
            raise HTTPException(status_code=400, detail="Invalid user_Id. User does not exist.")

        # Check if a preferences for the user already exists
        if await collection_preferences.find_one({"user_Id": data.user_Id}):
            raise HTTPException(status_code=400, detail="preference for this user_Id already exists.")
        
        clean_model_fields(data)
        result = await collection_preferences.insert_one(data.model_dump())
        return {"message": "preferences created successfully", "id": str(result.inserted_id)}
    

async def get_Preferences(user_id: str):
    preference = await collection_preferences.find_one({"user_Id": user_id})
    if not preference:
        raise HTTPException(status_code=404, detail="Preferences not found.")
    preference["_id"] = str(preference["_id"])
    return preference

async def get_filtered_Preferences(user_id: str):
    """Retrieve preferences by user_id and return them in TagFilterRequest format."""
    preference = await collection_preferences.find_one({"user_Id": user_id})
    if not preference:
        raise HTTPException(status_code=404, detail="Preferences not found.")
    
    # Remove unwanted fields like `user_Id` and `_id`
    filtered_data = {
        key: preference[key] 
        for key in TagFilterRequest.model_fields.keys() 
        if key in preference
    }
    
    # Convert the filtered data into a TagFilterRequest object
    return TagFilterRequest(**filtered_data)


async def get_filtered_Tags_On_Preferences(user_id: str):
    preference= await get_filtered_Preferences(user_id)
    filterResults= await filter_tags(preference)
    return filterResults


async def update_Preferences(user_id: str, updates: UpdateTagData):
    async with data_locks:
        update_data = {k: v for k, v in updates.model_dump(exclude_unset=True).items()}
        if not update_data:
            raise HTTPException(status_code=400, detail="No fields to update.")
        
        result = await collection_preferences.update_one({"user_Id": user_id}, {"$set": update_data})
        if result.matched_count == 0:
            raise HTTPException(status_code=404, detail="Preferences not found.")
        return {"message": "Preferences updated successfully"}


async def delete_Preferences(user_id: str):
    async with data_locks:
        result = await collection_preferences.delete_one({"user_Id": user_id})
        if result.deleted_count == 0:
            raise HTTPException(status_code=404, detail="Preferences not found.")
        return {"message": "Preferences deleted successfully"}


async def list_Preferences():
    return [
        {**preference, "_id": str(preference["_id"])}
        async for preference in collection_preferences.find()
    ]


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

async def filter_Preferences(data: TagFilterRequest):
    query = build_query(data)
    print(f"Generated Query: {query}")
    matched_tags = await collection_preferences.find(query).to_list(length=None)
    return [preference["user_Id"] for preference in matched_tags]











async def create_random_preference(count : int):
    async with data_locks:
        created_count = 0
        for i in range(count):
            tag = await generate_preference()
            if tag:  # Ensure tag is not None or empty
                await collection_preferences.insert_one(tag.model_dump())  # Insert the tag into the collection
                created_count += 1
            else:
                break
        return {"message": f"{created_count} tags created successfully."}

# async def get_all_user_ids(client_Type: str):
#     user_ids = []
#     async for tag in collection_preferences.find({"client_Type": client_Type}, {"user_Id": 1}):  # Select only the user_Id field
#         user_ids.append(tag["user_Id"])
#     return user_ids

# def generate_ids(user_Ids: list, client_Type: str):
#     unique = False
#     while not unique:
#         user_Id = client_Type.lower()+ str(random.randint(100,1000))
#         if user_Id not in user_Ids:
#             unique = True
#     return user_Id

async def get_unused_user_ids(client_Type: str):
    """Fetch all user IDs from user_collection and remove those already tagged."""
    all_user_ids = {user["user_Id"] async for user in user_collection.find({"user_Id": {"$regex": f"^{client_Type.lower()}"}})}
    used_user_ids = {tag["user_Id"] async for tag in collection_preferences.find({"client_Type": client_Type}, {"user_Id": 1})}

    # Keep only user IDs that don't have a  yet
    unused_user_ids = list(all_user_ids - used_user_ids)
    return unused_user_ids

async def generate_preference():
    client_type = random.choice(["Model", "Brand"])
    client = "Brand" if client_type == "Model" else "Model"
    user_Ids = await get_unused_user_ids(client)
     # to get the inverse of the client type in preferences.
    #user_Id = generate_ids(user_Ids, client)  # Get a unique user_Id
    
    if not user_Ids:
        return None
    
    user_Id = random.choice(user_Ids)
    
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

async def delete_all_preferences_service():
    """Deletes all tags from collection_tags."""
    async with data_locks:
        result = await collection_preferences.delete_many({})
        return {"message": f"Deleted {result.deleted_count} preferences successfully."}