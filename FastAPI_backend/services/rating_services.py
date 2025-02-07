import random
from bson import ObjectId
from models.rating_model import Rating
from config.setting import rating_collection,user_collection
from typing import Dict, Any, List
from collections import Counter


# Predefined rating levels and their corresponding reviews
RATING_REVIEW_MAP = {
    1: "Very bad",
    2: "Not too bad",
    3: "OK",
    4: "Somewhat good",
    5: "Very good"
}

async def create_rating_service(rating: Rating):
    # Check if both user_Id (receiver) and ratedBy_Id (giver) exist in user_collection
    user_exists = await user_collection.find_one({"user_Id": rating.user_Id})
    rated_by_exists = await user_collection.find_one({"user_Id": rating.ratedBy_Id})

    if not user_exists or not rated_by_exists:
        return {"error": "Either the user or the rating giver does not exist."}

    # Check if the rating already exists (to prevent duplicate ratings)
    existing_rating = await rating_collection.find_one({"user_Id": rating.user_Id, "ratedBy_Id": rating.ratedBy_Id})
    if existing_rating:
        return {"error": "You have already rated this user."}
    
    rating_data = rating.model_dump()
    rating_data["rating_id"] = str(ObjectId())  # Generate unique ID
    print(rating_data)
    await rating_collection.insert_one(rating_data)
    return {"message": "Rating submitted successfully!"}



async def update_rating_service(rating_id: str, ratedBy_Id: str, update_data: Dict[str, Any]):
    # Retrieve the existing rating from the database using rating_id
    existing_rating = await rating_collection.find_one({"_id": ObjectId(rating_id)})
    
    # Check if the rating exists
    if not existing_rating:
        return {"error": "Rating not found."}
    
    # Check if the ratedBy_Id matches the one in the document
    if existing_rating["ratedBy_Id"] != ratedBy_Id:
        return {"error": "You can only update your own rating."}
    
    # Apply the update to the rating document (only valid fields)
    updated_data = {key: value for key, value in update_data.items() if key in ["rating", "review"]}
    
    # If there are valid fields to update, apply them
    if updated_data:
        await rating_collection.update_one({"_id": ObjectId(rating_id)}, {"$set": updated_data})
        return {"message": "Rating updated successfully!"}
    else:
        return {"error": "No valid fields to update."}


async def delete_rating_service(rating_id: str, ratedBy_Id: str):
    existing_rating = await rating_collection.find_one({"_id": ObjectId(rating_id)})
    if not existing_rating:
        return {"error": "Rating not found."}
    if existing_rating["ratedBy_Id"] != ratedBy_Id:
        return {"error": "You can only delete your own rating."}
    
    await rating_collection.delete_one({"_id": ObjectId(rating_id)})
    return {"message": "Rating deleted successfully!"}

async def get_ratings_service(user_Id: str = None):
    query = {"user_Id": user_Id} if user_Id else {}
    ratings = await rating_collection.find(query).to_list(None)
    
    # Manually map MongoDB _id to rating_id
    for rating in ratings:
        rating["rating_id"] = str(rating.pop("_id"))  # Convert _id to rating_id
    
    return ratings

# Assuming rating_collection is your MongoDB collection
async def delete_all_ratings_service():
    # Delete all ratings in the collection
    result = await rating_collection.delete_many({})
    return result.deleted_count 


async def generate_random_reviews_service(num_reviews: int):
    # Get all user IDs from user_collection
    users = await user_collection.find({}, {"user_Id": 1, "_id": 0}).to_list(None)
    user_ids = [user["user_Id"] for user in users]

    if len(user_ids) < 2:
        return {"error": "Not enough users to generate reviews."}

    reviews = []
    count = 0  # Track how many unique reviews are added

    while count < num_reviews:
        # Select random user_Id and ratedBy_Id (ensuring they are different)
        user_Id, ratedBy_Id = random.sample(user_ids, 2)

        # Check if the rating already exists (to prevent duplicate ratings)
        existing_rating = await rating_collection.find_one({"user_Id": user_Id, "ratedBy_Id": ratedBy_Id})
        if existing_rating:
            continue  # Skip if the rating already exists

        # Randomly select a rating (1-5)
        rating = random.randint(1, 5)
        review = RATING_REVIEW_MAP[rating]  # Get the review text

        # Construct the rating document
        rating_data = {
            "rating_id": str(ObjectId()),
            "user_Id": user_Id,
            "ratedBy_Id": ratedBy_Id,
            "rating": rating,
            "review": review
        }

        reviews.append(rating_data)
        count += 1  # Increment only when a unique review is created

    # Insert all generated reviews into rating_collection
    await rating_collection.insert_many(reviews)

    return {"message": f"Successfully generated {num_reviews} random reviews!"}



async def get_recent_reviews_service(user_Id: str):
    """Retrieve the 10 most recent reviews from a specific user."""
    reviews = await rating_collection.find(
        {"user_Id": user_Id},
        sort=[("_id", -1)],  # Sort by most recent first
        limit=10
    ).to_list(None)

    if not reviews:
        return {"error": "No reviews found from this user."}

    for review in reviews:
        review["rating_id"] = str(review.pop("_id"))  # Convert ObjectId to string

    return reviews


async def get_ratings_by_level_service(user_Id: str, rating_level: int):
    """Retrieve all ratings for a user at a specific rating level (1-5)."""
    if rating_level not in range(1, 6):
        return {"error": "Invalid rating level. Must be between 1 and 5."}

    ratings = await rating_collection.find(
        {"user_Id": user_Id, "rating": rating_level},
        sort=[("_id", -1)]  # Sort by most recent first
    ).to_list(None)

    for rating in ratings:
        rating["rating_id"] = str(rating.pop("_id"))  # Convert ObjectId to string

    return ratings if ratings else {"message": "No ratings found at this level."}

async def filter_users_by_most_frequent_rating(users: List[str], target_rating: int) -> List[str]:
    """
    Filter users based on their most frequent rating level.
    
    Args:
        users: List of user IDs to check
        target_rating: The rating level to match against (1-5)
    
    Returns:
        List of user IDs whose most frequent rating matches the target rating
    """
    filtered_users = []
    
    for user_id in users:
        # Get all ratings for this user
        ratings = await rating_collection.find({"user_Id": user_id}).to_list(None)
        
        if not ratings:
            continue  # Skip users with no ratings
            
        # Count the frequency of each rating
        rating_counts = Counter(rating["rating"] for rating in ratings)
        
        # Get the most common rating (returns tuple of (rating, count))
        most_common_rating = rating_counts.most_common(1)[0][0] if rating_counts else None
        
        # Keep user if their most frequent rating matches the target
        if most_common_rating == target_rating:
            filtered_users.append(user_id)
    
    return filtered_users