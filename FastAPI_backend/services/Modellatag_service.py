from datetime import datetime, timezone
from random import choice, randint, sample
from bson import ObjectId
from fastapi import APIRouter, HTTPException
from pymongo import ReturnDocument
from typing import List, Optional
from models.Modella_tag import BrandTagFilterRequest, CreateRandomTagsRequest, ModelTagData, BrandTagData, ModelTagFilterRequest, ProjectTagData, ProjectTagFilterRequest
from config.setting import  user_collection, model_tags_collection, brand_tags_collection, project_tags_collection
from services.keywords import get_keywords
# from remove.preferences_services import get_unused_user_ids
from services.validate_tag import validate_tag_data


router = APIRouter(prefix="/ModellaTag", tags=["Modella Tag"])

# Create Tags
@router.post("/tags/models/", response_model=ModelTagData)
async def create_model_tag(tag: ModelTagData):
    # Check if user_Id exists in user_collection
    user_exists = await user_collection.find_one({"user_Id": tag.user_Id})
    if not user_exists:
        raise HTTPException(status_code=400, detail="Invalid user_Id. User does not exist.")

    # Check if a tag for the user already exists
    if await model_tags_collection.find_one({"user_Id": tag.user_Id}):
        raise HTTPException(status_code=400, detail="Tag for this user_Id already exists.")
        
    validate_tag_data(tag)
    result = await model_tags_collection.insert_one(tag.model_dump())
    if result.inserted_id:
        # Retrieve the inserted document
        inserted_tag = await model_tags_collection.find_one({"_id": result.inserted_id})
        
        if inserted_tag:
            return ModelTagData(**inserted_tag)
    raise HTTPException(status_code=500, detail="Failed to create model tag")

@router.post("/tags/brands/", response_model=BrandTagData)
async def create_brand_tag(tag: BrandTagData):
    # Check if user_Id exists in user_collection
    user_exists = await user_collection.find_one({"user_Id": tag.user_Id})
    if not user_exists:
        raise HTTPException(status_code=400, detail="Invalid user_Id. User does not exist.")

    # Check if a tag for the user already exists
    if await brand_tags_collection.find_one({"user_Id": tag.user_Id}):
        raise HTTPException(status_code=400, detail="Tag for this user_Id already exists.")
    
    validate_tag_data(tag)
    result = await brand_tags_collection.insert_one(tag.model_dump())
    if result.inserted_id:
        # Retrieve the inserted document
        inserted_tag = await brand_tags_collection.find_one({"_id": result.inserted_id})
        
        if inserted_tag:
            return BrandTagData(**inserted_tag)
    raise HTTPException(status_code=500, detail="Failed to create brand tag")

@router.post("/tags/projects/", response_model=ProjectTagData)
async def create_project_tag(tag: ProjectTagData):
    #tag.project_Id = f"project_{ObjectId()}" # Unique ID generation

    existing_tag = await project_tags_collection.find_one({"project_id": tag.project_Id})
    if existing_tag:
        raise HTTPException(status_code=400, detail="Project ID already exists")

    # Check if user_Id exists in user_collection
    user_exists = await user_collection.find_one({"user_Id": tag.user_Id})
    if not user_exists:
        raise HTTPException(status_code=400, detail="Invalid user_Id. User does not exist.")

    validate_tag_data(tag)
    result = await project_tags_collection.insert_one(tag.model_dump())
    if result.inserted_id:
        # Retrieve the inserted document
        inserted_tag = await project_tags_collection.find_one({"_id": result.inserted_id})
        
        if inserted_tag:
            return ProjectTagData(**inserted_tag)
    raise HTTPException(status_code=500, detail="Failed to create project tag")





# Get Tags
@router.get("/tags/models/{user_id}", response_model=Optional[ModelTagData])
async def get_model_tag(user_id: str):
    tag = await model_tags_collection.find_one({"user_Id": user_id})
    if tag:
        return ModelTagData(**tag)
    raise HTTPException(status_code=404, detail="Model tag not found")

@router.get("/tags/brands/{user_id}", response_model=Optional[BrandTagData])
async def get_brand_tag(user_id: str):
    tag = await brand_tags_collection.find_one({"user_Id": user_id})
    if tag:
        return BrandTagData(**tag)
    raise HTTPException(status_code=404, detail="Brand tag not found")

@router.get("/tags/projects/{user_id}", response_model=Optional[List[ProjectTagData]])
async def get_project_tags(user_id: str):
    tags = await project_tags_collection.find({"user_Id": user_id}).to_list(100)
    if tags:
        return [ProjectTagData(**tag) for tag in tags]
    raise HTTPException(status_code=404, detail="No projects found for this brand")


@router.get("/tags/projects/{user_id}/{project_id}", response_model=Optional[ProjectTagData])
async def get_project_tag(user_id: str, project_id: str):
    tag = await project_tags_collection.find_one({"user_Id": user_id, "project_Id": project_id})
    if tag:
        return ProjectTagData(**tag)
    raise HTTPException(status_code=404, detail="Project tag not found")






# Update Tags
@router.patch("/tags/models/{user_id}", response_model=ModelTagData)
async def update_model_tag(user_id: str, update_data: dict):
    # Fetch the existing tag
    existing_tag = await model_tags_collection.find_one({"user_Id": user_id})
    if not existing_tag:
        raise HTTPException(status_code=404, detail="Model tag not found")

    # Merge existing data with new updates
    updated_tag_data = {**existing_tag, **update_data}

    # Convert to Pydantic model and validate
    updated_tag = ModelTagData(**updated_tag_data)
    validate_tag_data(updated_tag)

    updated_tag = await model_tags_collection.find_one_and_update(
        {"user_Id": user_id},
        {"$set": update_data},
        return_document=ReturnDocument.AFTER
    )
    if updated_tag:
        return ModelTagData(**updated_tag)
    raise HTTPException(status_code=404, detail="Model tag not found")

@router.patch("/tags/brands/{user_id}", response_model=BrandTagData)
async def update_brand_tag(user_id: str, update_data: dict):
    # Fetch the existing tag
    existing_tag = await brand_tags_collection.find_one({"user_Id": user_id})
    if not existing_tag:
        raise HTTPException(status_code=404, detail="Model tag not found")

    # Merge existing data with new updates
    updated_tag_data = {**existing_tag, **update_data}

    # Convert to Pydantic model and validate
    updated_tag = BrandTagData(**updated_tag_data)
    validate_tag_data(updated_tag)
    updated_tag = await brand_tags_collection.find_one_and_update(
        {"user_Id": user_id},
        {"$set": update_data},
        return_document=ReturnDocument.AFTER
    )
    if updated_tag:
        return BrandTagData(**updated_tag)
    raise HTTPException(status_code=404, detail="Brand tag not found")

@router.patch("/tags/projects/{user_id}/{project_id}", response_model=Optional[ProjectTagData])
async def update_project_tag(user_id: str, project_id:str, update_data: dict):
    # Fetch the existing tag
    existing_tag = await project_tags_collection.find_one({"user_Id": user_id, "project_Id": project_id})
    if not existing_tag:
        raise HTTPException(status_code=404, detail="Model tag not found")

    # Merge existing data with new updates
    updated_tag_data = {**existing_tag, **update_data}

    # Convert to Pydantic model and validate
    updated_tag = ProjectTagData(**updated_tag_data)
    validate_tag_data(updated_tag)
    updated_tag = await project_tags_collection.find_one_and_update(
        {"user_Id": user_id, "project_Id": project_id},
        {"$set": update_data},
        return_document=ReturnDocument.AFTER
    )
    if updated_tag:
        return ProjectTagData(**updated_tag)
    raise HTTPException(status_code=404, detail="Project tag not found")





# Delete Tags
@router.delete("/tags/models/{user_id}")
async def delete_model_tag(user_id: str):
    result = await model_tags_collection.delete_one({"user_Id": user_id})
    if result.deleted_count:
        return {"message": "Model tag deleted successfully"}
    raise HTTPException(status_code=404, detail="Model tag not found")

@router.delete("/tags/brands/{user_id}")
async def delete_brand_tag(user_id: str):
    result = await brand_tags_collection.delete_one({"user_Id": user_id})
    if result.deleted_count:
        return {"message": "Brand tag deleted successfully"}
    raise HTTPException(status_code=404, detail="Brand tag not found")

@router.delete("/tags/projects/{user_id}/{project_id}")
async def delete_project_tag(user_id: str,project_id: str):
    result = await project_tags_collection.delete_one({"user_Id": user_id, "project_Id": project_id})
    if result.deleted_count:
        return {"message": "Project tag deleted successfully"}
    raise HTTPException(status_code=404, detail="Project tag not found")


# Get all tags

@router.get("/tags/models-all/", response_model=List[ModelTagData])
async def list_model_tags():
    tags = [
        {**tag, "_id": str(tag["_id"])}  # Convert ObjectId to string
        async for tag in model_tags_collection.find()
    ]
    return [ModelTagData(**tag) for tag in tags]

@router.get("/tags/brands-all/", response_model=List[BrandTagData])
async def list_brand_tags():
    tags = [
        {**tag, "_id": str(tag["_id"])}  # Convert ObjectId to string
        async for tag in brand_tags_collection.find()
    ]
    return [BrandTagData(**tag) for tag in tags]

@router.get("/tags/projects-all/", response_model=List[ProjectTagData])
async def list_project_tags():
    tags = [
        {**tag, "_id": str(tag["_id"])}  # Convert ObjectId to string
        async for tag in project_tags_collection.find()
    ]
    return [ProjectTagData(**tag) for tag in tags]


#Filter tags

@router.post("/tags/models/filter", response_model=List[ModelTagData])
async def filter_model_tags(data: ModelTagFilterRequest):
    query = build_query(data)  # Construct the query based on the filter data
    print(f"Generated Query: {query}")
    
    matched_tags = await model_tags_collection.aggregate([
        {"$match": query},  # Filter based on the query
        {"$sample": {"size": 100}}  # Randomly select 100 documents
    ]).to_list(length=None)
    
    return [ModelTagData(**tag) for tag in matched_tags]

@router.post("/tags/brands/filter", response_model=List[BrandTagData])
async def filter_brand_tags(data: BrandTagFilterRequest):
    query = build_query(data)  # Construct the query based on the filter data
    print(f"Generated Query: {query}")
    
    matched_tags = await brand_tags_collection.aggregate([
        {"$match": query},  # Filter based on the query
        {"$sample": {"size": 100}}  # Randomly select 100 documents
    ]).to_list(length=None)
    
    return [BrandTagData(**tag) for tag in matched_tags]

@router.post("/tags/projects/filter", response_model=List[ProjectTagData])
async def filter_project_tags(data: ProjectTagFilterRequest):
    query = build_query(data)  # Construct the query based on the filter data
    print(f"Generated Query: {query}")
    
    matched_tags = await project_tags_collection.aggregate([
        {"$match": query},  # Filter based on the query
        {"$sample": {"size": 100}}  # Randomly select 100 documents
    ]).to_list(length=None)
    
    return [ProjectTagData(**tag) for tag in matched_tags]

async def filter_modelproject_tags(data):
    # query = build_query(data)  # Construct the query based on the filter data
    print(f"Generated Query: {data}")
    
    matched_tags = await project_tags_collection.aggregate([
        {"$match": data},  # Filter based on the query
        {"$sample": {"size": 100}}  # Randomly select 100 documents
    ]).to_list(length=None)
    
    return [ProjectTagData(**tag) for tag in matched_tags]



def build_query(data):
    query = {}
    # Loop over all fields in the data object
    for field, value in data.dict(exclude_none=True).items():  # exclude_none=True filters out None values
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


#Delete all tags

@router.delete("/tags/delete-all-ModelTag")
async def delete_all_ModelTags_service():
    """Deletes all tags from model_tags_collection."""
    result = await model_tags_collection.delete_many({})
    return {"message": f"Deleted {result.deleted_count} tags successfully."}

@router.delete("/tags/delete-all-BrandTag")
async def delete_all_brandTags_service():
    """Deletes all tags from model_tags_collection."""
    result = await brand_tags_collection.delete_many({})
    return {"message": f"Deleted {result.deleted_count} tags successfully."}

@router.delete("/tags/delete-all-ProjectTag")
async def delete_all_projectTags_service():
    """Deletes all tags from model_tags_collection."""
    result = await project_tags_collection.delete_many({})
    return {"message": f"Deleted {result.deleted_count} tags successfully."}











#Generate random tags

@router.post("/create_random_tags/")
async def create_random_tags_route(request: CreateRandomTagsRequest):
    count = request.count
    tag_type = request.tag_type

    # Validating tag_type input
    if tag_type not in ["Model", "Brand", "Project"]:
        raise HTTPException(status_code=400, detail="Invalid tag_type. It must be 'Model', 'Brand', or 'Project'.")

    # Create random tags
    result = await create_random_tags(count, tag_type)
    
    # Returning the result
    return result




async def generate_tag(tag_type: str):
    if tag_type =="Model":
        client_type = "Model"
    else:
        client_type = "Brand"
    
    user_ids = await get_unused_user_ids(client_type, tag_type)
    
    if not user_ids:
        return None  # No available user IDs left to tag
    
    user_id = choice(user_ids)  # Pick a random user ID
    
    if tag_type == "Model":
        tag = ModelTagData(
            client_Type=client_type,
            user_Id=user_id,
            age=randint(18, 60),  # Example age range for models
            height=randint(150, 200),  # Height range for models
            natural_eye_color=choice(get_keywords("natural_eye_colors")),
            body_Type=choice(get_keywords("body_types")),
            work_Field=sample(get_keywords("work_fields"), 3),  # Random 3 work fields
            skin_Tone=choice(get_keywords("skin_tones")),
            ethnicity=choice(get_keywords("ethnicities")),
            natural_hair_type=choice(get_keywords("natural_hair_types")),
            experience_Level=choice(get_keywords("experience_levels")),
            gender=choice(get_keywords("genders")),
            location=choice(get_keywords("locations")),
            shoe_Size=randint(31, 50),  # Random shoe size
            bust_chest=randint(61, 117),
            waist=randint(51, 91),
            hips=randint(61, 107),
            saved_time=datetime.now(timezone.utc)
        )

    elif tag_type == "Brand":
        tag = BrandTagData(
            client_Type=client_type,
            user_Id=user_id,
            is_project=False,
            work_Field=sample(get_keywords("work_fields"), 3),  # Random 3 work fields
            location=choice(get_keywords("locations")),
            saved_time=datetime.now(timezone.utc)
        )
    
    elif tag_type == "Project":
        tag = ProjectTagData(
            project_Id = f"project_{ObjectId()}",
            user_Id=user_id,
            is_project=True,
            age=((randint(18, 25), randint(26, 35))),  # Age range for project tags
            height=((randint(150, 170), randint(171, 200))),  # Height range for project tags
            natural_eye_color=sample(get_keywords("natural_eye_colors"), 2),  # Sample 2 eye colors
            body_Type=sample(get_keywords("body_types"), 2),  # Sample 2 body types
            work_Field=sample(get_keywords("work_fields"), 3),  # Random 3 work fields
            skin_Tone=sample(get_keywords("skin_tones"), 2),  # Sample 2 skin tones
            ethnicity=sample(get_keywords("ethnicities"), 2),  # Sample 2 ethnicities
            natural_hair_type=sample(get_keywords("natural_hair_types"), 2),  # Sample 2 hair types
            experience_Level=sample(get_keywords("experience_levels"), 2),  # Sample 2 experience levels
            gender=sample(get_keywords("genders"), 2),  # Sample 2 genders
            location=choice(get_keywords("locations")),
            shoe_Size=((randint(31, 35), randint(36, 50))),  # Shoe size range
            bust_chest=((randint(61, 70), randint(71, 117))),
            waist=((randint(51, 65), randint(66, 91))),
            hips=((randint(61, 70), randint(71, 107))),
            saved_time=datetime.now(timezone.utc)
        )
    
    return tag


async def create_random_tags(count: int, tag_type: str):
    created_count = 0
    for _ in range(count):
        tag = await generate_tag(tag_type)
        if tag:
            collection = (
                model_tags_collection if tag_type == "Model" else
                brand_tags_collection if tag_type == "Brand" else
                project_tags_collection
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


async def get_unused_user_ids(client_Type: str, tag_type: str):
    """Fetch user IDs from user_collection and exclude those already tagged."""
    all_user_ids = {user["user_Id"] async for user in user_collection.find({"user_Id": {"$regex": f"^{client_Type.lower()}"}})}

    # Query used user IDs from the appropriate tag collection
    used_user_ids = set()
    collection = (
        model_tags_collection if tag_type == "Model" else
        brand_tags_collection if tag_type == "Brand" else
        project_tags_collection
    )

    used_user_ids = {tag["user_Id"] async for tag in collection.find({}, {"user_Id": 1})}

    # Exclude already used user IDs
    unused_user_ids = list(all_user_ids - used_user_ids)
    return unused_user_ids

