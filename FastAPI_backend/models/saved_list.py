from typing import List
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from config.setting import saved_list_collection, user_collection


router = APIRouter(prefix="/savedList", tags=["savedList"])

class savedList(BaseModel):
    user_Id: str
    saved_Ids: List[str]=[]


@router.post("/add")
async def add_saved_id(user_id: str, new_id: List[str]):
    user = await user_collection.find_one({"user_Id": user_id})
    if not user:
        raise HTTPException(status_code=404, detail="User not registered")
    
    if len(new_id) != 1:
        raise HTTPException(status_code=400, detail="Only one ID should be sent in the list")
    new_id = new_id[0]

    new_user = await user_collection.find_one({"user_Id": new_id})
    if not new_user:
        raise HTTPException(status_code=404, detail="The ID to save is not a registered user")
    
    if user_id == new_id:
        raise HTTPException(status_code=400, detail="User cannot save themselves")
    
    existing_list = await saved_list_collection.find_one({"user_Id": user_id})
    if not existing_list:
        new_entry = {"user_Id": user_id, "saved_Ids": [new_id]}
        await saved_list_collection.insert_one(new_entry)
    else:
        if new_id not in existing_list["saved_Ids"]:
            await saved_list_collection.update_one(
                {"user_Id": user_id},
                {"$push": {"saved_Ids": new_id}}
            )
        else:
            return {"message": "ID is already in the saved list"}
    return {"message": "ID added successfully"}

@router.post("/remove")
async def remove_saved_id(user_id: str, remove_id: List[str]):
    user = await user_collection.find_one({"user_Id": user_id})
    if not user:
        raise HTTPException(status_code=404, detail="User not registered")

    if len(remove_id) != 1:
        raise HTTPException(status_code=400, detail="Only one ID should be sent in the list")
    remove_id = remove_id[0]

    remove_user = await user_collection.find_one({"user_Id": remove_id})
    if not remove_user:
        raise HTTPException(status_code=404, detail="The ID to remove is not a registered user")

    if user_id == remove_id:
        raise HTTPException(status_code=400, detail="User cannot remove themselves")
    
    existing_list = await saved_list_collection.find_one({"user_Id": user_id})
    if not existing_list:
        raise HTTPException(status_code=404, detail="User's saved list not found")
    
    if remove_id in existing_list["saved_Ids"]:
        await saved_list_collection.update_one(
            {"user_Id": user_id},
            {"$pull": {"saved_Ids": remove_id}}
        )
        return {"message": "ID removed successfully"}
    else:
        # raise HTTPException(status_code=400, detail="ID not found in saved list")
        return {"message": "ID not found in saved list"}


@router.get("/{user_id}")
async def get_saved_ids(user_id: str):
    # Check if the user exists
    user = await user_collection.find_one({"user_Id": user_id})
    if not user:
        raise HTTPException(status_code=404, detail="User not registered")

    # Retrieve the saved list for the given user_id
    saved_list = await saved_list_collection.find_one({"user_Id": user_id})
    
    if not saved_list:
        return {"user_Id": user_id, "saved_Ids": []}  # Return an empty list if no saved list exists
    
    return {"user_Id": user_id, "saved_Ids": saved_list.get("saved_Ids", [])}
