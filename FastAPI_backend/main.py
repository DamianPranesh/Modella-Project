from fastapi import FastAPI
from routes.file_routes import router as file_router
from routes.user_routes import router as user_router
from routes.rating_routes import router as rating_router
from services.Modellatag_service import router as Modellatag_router
from services.Modella_preference_service import router as ModellaPref_router
from services.keywords import router as keyword_router
from models.saved_list import router as savedList_router
from routes.project_routes import router as project_router
from config.setting import *
import logging
from config.logging_config import *
from contextlib import asynccontextmanager
from fastapi.middleware.cors import CORSMiddleware
from config.rate_limiter import limiter
from slowapi.errors import RateLimitExceeded
from slowapi.middleware import SlowAPIMiddleware
from fastapi import Request
from fastapi.responses import JSONResponse


@asynccontextmanager
async def lifespan(app: FastAPI):
    try:
        # Create unique indexes for user_collection
        await user_collection.create_index("user_Id", unique=True)
        await user_collection.create_index("email", unique=True)
        # Create unique index for rating_collection to prevent duplicate ratings
        await rating_collection.create_index(
            [("user_Id", 1), ("ratedBy_Id", 1)],
            unique=True
        )
        await file_collection.create_index("file_id", unique=True)
        await project_collection.create_index("project_Id", unique=True)
        await saved_list_collection.create_index("user_Id", unique=True)

        await model_tags_collection.create_index("user_Id", unique=True)
        await brand_tags_collection.create_index("user_Id", unique=True)
        await project_tags_collection.create_index("project_Id", unique=True)

        await model_preferences_collection.create_index("user_Id", unique=True)
        await brand_preferences_collection.create_index("user_Id", unique=True)
        await model_brand_preferences_collection.create_index("user_Id", unique=True)

        logger.info("All indexes created successfully!")
        print("Indexes created.")

    except Exception as e:
        logger.error(f"Error creating indexes: {str(e)}")

    yield  # FastAPI app is running

    # Shutdown actions
    logger.info("Application is shutting down")
    print("App is shutting down")


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

# Add SlowAPI middleware
app.add_middleware(SlowAPIMiddleware)

app.state.limiter = limiter

# Global rate limit error handler
@app.exception_handler(RateLimitExceeded)
async def rate_limit_handler(request: Request, exc: RateLimitExceeded):
    return JSONResponse(
        status_code=429,
        content={"detail": "Rate limit exceeded. Please try again later."}
    )

# Create or retrieve a logger for the application
#logger = logging.getLogger("fastapi")

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
