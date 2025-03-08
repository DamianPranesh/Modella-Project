from fastapi import FastAPI
from routes.file_routes import router as file_router
# from remove.tag_routes import router as tag_router
# from remove.preferences_routes import router as preferences_router  # Import the preferences router
from routes.user_routes import router as user_router
from routes.rating_routes import router as rating_router
from services.Modellatag_service import router as Modellatag_router
from services.Modella_preference_service import router as ModellaPref_router
from services.keywords import router as keyword_router
from models.saved_list import router as savedList_router
from routes.project_routes import router as project_router
from config.setting import user_collection
import logging
from config.logging_config import *
from contextlib import asynccontextmanager
from fastapi.middleware.cors import CORSMiddleware

# Define the lifespan handler
@asynccontextmanager
async def lifespan(app: FastAPI):
    try:
        # Actions to perform on app startup
        await user_collection.create_index("user_Id", unique=True)
        await user_collection.create_index("email", unique=True)
        logger.info("Unique indexes created successfully")
        print("Unique indexes created")
    except Exception as e:
        logger.error(f"Error creating indexes: {str(e)}")

    yield  # FastAPI app is running here

    # Actions to perform on app shutdown (if needed)
    print("App is shutting down")
    logger.info("Application is shutting down")


app = FastAPI(
    lifespan=lifespan,
    title="Modella API",
    description="API for Modella platform",
    version="1.0.0",
    root_path="/api/v1"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Configure appropriately for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create or retrieve a logger for the application
#logger = logging.getLogger("fastapi")

# Include the tag routes
# app.include_router(tag_router)

# Include the preferences routes
# app.include_router(preferences_router)


# Include the user routes
app.include_router(user_router)

# Include the rating routes
app.include_router(rating_router)

# Include the file managing routes
app.include_router(file_router)

# Include the tag managing routes
app.include_router(Modellatag_router)

# Include the preference managing routes
app.include_router(ModellaPref_router)

# Include the keyword managing routes
app.include_router(keyword_router)

# Include the Saved List managing routes
app.include_router(savedList_router)

# Include the project managing routes
app.include_router(project_router)

# Optional: Add a root endpoint
@app.get("/")
async def root():
    logger.info("Root endpoint accessed")
    return {"message": "Welcome to the Modella API!"}
