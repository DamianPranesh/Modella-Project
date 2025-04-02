from fastapi import APIRouter, HTTPException, Depends, Header, Request, Cookie
from pydantic import BaseModel
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
AUTH0_ALGORITHM = "RS256"

router = APIRouter()

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
    
async def get_user_role(user_id: str, token: str):
    """Fetch the user's role from Auth0."""
    url = f"https://{AUTH0_DOMAIN}/api/v2/users/{user_id}"
    headers = {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json"
    }

    async with httpx.AsyncClient() as client:
        response = await client.get(url, headers=headers)
        if response.status_code != 200:
            raise HTTPException(status_code=response.status_code, detail=response.json())
        user_data = response.json()
        return user_data.get("app_metadata", {}).get("role", None)
    
async def get_userName(user_id: str, token: str):
    """Fetch the user's name from Auth0."""
    url = f"https://{AUTH0_DOMAIN}/api/v2/users/{user_id}"
    headers = {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json"
    }

    async with httpx.AsyncClient() as client:
        response = await client.get(url, headers=headers)
        if response.status_code != 200:
            raise HTTPException(status_code=response.status_code, detail=response.json())
        user_data = response.json()
        print("Name : " + user_data.get("name"))  # Debugging step
        print(user_data)
        return user_data.get("name")


def get_payload_from_token(authorization: str = Header(None)):  # Not Used
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

        # Verify token using the public key
        payload = jwt.decode(
            token, rsa_key, algorithms=[AUTH0_ALGORITHM], 
            audience=AUTH0_AUDIENCE, issuer=f"https://{AUTH0_DOMAIN}/"
        )
        return payload
    
    except JWTError as e:
        raise HTTPException(status_code=401, detail=f"Invalid or expired token: {str(e)}")

def get_user_id_from_token(authorization: str = Header(None)):
    """Extract and verify user ID from JWT token using Auth0's public key."""
    print(f"Authorization Header: {authorization}")  # Debugging line

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

        # Verify token using the public key
        payload = jwt.decode(
            token, rsa_key, algorithms=[AUTH0_ALGORITHM], 
            audience=AUTH0_AUDIENCE, issuer=f"https://{AUTH0_DOMAIN}/"
        )

        return payload.get("sub")  # "sub" contains Auth0 user ID

    except JWTError as e:
        raise HTTPException(status_code=401, detail=f"Invalid or expired token: {str(e)}")

def get_username_from_token(authorization: str = Header(None)): # Not Used
    """Extract and verify username from JWT token using Auth0's public key."""
    payload = get_payload_from_token(authorization)
    print("Name : " + payload.get("name"))  # Debugging step
    return payload.get("name")

def get_user_id_from_cookie(request: Request):
    """Extract and verify user ID from JWT token using Auth0's public key."""
    
    # Extract the access token from cookies
    access_token = request.cookies.get("access_token")
    print("Received Token:", access_token)  # Debugging step

    if not access_token:
        raise HTTPException(status_code=401, detail="Token not found in cookies")

    try:
        # Fetch Auth0 public keys
        jwks = get_auth0_public_key()
        unverified_header = jwt.get_unverified_header(access_token)

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

        # Verify the token
        payload = jwt.decode(
            access_token, rsa_key, algorithms=[AUTH0_ALGORITHM], 
            audience=AUTH0_AUDIENCE, issuer=f"https://{AUTH0_DOMAIN}/"
        )

        return payload.get("sub")  # "sub" contains Auth0 user ID

    except JWTError as e:
        raise HTTPException(status_code=401, detail=f"Invalid token: {str(e)}")

@router.post("/select-role")
async def select_role(
    request: RoleRequest,
    user_id: str = Depends(get_user_id_from_token),
    token: str = Depends(get_auth0_token)
):
    """Assign a role ('model' or 'business') to a user in Auth0."""
    print(f"User ID: {user_id}, Role: {request.role}")
    print(f"Token: {token}")
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

@router.get("/user-role")
async def fetch_user_role(
    user_id: str = Depends(get_user_id_from_token),
    token: str = Depends(get_auth0_token)
):
    """Fetch the role of the authenticated user."""
    role = await get_user_role(user_id, token)
    return {"user_id": user_id, "role": role}

@router.get("/user-name")
async def fetch_user_role(
    user_id: str = Depends(get_user_id_from_token),
    token: str = Depends(get_auth0_token)
):
    """Fetch the role of the authenticated user."""
    userName = await get_userName(user_id, token)
    return {"user_id": user_id, "userName": userName}

@router.get("/user-role-cookie")
async def fetch_user_role_cookie(
    token: str = Cookie(None)  # Read access token from HttpOnly cookie
):
    """Fetch the role of the authenticated user."""
    print("Received Token:", token)
    if not token:
        raise HTTPException(status_code=401, detail="Unauthorized: No token found")
    
    user_id = get_user_id_from_token(token)
    role = await get_user_role(user_id, token)
    
    return {"user_id": user_id, "role": role}

@router.get("/user-details")
async def fetch_user_details(
    user_id: str = Depends(get_user_id_from_token),
    token: str = Depends(get_auth0_token)
):
    """Fetch the user_id, role, username, and email of the authenticated user."""
    # Fetch the user's role from Auth0
    role = await get_user_role(user_id, token)
    
    # Fetch the user's name from Auth0
    # user_name = await get_userName(user_id, token)
    
    # Fetch the user's email from Auth0
    url = f"https://{AUTH0_DOMAIN}/api/v2/users/{user_id}"
    headers = {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json"
    }
    
    async with httpx.AsyncClient() as client:
        response = await client.get(url, headers=headers)
        if response.status_code != 200:
            raise HTTPException(status_code=response.status_code, detail=response.json())
        user_data = response.json()
        email = user_data.get("email")
    
    # Return the user details including user_name
    return {
        "user_id": user_id,
        "role": role,
        # "user_name": user_name,  # Include the user name here
        "email": email
    }

