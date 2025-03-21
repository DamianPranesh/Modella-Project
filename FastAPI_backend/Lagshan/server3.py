from fastapi import FastAPI, Response
from starlette.responses import RedirectResponse
from routes.role_management import router as role_router
from fastapi.middleware.cors import CORSMiddleware
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

app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include the role management router
app.include_router(role_router, prefix="/api")

@app.get("/login")
def register():
    return RedirectResponse(
        f"https://{AUTH0_DOMAIN}/authorize"
        f"?response_type=code"
        f"&client_id={AUTH0_CLIENT_ID}"
        f"&redirect_uri={REDIRECT_URI}"
        f"&scope=offline_access openid profile email"
        f"&audience={AUTH0_AUDIENCE}"
    )

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