from datetime import *
import random
from config.setting import collection_preferences,user_collection
from models.tag import TagFilterRequest
from models.preference_model import PreferenceData, UpdatePreferenceData, PreferenceFilterRequest
from fastapi import HTTPException
import asyncio

from services.keywords import get_keywords
from services.tag_services import filter_tags
from services.rating_services import filter_users_by_most_frequent_rating

data_locks = asyncio.Lock()

def validate_Preference_data(data: PreferenceData):
    """Validates Preference data against predefined keyword lists and numeric constraints."""

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


def clean_model_fields(data: PreferenceData):
    """Set fields to None based on client_Type."""
    if data.client_Type == "Brand":
        for field in [
            "age", "height", "eye_color", "body_Type", "work_Field", "skin_Tone",
            "ethnicity", "hair", "experience_Level", "gender", "shoe_Size"
        ]:
            setattr(data, field, None)
    elif data.client_Type == "Model":
        data.industry_Type = None

async def create_Preferences(data: PreferenceData):
    async with data_locks:
        # Check if user_Id exists in user_collection
        user_exists = await user_collection.find_one({"user_Id": data.user_Id})
        if not user_exists:
            raise HTTPException(status_code=400, detail="Invalid user_Id. User does not exist.")

        # Check if a preferences for the user already exists
        if await collection_preferences.find_one({"user_Id": data.user_Id}):
            raise HTTPException(status_code=400, detail="preference for this user_Id already exists.")
        
        validate_Preference_data(data) 
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

async def get_filtered_Tags_On_Ratings_For_Preferences(user_id: str):
    preference = await get_filtered_Preferences(user_id)
    filterResults = await filter_tags(preference)
    rating_level = await get_preference_and_rating(user_id)
    
    # Filter users based on their most frequent rating
    if rating_level is not None:
        filtered_users = await filter_users_by_most_frequent_rating(filterResults, rating_level)
        return filtered_users
    
    return filterResults




async def update_Preferences(user_id: str, updates: UpdatePreferenceData):
    async with data_locks:
        update_data = {k: v for k, v in updates.model_dump(exclude_unset=True).items()}
        if not update_data:
            raise HTTPException(status_code=400, detail="No fields to update.")
        

                # Fetch existing tag data to check client type
        existing_tag = await collection_preferences.find_one({"user_Id": user_id})
        if not existing_tag:
            raise HTTPException(status_code=404, detail="Tag not found.")

        # Validate the updates
        validate_Preferences_updates(existing_tag["client_Type"], update_data)

        result = await collection_preferences.update_one({"user_Id": user_id}, {"$set": update_data})
        if result.matched_count == 0:
            raise HTTPException(status_code=404, detail="Preferences not found.")
        return {"message": "Preferences updated successfully"}


def validate_Preferences_updates(client_Type: str, update_data: dict):
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


def build_query(data: PreferenceFilterRequest):
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

async def filter_Preferences(data: PreferenceFilterRequest):
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
        tag = PreferenceData(
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
            rating_level=random.randint(1, 5),
            saved_time=datetime.now(timezone.utc)  # Add the saved_time field
        )
    else:
        tag = PreferenceData(
            client_Type=client_type,
            user_Id=user_Id,
            industry_Type=random.choice(get_keywords("work_fields")),
            location=random.choice(get_keywords("locations")),
            price_range=random.randrange(200, 30000, 500),
            rating_level=random.randint(1, 5),
            saved_time=datetime.now(timezone.utc)  # Add the saved_time field
        )

    return tag

async def delete_all_preferences_service():
    """Deletes all tags from collection_tags."""
    async with data_locks:
        result = await collection_preferences.delete_many({})
        return {"message": f"Deleted {result.deleted_count} preferences successfully."}

async def get_preference_and_rating(user_id: str):
    """
    Retrieve rating level for a specific user from their preferences.
    Returns the rating level or None if not found.
    """
    preference = await collection_preferences.find_one({"user_Id": user_id})
    if not preference:
        raise HTTPException(status_code=404, detail="Preferences not found.")
    
    # Extract and return only the rating level
    return preference.get("rating_level", None)