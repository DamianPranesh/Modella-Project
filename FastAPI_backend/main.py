from fastapi import FastAPI, Request, Response
from starlette.responses import RedirectResponse, JSONResponse
from routes.file_routes import router as file_router
from routes.user_routes import router as user_router
from routes.rating_routes import router as rating_router
from routes.project_routes import router as project_router
from routes.role_management import router as role_router
from services.Modellatag_service import router as Modellatag_router
from services.Modella_preference_service import router as ModellaPref_router
from services.keywords import router as keyword_router
from models.saved_list import router as savedList_router
from config.setting import *
import logging
from config.logging_config import *
from contextlib import asynccontextmanager
from fastapi.middleware.cors import CORSMiddleware
from config.rate_limiter import limiter
from slowapi.errors import RateLimitExceeded
from slowapi.middleware import SlowAPIMiddleware
from dotenv import load_dotenv
import os
import requests


# Load environment variables
load_dotenv()

AUTH0_DOMAIN = os.getenv("AUTH0_DOMAIN")
AUTH0_CLIENT_ID = os.getenv("AUTH0_CLIENT_ID")
AUTH0_CLIENT_SECRET = os.getenv("AUTH0_CLIENT_SECRET")
AUTH0_AUDIENCE = os.getenv("AUTH0_AUDIENCE")
REDIRECT_URI = os.getenv("REDIRECT_URI")
AUTH0_ALGORITHM = "RS256"

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
    allow_origins=["http://localhost:5173", "https://modella-project.vercel.app"],  # Configure appropriately for production
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

# Include the role management router
app.include_router(role_router, prefix="/api")

# Auth0 login endpoint
@app.get("/login")
def login():
    return RedirectResponse(
        f"https://{AUTH0_DOMAIN}/authorize"
        f"?response_type=code"
        f"&client_id={AUTH0_CLIENT_ID}"
        f"&redirect_uri={REDIRECT_URI}"
        f"&scope=offline_access openid profile email"
        f"&audience={AUTH0_AUDIENCE}"
    )

# Auth0 token endpoint
@app.get("/token")
def get_access_token(code: str, response: Response):
    print(f"Received code: {code}")
    payload = (
        "grant_type=authorization_code"
        f"&client_id={AUTH0_CLIENT_ID}"
        f"&client_secret={AUTH0_CLIENT_SECRET}"
        f"&code={code}"
        f"&redirect_uri={REDIRECT_URI}"
    )
    headers = {"content-type": "application/x-www-form-urlencoded"}
    response_data = requests.post(f"https://{AUTH0_DOMAIN}/oauth/token", data=payload, headers=headers)
    print(response_data)
    print(f"Response Text: {response_data.text}")

    response_json = response_data.json()

    access_token = response_json.get("access_token")
    id_token = response_json.get("id_token")

    print(f"Access Token is : {access_token}")
    # Uncomment the following code if you want to set cookies
    # if access_token and id_token:
    #     response.set_cookie(
    #         key="access_token", 
    #         value=access_token, 
    #         httponly=True, 
    #         secure=False, 
    #         samesite="Lax",
    #     )
    #     response.set_cookie(
    #         key="id_token", 
    #         value=id_token, 
    #         httponly=True, 
    #         secure=False, 
    #         samesite="Lax",
    #     )
    print(response.headers)

    return {"access_token": access_token, "id_token": id_token}

# Optional: Add a root endpoint
@app.get("/")
async def root():
    logger.info("Root endpoint accessed")
    return {"message": "Welcome to the Modella API!"}