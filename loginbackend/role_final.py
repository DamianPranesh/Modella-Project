from fastapi import FastAPI, HTTPException, Depends, Header, Response
from pydantic import BaseModel
from starlette.responses import RedirectResponse
import httpx
import os
from dotenv import load_dotenv
from jose import jwt, JWTError
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

class RoleRequest(BaseModel):
    role: str  # User selects "model" or "business"

async def get_auth0_token():
    """Fetch an Auth0 Management API token."""
    url = f"https://{AUTH0_DOMAIN}/oauth/token"
    payload = {
        "client_id": AUTH0_CLIENT_ID,
        "client_secret": AUTH0_CLIENT_SECRET,
        "audience": f"https://{AUTH0_DOMAIN}/api/v2/",
        "grant_type": "client_credentials"
    }

    async with httpx.AsyncClient() as client:
        response = await client.post(url, json=payload)
        if response.status_code != 200:
            raise HTTPException(status_code=500, detail=f"Failed to get Auth0 token: {response.text}")
        return response.json()["access_token"]

def get_auth0_public_key():
    """Fetch the public key from Auth0's JWKS for token verification."""
    try:
        jwks_url = f"https://{AUTH0_DOMAIN}/.well-known/jwks.json"
        jwks = requests.get(jwks_url).json()
        return jwks
    except requests.RequestException:
        raise HTTPException(status_code=500, detail="Could not fetch JWKS keys from Auth0")

def get_user_id_from_token(authorization: str = Header(None)):
    """Extract and verify user ID from JWT token using Auth0's public key."""
    if authorization is None or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Missing or malformed token")
    
    token = authorization.split(" ")[1]  # Extract JWT
    print("Received Token:", token)  # Debugging step


    try:
        jwks = get_auth0_public_key()
        unverified_header = jwt.get_unverified_header(token)
        print("JWT Header:", unverified_header)  # Debugging step

        rsa_key = {}

        for key in jwks["keys"]:
            if key["kid"] == unverified_header["kid"]:
                rsa_key = {
                    "kty": key["kty"],
                    "kid": key["kid"],
                    "use": key["use"],
                    "n": key["n"],
                    "e": key["e"],
                }
                break
        
        if not rsa_key:
            raise HTTPException(status_code=401, detail="Invalid token: Key not found")

        unverified_payload = jwt.get_unverified_claims(token)
        print("Token Payload:", unverified_payload)
        print("here line 79")

        # Verify token using the public key
        payload = jwt.decode(
            token, rsa_key, algorithms=[AUTH0_ALGORITHM], 
            audience=AUTH0_AUDIENCE, issuer=f"https://{AUTH0_DOMAIN}/"
        )

        print("here line 87")

        return payload.get("sub")  # "sub" contains Auth0 user ID

    except JWTError as e:
        print("here line 92")
        raise HTTPException(status_code=401, detail=f"Invalid or expired token: {str(e)}")

@app.post("/select-role")
async def select_role(
    request: RoleRequest,
#    user_id: str = "google-oauth2|101185961270938365505",
 #   token: str =  "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IkxQY0UzTVprX3Z3M1Bob0taRFZzcCJ9.eyJpc3MiOiJodHRwczovL2Rldi04NTAzdmtjY2hhcm8wMWczLnVzLmF1dGgwLmNvbS8iLCJzdWIiOiJaeGxySWppNmZSZFNuZUQxaEM4aXk5Y1djZDJnTVpNeUBjbGllbnRzIiwiYXVkIjoiaHR0cHM6Ly9kZXYtODUwM3ZrY2NoYXJvMDFnMy51cy5hdXRoMC5jb20vYXBpL3YyLyIsImlhdCI6MTc0MjAxOTc1NSwiZXhwIjoxNzQyMTA2MTU1LCJzY29wZSI6InJlYWQ6dXNlcnMgdXBkYXRlOnVzZXJzIGNyZWF0ZTp1c2VycyByZWFkOnVzZXJzX2FwcF9tZXRhZGF0YSB1cGRhdGU6dXNlcnNfYXBwX21ldGFkYXRhIGNyZWF0ZTp1c2Vyc19hcHBfbWV0YWRhdGEiLCJndHkiOiJjbGllbnQtY3JlZGVudGlhbHMiLCJhenAiOiJaeGxySWppNmZSZFNuZUQxaEM4aXk5Y1djZDJnTVpNeSJ9.otBQQBDZgNkVvsR3v6DnwJUyRlAuFpDgI64rteNNrjgT8MziLA9CVolMzGFE-GU5_SoBw6i7aS59wOs4vdndCi8pP-CPX0YuF2NtmEp5hkNTsfC1mTUfSPR_jFAxSzHTgYOjmmhQN89zKKVV1OMN7SP5O6TnfgGP8zCJ9ZG-WfIypknmVZzEFUtx0zQejxoMqWvfXYQFbTP74YdJvoVBczb6i0YVjukpJGOehTzF4bE_Z0-Vb4EyEQbFowuAC-H4FOrdrRezHj0evBDhMdVHFmCagVTFFB5St5W-iGomYuU9xV3xc6rdS5oHYihykRydCWZoSqe7fwhBxAFgf8akzQ"
    user_id: str = Depends(get_user_id_from_token),
    token: str = Depends(get_auth0_token)
):
    """Assign a role ('model' or 'business') to a user in Auth0."""
    
    valid_roles = ["model", "business"]
    if request.role not in valid_roles:
        raise HTTPException(status_code=400, detail="Invalid role selected")

    url = f"https://{AUTH0_DOMAIN}/api/v2/users/{user_id}"

    headers = {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json"
    }

    payload = {"app_metadata": {"role": request.role}}

    async with httpx.AsyncClient() as client:
        response = await client.patch(url, headers=headers, json=payload)
        if response.status_code != 200:
            raise HTTPException(status_code=response.status_code, detail=response.json())

    return {"message": f"Role '{request.role}' assigned successfully"}

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