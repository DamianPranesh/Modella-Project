from datetime import datetime, timezone
from random import choice, randint, sample
from fastapi import APIRouter, HTTPException
from typing import List
from pymongo import ReturnDocument
from models.Modella_preference import BrandModelPreferenceFilterRequest, ModelBrandPreferenceData, ModelBrandPreferenceFilterRequest, ModelProjectPreferenceData, BrandModelPreferenceData, ModelProjectPreferenceFilterRequest
from models.Modella_tag import CreateRandomTagsRequest, ProjectTagFilterRequest
from services.Modellatag_service import filter_modelproject_tags, filter_project_tags
from services.keywords import get_keywords
from services.model_convert import convert_model
from services.rating_services import get_ratings_by_level_service
from services.validate_tag import validate_tag_data
from config.setting import  user_collection, model_preferences_collection, brand_preferences_collection, model_brand_preferences_collection, model_tags_collection, brand_tags_collection


router = APIRouter(prefix="/ModellaPreference", tags=["Modella Preference"])

def serialize_document(doc):
    """Helper function to serialize MongoDB documents."""
    doc["id"] = str(doc["_id"])
    del doc["_id"]
    return doc

# Create Preference (Ensuring Unique user_id per preference)
@router.post("/preferences/model/", response_model=ModelProjectPreferenceData)
async def create_model_preference(preference: ModelProjectPreferenceData):
    # Check if user_Id exists in user_collection
    user_exists = await user_collection.find_one({"user_Id": preference.user_Id})
    if not user_exists:
        raise HTTPException(status_code=400, detail="Invalid user_Id. User does not exist.")
    
    existing_preference = await model_preferences_collection.find_one({"user_Id": preference.user_Id})
    if existing_preference:
        raise HTTPException(status_code=400, detail="Preference already exists for this user.")
    validate_tag_data(preference)
    result = await model_preferences_collection.insert_one(preference.model_dump())
    return {"id": str(result.inserted_id), **preference.model_dump()}

@router.post("/preferences/brand/", response_model=BrandModelPreferenceData)
async def create_brand_preference(preference: BrandModelPreferenceData):
    # Check if user_Id exists in user_collection
    user_exists = await user_collection.find_one({"user_Id": preference.user_Id})
    if not user_exists:
        raise HTTPException(status_code=400, detail="Invalid user_Id. User does not exist.")

    existing_preference = await brand_preferences_collection.find_one({"user_Id": preference.user_Id})
    if existing_preference:
        raise HTTPException(status_code=400, detail="Preference already exists for this user.")
    validate_tag_data(preference)
    result = await brand_preferences_collection.insert_one(preference.model_dump())
    return {"id": str(result.inserted_id), **preference.model_dump()}

@router.post("/preferences/model-brand/", response_model=ModelBrandPreferenceData)
async def create_model_brand_preference(preference: ModelBrandPreferenceData):
    # Check if user_Id exists in user_collection
    user_exists = await user_collection.find_one({"user_Id": preference.user_Id})
    if not user_exists:
        raise HTTPException(status_code=400, detail="Invalid user_Id. User does not exist.")

    existing_preference = await model_brand_preferences_collection.find_one({"user_Id": preference.user_Id})
    if existing_preference:
        raise HTTPException(status_code=400, detail="Preference already exists for this user.")
    validate_tag_data(preference)
    result = await model_brand_preferences_collection.insert_one(preference.model_dump())
    return {"id": str(result.inserted_id), **preference.model_dump()}






# Read Preferences (Single & Multiple)
@router.get("/preferences/model/{user_id}", response_model=ModelProjectPreferenceData)
async def get_model_preference(user_id: str):
    preference = await model_preferences_collection.find_one({"user_Id": user_id})
    if preference:
        return ModelProjectPreferenceData(**preference)
    raise HTTPException(status_code=404, detail="Model preference not found")

@router.get("/preferences/brand/{user_id}", response_model=BrandModelPreferenceData)
async def get_brand_preference(user_id: str):
    preference = await brand_preferences_collection.find_one({"user_Id": user_id})
    if preference:
        return BrandModelPreferenceData(**preference)
    raise HTTPException(status_code=404, detail="Brand preference not found")

@router.get("/preferences/model-brand/{user_id}", response_model=ModelBrandPreferenceData)
async def get_model_brand_preference(user_id: str):
    preference = await model_brand_preferences_collection.find_one({"user_Id": user_id})
    if preference:
        return ModelBrandPreferenceData(**preference)
    raise HTTPException(status_code=404, detail="Brand preference not found")




@router.get("/preferences/model-all", response_model=List[ModelProjectPreferenceData])
async def get_all_model_preferences():
    preferences = await model_preferences_collection.find().limit(100).to_list(None)
    return [ModelProjectPreferenceData(**serialize_document(pref)) for pref in preferences]

@router.get("/preferences/brand-all", response_model=List[BrandModelPreferenceData])
async def get_all_brand_preferences():
    preferences = await brand_preferences_collection.find().limit(100).to_list(None)
    return [BrandModelPreferenceData(**serialize_document(pref)) for pref in preferences]

@router.get("/preferences/model-brand-all", response_model=List[ModelBrandPreferenceData])
async def get_all_model_brand_preferences():
    preferences = await model_brand_preferences_collection.find().limit(100).to_list(None)
    return [ModelBrandPreferenceData(**serialize_document(pref)) for pref in preferences]





# Update Preference
@router.put("/preferences/model/{user_id}", response_model=ModelProjectPreferenceData)
async def update_model_preference(user_id: str, preference_data : dict):
    existing_preference = await model_preferences_collection.find_one({"user_Id": user_id})
    if not existing_preference:
        raise HTTPException(status_code=404, detail="Preference not found")
    
    updated_pref_data ={**existing_preference, **preference_data}

    # Convert to Pydantic model and validate
    updated_pref = ModelProjectPreferenceData(**updated_pref_data)
    validate_tag_data(updated_pref)

    updated_pref = await model_preferences_collection.find_one_and_update(
        {"user_Id": user_id},
        {"$set": preference_data},
        return_document=ReturnDocument.AFTER
    )
    if updated_pref:
        return ModelProjectPreferenceData(**updated_pref)
    raise HTTPException(status_code=404, detail="Model preference not found")

@router.put("/preferences/brand/{user_id}", response_model=BrandModelPreferenceData)
async def update_brand_preference(user_id: str, preference_data : dict):
    existing_preference = await brand_preferences_collection.find_one({"user_Id": user_id})
    if not existing_preference:
        raise HTTPException(status_code=404, detail="Preference not found")
    
    updated_pref_data ={**existing_preference, **preference_data}

    # Convert to Pydantic model and validate
    updated_pref = BrandModelPreferenceData(**updated_pref_data)
    validate_tag_data(updated_pref)

    updated_pref = await brand_preferences_collection.find_one_and_update(
        {"user_Id": user_id},
        {"$set": preference_data},
        return_document=ReturnDocument.AFTER
    )
    if updated_pref:
        return BrandModelPreferenceData(**updated_pref)
    raise HTTPException(status_code=404, detail="Brand preference not found")


@router.put("/preferences/model-brand/{user_id}", response_model=ModelBrandPreferenceData)
async def update_model_brand_preference(user_id: str, preference_data : dict):
    existing_preference = await model_brand_preferences_collection.find_one({"user_Id": user_id})
    if not existing_preference:
        raise HTTPException(status_code=404, detail="Preference not found")
    
    updated_pref_data ={**existing_preference, **preference_data}

    # Convert to Pydantic model and validate
    updated_pref = ModelBrandPreferenceData(**updated_pref_data)
    validate_tag_data(updated_pref)

    updated_pref = await model_brand_preferences_collection.find_one_and_update(
        {"user_Id": user_id},
        {"$set": preference_data},
        return_document=ReturnDocument.AFTER
    )
    if updated_pref:
        return ModelBrandPreferenceData(**updated_pref)
    raise HTTPException(status_code=404, detail="Model Brand preference not found")





# Delete Preference
@router.delete("/preferences/model/{user_id}")
async def delete_model_preference(user_id: str):
    result = model_preferences_collection.delete_one({"user_Id": user_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Preference not found")
    return {"message": "Preference deleted successfully"}

@router.delete("/preferences/brand/{user_id}")
async def delete_brand_preference(user_id: str):
    result = brand_preferences_collection.delete_one({"user_Id": user_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Preference not found")
    return {"message": "Preference deleted successfully"}

@router.delete("/preferences/model-brand/{user_id}")
async def delete_model_brand_preference(user_id: str):
    result = model_brand_preferences_collection.delete_one({"user_Id": user_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Preference not found")
    return {"message": "Preference deleted successfully"}


# Delete All Preferences
@router.delete("/preferences/model-delete-all")
async def delete_all_model_preferences():
    model_preferences_collection.delete_many({})
    return {"message": "All model preferences deleted successfully"}

@router.delete("/preferences/brand-delete-all")
async def delete_all_brand_preferences():
    brand_preferences_collection.delete_many({})
    return {"message": "All brand preferences deleted successfully"}

@router.delete("/preferences/model-brand-delete-all")
async def delete_all_model_brand_preferences():
    model_brand_preferences_collection.delete_many({})
    return {"message": "All brand preferences deleted successfully"}





#filter preference

@router.post("/preferences/model-project/filter", response_model=List[ModelProjectPreferenceData])
async def filter_model_project_pref(data: ModelProjectPreferenceFilterRequest):
    query = build_query(data)  # Construct the query based on the filter data
    print(f"Generated Query: {query}")
    
    matched_preferences = await model_preferences_collection.aggregate([
        {"$match": query},  # Filter based on the query
        {"$sample": {"size": 100}}  # Randomly select 100 documents
    ]).to_list(length=None)
    
    return [ModelProjectPreferenceData(**pref) for pref in matched_preferences]

@router.post("/preferences/brand-model/filter", response_model=List[BrandModelPreferenceData])
async def filter_brand_model_pref(data: BrandModelPreferenceFilterRequest):
    query = build_query(data)  # Construct the query based on the filter data
    print(f"Generated Query: {query}")
    
    matched_preferences = await brand_preferences_collection.aggregate([
        {"$match": query},  # Filter based on the query
        {"$sample": {"size": 100}}  # Randomly select 100 documents
    ]).to_list(length=None)
    
    return [BrandModelPreferenceData(**pref) for pref in matched_preferences]

@router.post("/preferences/model-brand/filter", response_model=List[ModelBrandPreferenceData])
async def filter_model_brand_pref(data: ModelBrandPreferenceFilterRequest):
    query = build_query(data)  # Construct the query based on the filter data
    print(f"Generated Query: {query}")
    
    matched_preferences = await model_brand_preferences_collection.aggregate([
        {"$match": query},  # Filter based on the query
        {"$sample": {"size": 100}}  # Randomly select 100 documents
    ]).to_list(length=None)
    
    return [ModelBrandPreferenceData(**pref) for pref in matched_preferences]

def build_query(data):
    query = {}
    # Loop over all fields in the data object
    for field, value in data.dict(exclude_none=True).items():  # exclude_none=True filters out None values
        if field == "rating_level":  # Validate rating_level
            if not isinstance(value, int) or not (1 <= value <= 5):
                raise ValueError("rating_level must be an integer between 1 and 5")
        if isinstance(value, (tuple, list)) and len(value) == 2:
            # Check if both values are numbers before applying range filter
            if all(isinstance(v, (int, float)) for v in value):
                min_value, max_value = value
                query[field] = {"$gte": min_value, "$lte": max_value}
            else:
                # Treat it as a normal list (e.g., a list of two strings)
                query[field] = {"$in": value}
        elif isinstance(value, list):  # Handle list fields (e.g., multiple values)
            query[field] = {"$in": value}  # Match any value in the list
        else:
            query[field] = value  # For other fields, just add them directly to the query
    
    return query




@router.post("/Model-project-preference-matched-project-ids", response_model=List[str])
async def filter_model_project_preference_matched_project_ids(data: ModelProjectPreferenceFilterRequest):
    """
    Converts ModelProjectPreferenceFilterRequest to ProjectTagFilterRequest, 
    sends it to the filtering API, and extracts user IDs from the response.

    :param data: ModelProjectPreferenceFilterRequest containing filter criteria
    :return: List of user IDs from the matched ProjectTagData
    """
    # Convert ModelProjectPreferenceFilterRequest to ProjectTagFilterRequest
    converted_data = convert_model(data, ProjectTagFilterRequest)

    # Construct query from converted_data
    query = await build_query_cross_filter(converted_data)
    print(f"Generated Query: {query}")

    # Convert database results into Pydantic models
    project_tag_data_list = await filter_modelproject_tags(query)

    # Extract user_Id from ProjectTagData objects
    project_ids = [tag.project_Id for tag in project_tag_data_list]

    return project_ids

@router.post("/brand-Model-preference-matched-ids", response_model=List[str])
async def filter_brand_Model_preference_matched_user_ids(data: BrandModelPreferenceFilterRequest):
    """Filter ModelTagData based on BrandModelPreferenceFilterRequest"""
    
    query = await build_query_cross_filter(data)  # Convert preferences into query
    print(f"Generated Query: {query}")  # Debugging

    matched_tags = await model_tags_collection.aggregate([
        {"$match": query},  # Filter based on query
        {"$sample": {"size": 100}}  # Randomly select 100 models
    ]).to_list(length=None)

    if not matched_tags:
            return []  # Return an empty list if no models match

        # If rating_level filtering is needed
    if data.rating_level is not None:
        filtered_user_ids = []
        for model in matched_tags:
            user_id = model["user_Id"]
            ratings = await get_ratings_by_level_service(user_id, data.rating_level)
            
            # If ratings exist, keep the user_id; otherwise, discard it
            if isinstance(ratings, list) and len(ratings) > 0:
                filtered_user_ids.append(user_id)

        return filtered_user_ids  # Return only user IDs

    return [model["user_Id"] for model in matched_tags]  # Return user IDs if no rating filter



@router.post("/Model-brand-preference-matched-ids", response_model=List[str])
async def filter_Model_brand_preference_matched_user_ids(data: ModelBrandPreferenceFilterRequest):
    """Filter BrandTagData based on ModelBrandPreferenceFilterRequest"""
    
    query = await build_query_cross_filter(data)  # Convert preferences into query
    print(f"Generated Query: {query}")  # Debugging

    matched_tags = await brand_tags_collection.aggregate([
        {"$match": query},  # Filter based on query
        {"$sample": {"size": 100}}  # Randomly select 100 models
    ]).to_list(length=None)

    if not matched_tags:
            return []  # Return an empty list if no models match

        # If rating_level filtering is needed
    if data.rating_level is not None:
        filtered_user_ids = []
        for model in matched_tags:
            user_id = model["user_Id"]
            ratings = await get_ratings_by_level_service(user_id, data.rating_level)
            
            # If ratings exist, keep the user_id; otherwise, discard it
            if isinstance(ratings, list) and len(ratings) > 0:
                filtered_user_ids.append(user_id)

        return filtered_user_ids  # Return only user IDs

    return [model["user_Id"] for model in matched_tags]  # Return user IDs if no rating filter



async def build_query_cross_filter(data):
    """Convert BrandModelPreferenceFilterRequest into a MongoDB query for ModelTagData filtering."""
    query = {}

    for field, value in data.dict(exclude_none=True).items():  # exclude_none=True filters out None values
        if field == "rating_level":  # Validate rating_level
            continue
        if isinstance(value, (tuple, list)) and len(value) == 2:
            # Check if both values are numbers before applying range filter
            if all(isinstance(v, (int, float)) for v in value):
                min_value, max_value = value
                query[field] = {"$gte": min_value, "$lte": max_value}
            else:
                # Treat it as a normal list (e.g., a list of two strings)
                query[field] = {"$in": value}
        elif isinstance(value, list):  # Handle list fields (e.g., multiple values)
            query[field] = {"$in": value}  # Match any value in the list
        else:
            query[field] = value  # For other fields, just add them directly to the query

    return query









@router.post("/create_random_prefs/")
async def create_random_pref_route(request: CreateRandomTagsRequest):
    count = request.count
    tag_type = request.tag_type

    # Validating tag_type input
    if tag_type not in ["Model", "Brand", "Project"]:
        raise HTTPException(status_code=400, detail="Invalid tag_type. It must be 'Model', 'Brand', or 'Project'.")

    # Create random tags
    result = await create_random_pref(count, tag_type)
    
    # Returning the result
    return result




async def generate_pref(tag_type: str):
    if tag_type =="Brand" or tag_type == "Project":
        client_type = "Model"
    else:
        client_type = "Brand"
    
    user_ids = await get_unused_user_ids_pref(client_type, tag_type)
    
    if not user_ids:
        return None  # No available user IDs left to tag
    
    user_id = choice(user_ids)  # Pick a random user ID
    

    if tag_type == "Brand":
        tag = ModelBrandPreferenceData(
            client_Type=client_type,
            user_Id=user_id,
            is_project=False,
            work_Field=sample(get_keywords("work_fields"), 3),  # Random 3 work fields
            location=choice(get_keywords("locations")),
            rating_level = randint(1,5),
            saved_time=datetime.now(timezone.utc)
        )
    
    elif tag_type == "Project":
        tag = ModelProjectPreferenceData(
            client_Type=client_type,
            user_Id=user_id,
            is_project=True,
            age=(randint(18, 25), randint(26, 35)),  # Age range for project tags
            height=(randint(150, 170), randint(171, 200)),  # Height range for project tags
            natural_eye_color=sample(get_keywords("natural_eye_colors"), 2),  # Sample 2 eye colors
            body_Type=sample(get_keywords("body_types"), 2),  # Sample 2 body types
            work_Field=sample(get_keywords("work_fields"), 3),  # Random 3 work fields
            skin_Tone=sample(get_keywords("skin_tones"), 2),  # Sample 2 skin tones
            ethnicity=sample(get_keywords("ethnicities"), 2),  # Sample 2 ethnicities
            natural_hair_type=sample(get_keywords("natural_hair_types"), 2),  # Sample 2 hair types
            experience_Level=sample(get_keywords("experience_levels"), 2),  # Sample 2 experience levels
            gender=sample(get_keywords("genders"), 2),  # Sample 2 genders
            location=choice(get_keywords("locations")),
            shoe_Size=(randint(30, 35), randint(36, 50)),  # Shoe size range
            saved_time=datetime.now(timezone.utc)
        )
    elif tag_type == "Model":
        tag = BrandModelPreferenceData(
            client_Type=client_type,
            user_Id=user_id,
            age=(randint(18, 25), randint(26, 35)),  # Age range for project tags
            height=(randint(150, 170), randint(171, 200)),  # Height range for project tags
            natural_eye_color=sample(get_keywords("natural_eye_colors"), 2),  # Sample 2 eye colors
            body_Type=sample(get_keywords("body_types"), 2),  # Sample 2 body types
            work_Field=sample(get_keywords("work_fields"), 3),  # Random 3 work fields
            skin_Tone=sample(get_keywords("skin_tones"), 2),  # Sample 2 skin tones
            ethnicity=sample(get_keywords("ethnicities"), 2),  # Sample 2 ethnicities
            natural_hair_type=sample(get_keywords("natural_hair_types"), 2),  # Sample 2 hair types
            experience_Level=sample(get_keywords("experience_levels"), 2),  # Sample 2 experience levels
            gender=sample(get_keywords("genders"), 2),  # Sample 2 genders
            location=choice(get_keywords("locations")),
            shoe_Size=(randint(30, 35), randint(36, 50)),  # Shoe size range
            rating_level = randint(1,5),
            saved_time=datetime.now(timezone.utc)
        )
    return tag


async def create_random_pref(count: int, tag_type: str):
    created_count = 0
    for _ in range(count):
        tag = await generate_pref(tag_type)
        if tag:
            collection = (
                brand_preferences_collection if tag_type == "Model" else
                model_brand_preferences_collection  if tag_type == "Brand" else
                model_preferences_collection
            )

            # Check if the user already has a tag before inserting
            existing_tag = await collection.find_one({"user_Id": tag.user_Id})
            if existing_tag:
                continue  # Skip if user already has a tag

            await collection.insert_one(tag.model_dump())  # Save the tag
            created_count += 1
        else:
            break  # Stop if no more user IDs available
    return {"message": f"{created_count} new tags created successfully."}


async def get_unused_user_ids_pref(client_Type: str, tag_type: str):
    """Fetch user IDs from user_collection and exclude those already tagged."""
    all_user_ids = {user["user_Id"] async for user in user_collection.find({"user_Id": {"$regex": f"^{client_Type.lower()}"}})}

    # Query used user IDs from the appropriate tag collection
    used_user_ids = set()
    collection = (
        brand_preferences_collection if tag_type == "Model" else
        model_brand_preferences_collection  if tag_type == "Brand" else
        model_preferences_collection
    )

    used_user_ids = {tag["user_Id"] async for tag in collection.find({}, {"user_Id": 1})}

    # Exclude already used user IDs
    unused_user_ids = list(all_user_ids - used_user_ids)
    return unused_user_ids

