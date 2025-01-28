import os
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv

# Load environment variables from the .env file
load_dotenv()

MONGO_USERNAME = os.getenv("MONGO_USERNAME")
MONGO_PASSWORD = os.getenv("MONGO_PASSWORD")
MONGO_DB = os.getenv("MONGO_DB")
MONGO_URI = f"mongodb+srv://{MONGO_USERNAME}:{MONGO_PASSWORD}@clustermodella.4abp1.mongodb.net/{MONGO_DB}?retryWrites=true&w=majority&appName=ClusterModella&ssl=true"


client = AsyncIOMotorClient(MONGO_URI)
db = client[MONGO_DB]
collection_tags = db["tags"]
collection_preferences = db["preferences"]
user_collection = db["users"]