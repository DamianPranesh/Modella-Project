from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime, timezone

class User(BaseModel):
    rating_Id: Optional[str] = None
    user_Id: str 
    ratedBy_Id: str
    ratingDesc: str
    ratingRank: int
    created_At: Optional[datetime] = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_At: Optional[datetime] = None
    

from fastapi import FastAPI, HTTPException, Depends
from pymongo import MongoClient
from pydantic import BaseModel, Field
from typing import List, Optional
from bson import ObjectId

# MongoDB Connection
client = MongoClient("your_mongodb_connection_string")
db = client.your_database
rating_collection = db.rating_collection

app = FastAPI()

# Rating Schema
class Rating(BaseModel):
    user_Id: str  # Receiver of the rating
    ratedBy_Id: str  # Giver of the rating
    rating: int = Field(..., ge=1, le=5)  # Rating between 1-5
    review: Optional[str] = None

# Create Rating (User rates another user)
@app.post("/ratings/", response_model=dict)
def create_rating(rating: Rating):
    # Check if the rating already exists
    existing_rating = rating_collection.find_one({"user_Id": rating.user_Id, "ratedBy_Id": rating.ratedBy_Id})
    if existing_rating:
        raise HTTPException(status_code=400, detail="You have already rated this user.")
    
    rating_data = rating.dict()
    rating_data["_id"] = str(ObjectId())  # Generate unique ID
    rating_collection.insert_one(rating_data)
    return {"message": "Rating submitted successfully!"}

# Update Rating (Modify an existing rating)
@app.put("/ratings/{rating_id}", response_model=dict)
def update_rating(rating_id: str, rating: Rating):
    existing_rating = rating_collection.find_one({"_id": rating_id})
    if not existing_rating:
        raise HTTPException(status_code=404, detail="Rating not found.")
    if existing_rating["ratedBy_Id"] != rating.ratedBy_Id:
        raise HTTPException(status_code=403, detail="You can only update your own rating.")
    
    # Prevent changing user_Id and ratedBy_Id
    updated_data = {
        "rating": rating.rating,
        "review": rating.review
    }
    
    rating_collection.update_one({"_id": rating_id}, {"$set": updated_data})
    return {"message": "Rating updated successfully!"}

# Delete Rating (Remove a rating)
@app.delete("/ratings/{rating_id}", response_model=dict)
def delete_rating(rating_id: str, ratedBy_Id: str):
    existing_rating = rating_collection.find_one({"_id": rating_id})
    if not existing_rating:
        raise HTTPException(status_code=404, detail="Rating not found.")
    if existing_rating["ratedBy_Id"] != ratedBy_Id:
        raise HTTPException(status_code=403, detail="You can only delete your own rating.")
    
    rating_collection.delete_one({"_id": rating_id})
    return {"message": "Rating deleted successfully!"}

# Retrieve Ratings (Get all ratings or filter by user_Id)
@app.get("/ratings/", response_model=List[Rating])
def get_ratings(user_Id: Optional[str] = None):
    query = {"user_Id": user_Id} if user_Id else {}
    ratings = list(rating_collection.find(query, {"_id": 0}))
    return ratings


# async def update_rating_service(rating_id: str, rating: Rating):
#     existing_rating = await rating_collection.find_one({"_id": ObjectId(rating_id)})
#     if not existing_rating:
#         return {"error": "Rating not found."}
#     if existing_rating["ratedBy_Id"] != rating.ratedBy_Id:
#         return {"error": "You can only update your own rating."}
    
#     updated_data = {"rating": rating.rating, "review": rating.review}
#     await rating_collection.update_one({"_id": ObjectId(rating_id)}, {"$set": updated_data})
#     return {"message": "Rating updated successfully!"}