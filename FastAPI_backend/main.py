# from fastapi import FastAPI
# from routes.tag_routes import router as tag_router

# app = FastAPI()

# app.include_router(tag_router, prefix="/tags", tags=["Tags"])


from fastapi import FastAPI
from routes.tag_routes import router as tag_router
from routes.preferences_routes import router as preferences_router  # Import the preferences router

app = FastAPI()

# Include the tag routes
app.include_router(tag_router, prefix="/tags", tags=["Tags"])

# Include the preferences routes
app.include_router(preferences_router, prefix="/preferences", tags=["Preferences"])

# Optional: Add a root endpoint
@app.get("/")
async def root():
    return {"message": "Welcome to the Modella API!"}


