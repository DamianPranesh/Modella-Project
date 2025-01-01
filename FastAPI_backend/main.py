from fastapi import FastAPI
from routes.tag_routes import router as tag_router

app = FastAPI()

app.include_router(tag_router, prefix="/tags", tags=["Tags"])