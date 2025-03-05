from fastapi import APIRouter, HTTPException, Depends
from typing import List, Optional
from models.project_model import Project, UpdateProject
from config.setting import project_collection
from bson import ObjectId

router = APIRouter(prefix="/Brandprojects", tags=["Brandprojects"])

# Helper function to convert MongoDB document to dict
def project_serializer(project) -> dict:
    return {
        "user_Id": project["user_Id"],
        "project_Id": project["project_Id"],
        "name": project.get("name"),
        "description": project.get("description"),
        "about": project.get("about"),
        "saved_time": project.get("saved_time"),
        "updated_At": project.get("updated_At")
    }

# Create Project
@router.post("/projects/", response_model=Project)
async def create_project(project: Project):
    project.project_Id = f"project_{ObjectId()}"  # Auto-generate ID
    existing = await project_collection.find_one({"user_Id": project.user_Id, "project_Id": project.project_Id})
    
    if existing:
        raise HTTPException(status_code=400, detail="Project already exists")
    
    await project_collection.insert_one(project.dict())
    return project

# Retrieve All Projects
@router.get("/projects/", response_model=List[Project])
async def get_all_projects():
    projects = await project_collection.find().to_list(length=100)
    return [project_serializer(p) for p in projects]

# Retrieve Projects by User ID
@router.get("/projects/user/{user_id}", response_model=List[Project])
async def get_projects_by_user(user_id: str):
    projects = await project_collection.find({"user_Id": user_id}).to_list(length=100)
    return [project_serializer(p) for p in projects]

# Retrieve a Specific Project by User ID and Project ID
@router.get("/projects/{user_id}/{project_id}", response_model=Project)
async def get_project(user_id: str, project_id: str):
    project = await project_collection.find_one({"user_Id": user_id, "project_Id": project_id})
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    return project_serializer(project)

# Update Project by User ID and Project ID
@router.put("/projects/{user_id}/{project_id}", response_model=Project)
async def update_project(user_id: str, project_id: str, update_data: UpdateProject):
    update_dict = {k: v for k, v in update_data.dict().items() if v is not None}
    update_dict["updated_At"] = update_data.updated_At

    result = await project_collection.update_one(
        {"user_Id": user_id, "project_Id": project_id},
        {"$set": update_dict}
    )
    
    if result.modified_count == 0:
        raise HTTPException(status_code=404, detail="Project not found or no changes made")

    updated_project = await project_collection.find_one({"user_Id": user_id, "project_Id": project_id})
    return project_serializer(updated_project)

# Delete Project by User ID and Project ID
@router.delete("/projects/{user_id}/{project_id}")
async def delete_project(user_id: str, project_id: str):
    result = await project_collection.delete_one({"user_Id": user_id, "project_Id": project_id})
    
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Project not found")

    return {"message": "Project deleted successfully"}

# Delete All Projects (Use with caution)
@router.delete("/projects/")
async def delete_all_projects():
    result = await project_collection.delete_many({})
    return {"message": f"Deleted {result.deleted_count} projects"}

# Filter Projects (Example: Filter by Name)
@router.get("/projects/filter/")
async def filter_projects(name: Optional[str] = None, description: Optional[str] = None):
    query = {}
    if name:
        query["name"] = {"$regex": name, "$options": "i"}  # Case-insensitive search
    if description:
        query["description"] = {"$regex": description, "$options": "i"}

    projects = await project_collection.find(query).to_list(length=100)
    return [project_serializer(p) for p in projects]
