# routers/matches.py
from typing import List, Optional
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from datetime import datetime, timezone
from models.MatchState import MatchState, MatchStatus, PendingRequest
from config.setting import match_states_collection, user_collection, file_collection
from services.file_service import get_latest_file_by_user_folder

router = APIRouter(prefix="/matches", tags=["matches"])

@router.post("/request")
async def create_match_request(business_id: str, model_id: str):
    """Business swipes right on a model, creating a pending match request"""
    
    # Verify both users exist
    business = await user_collection.find_one({"user_Id": business_id})
    model = await user_collection.find_one({"user_Id": model_id})
    
    if not business:
        raise HTTPException(status_code=404, detail="Business user not registered")
    
    if not model:
        raise HTTPException(status_code=404, detail="Model user not registered")
    
    # Check if there's already a match state between these users
    existing_match = await match_states_collection.find_one({
        "business_id": business_id,
        "model_id": model_id
    })
    
    if existing_match:
        return {"message": "Match request already exists", "status": existing_match["status"]}
    
    # Create new match request (pending)
    match_state = MatchState(
        business_id=business_id,
        model_id=model_id,
        status=MatchStatus.PENDING
    )
    
    await match_states_collection.insert_one(match_state.dict())
    
    return {"message": "Match request created successfully", "status": MatchStatus.PENDING}

@router.get("/pending/{model_id}")
async def get_pending_requests(model_id: str):
    """Get all pending match requests for a model"""
    
    # Verify the model exists
    model = await user_collection.find_one({"user_Id": model_id})
    if not model:
        raise HTTPException(status_code=404, detail="Model user not registered")
    
    # Find all pending match requests for this model
    pending_requests_cursor = match_states_collection.find({
        "model_id": model_id,
        "status": MatchStatus.PENDING
    })
    
    pending_requests = []
    
    # In matches.py, modify the get_pending_requests function
    async for req in pending_requests_cursor:
        # Get business user details
        business = await user_collection.find_one({"user_Id": req["business_id"]})
        
        if business:
            # Get profile pic if available - use the same function as the endpoint
            profile_pic = None
            try:
                latest_pic = await get_latest_file_by_user_folder(
                    user_id=req["business_id"], 
                    folder="profile-pic"
                )
                if latest_pic:
                    profile_pic = latest_pic.s3_url
            except Exception as e:
                print(f"Error fetching profile picture: {e}")
            
            pending_requests.append(PendingRequest(
                user_id=business["user_Id"],
                name=business.get("name", "Unknown"),
                profile_pic=profile_pic,
                description=business.get("description", ""),
                requested_at=req["initiated_at"]
            ))
    
    return {"pending_requests": pending_requests}

@router.post("/respond")
async def respond_to_match_request(model_id: str, business_id: str, accept: bool):
    """Model responds to a pending match request from a business"""
    
    # Verify both users exist
    model = await user_collection.find_one({"user_Id": model_id})
    business = await user_collection.find_one({"user_Id": business_id})
    
    if not model:
        raise HTTPException(status_code=404, detail="Model user not registered")
    
    if not business:
        raise HTTPException(status_code=404, detail="Business user not registered")
    
    # Find the pending match request
    match_request = await match_states_collection.find_one({
        "business_id": business_id,
        "model_id": model_id,
        "status": MatchStatus.PENDING
    })
    
    if not match_request:
        raise HTTPException(status_code=404, detail="Pending match request not found")
    
    # Update match status based on model's response
    new_status = MatchStatus.MATCHED if accept else MatchStatus.REJECTED
    
    await match_states_collection.update_one(
        {"_id": match_request["_id"]},
        {
            "$set": {
                "status": new_status,
                "responded_at": datetime.now(timezone.utc)
            }
        }
    )
    
    return {"message": "Match request updated", "status": new_status}

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
    
    existing_list = await match_states_collection.find_one({"user_Id": user_id})
    if not existing_list:
        raise HTTPException(status_code=404, detail="User's saved list not found")
    
    if remove_id in existing_list["saved_Ids"]:
        await match_states_collection.update_one(
            {"user_Id": user_id},
            {"$pull": {"saved_Ids": remove_id}}
        )
        return {"message": "ID removed successfully"}
    else:
        # raise HTTPException(status_code=400, detail="ID not found in saved list")
        return {"message": "ID not found in saved list"}
    
@router.get("/confirmed/{user_id}")
async def get_confirmed_matches(user_id: str):
    """Get all confirmed matches for a user (works for both models and businesses)"""
    
    # Verify the user exists
    user = await user_collection.find_one({"user_Id": user_id})
    if not user:
        raise HTTPException(status_code=404, detail="User not registered")
    
    # Find all confirmed matches for this user
    matches = []
    
    # Search as business
    business_matches_cursor = match_states_collection.find({
        "business_id": user_id,
        "status": MatchStatus.MATCHED
    })
    
    async for match in business_matches_cursor:
        # Get model details
        matched_user = await user_collection.find_one({"user_Id": match["model_id"]})
        
        if matched_user:
            # Get profile pic if available
            profile_pic = None
            profile_pics = await file_collection.find_one({
                "uploaded_by": match["model_id"],
                "folder": "profile-pic"
            })
            
            if profile_pics:
                profile_pic = profile_pics.get("s3_url")
            
            matches.append({
                "user_id": matched_user["user_Id"],
                "name": matched_user.get("name", "Unknown"),
                "profile_pic": profile_pic,
                "description": matched_user.get("description", ""),
                "matched_at": match["responded_at"]
            })
    
    # Search as model
    model_matches_cursor = match_states_collection.find({
        "model_id": user_id,
        "status": MatchStatus.MATCHED
    })
    
    async for match in model_matches_cursor:
        # Get business details
        matched_user = await user_collection.find_one({"user_Id": match["business_id"]})
        
        if matched_user:
            # Get profile pic if available
            profile_pic = None
            profile_pics = await file_collection.find_one({
                "uploaded_by": match["business_id"],
                "folder": "profile-pic"
            })
            
            if profile_pics:
                profile_pic = profile_pics.get("s3_url")
            
            matches.append({
                "user_id": matched_user["user_Id"],
                "name": matched_user.get("name", "Unknown"),
                "profile_pic": profile_pic,
                "description": matched_user.get("description", ""),
                "matched_at": match["responded_at"]
            })
    
    return {"matches": matches}