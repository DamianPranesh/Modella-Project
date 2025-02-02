import os
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv
import boto3

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
rating_collection = db["ratings"]
file_collection = db["file_metadata"]

# AWS S3 Configuration
AWS_ACCESS_KEY = os.getenv("AWS_ACCESS_KEY")
AWS_SECRET_ACCESS_KEY = os.getenv("AWS_SECRET_ACCESS_KEY")
AWS_BUCKET_NAME = os.getenv("AWS_BUCKET_NAME")
AWS_REGION = os.getenv("AWS_REGION")

s3_client = boto3.client(
    "s3",
    aws_access_key_id=AWS_ACCESS_KEY,
    aws_secret_access_key=AWS_SECRET_ACCESS_KEY,
    region_name=AWS_REGION
)


