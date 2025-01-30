from fastapi import FastAPI
from routes.tag_routes import router as tag_router
from routes.preferences_routes import router as preferences_router  # Import the preferences router
from routes.user_routes import router as user_router
from routes.rating_routes import router as rating_router
from config.setting import user_collection
import logging
from config.logging_config import *
from contextlib import asynccontextmanager

# Define the lifespan handler
@asynccontextmanager
async def lifespan(app: FastAPI):
    # Actions to perform on app startup
    await user_collection.create_index("user_Id", unique=True)
    await user_collection.create_index("email", unique=True)
    print("Unique indexes created")

    yield  # FastAPI app is running here

    # Actions to perform on app shutdown (if needed)
    print("App is shutting down")


app = FastAPI(lifespan=lifespan)

# Create or retrieve a logger for the application
logger = logging.getLogger("fastapi")

# Include the tag routes
app.include_router(tag_router, prefix="/tags", tags=["Tags"])

# Include the preferences routes
app.include_router(preferences_router, prefix="/preferences", tags=["Preferences"])


# Include the user routes
app.include_router(user_router, prefix="/users", tags=["Users"])

# Include the rating routes
app.include_router(rating_router)

# Optional: Add a root endpoint
@app.get("/")
async def root():
    logger.info("Root endpoint accessed")
    return {"message": "Welcome to the Modella API!"}
