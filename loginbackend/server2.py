import base64
import json
import os
from pathlib import Path

import requests
from fastapi import FastAPI, Depends, HTTPException, Response, Request
from jose import jws, jwt, ExpiredSignatureError, JWTError, JWSError
from jose.exceptions import JWTClaimsError
from pydantic import BaseModel
from starlette.responses import RedirectResponse
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

server = FastAPI()

# Load configuration from environment
jwks_endpoint = os.environ.get("JWKS_ENDPOINT")
auth0_client_id = os.environ.get("AUTH0_CLIENT_ID")
auth0_client_secret = os.environ.get("AUTH0_CLIENT_SECRET")
auth0_audience = os.environ.get("AUTH0_AUDIENCE")
auth0_domain = os.environ.get("AUTH0_DOMAIN")
redirect_uri = os.environ.get("REDIRECT_URI")

# Retrieve JWKS from Auth0
jwks = requests.get(jwks_endpoint).json()["keys"]

def find_public_key(kid):
    for key in jwks:
        if key["kid"] == kid:
            return key

def validate_token(request: Request):
    access_token = request.cookies.get("access_token")
    id_token = request.cookies.get("id_token")

    if not access_token or not id_token:
        raise HTTPException(status_code=401, detail="Token not found in cookies")

    try:
        unverified_headers = jws.get_unverified_header(access_token)
        token_payload = jwt.decode(
            token=access_token,
            key=find_public_key(unverified_headers["kid"]),
            audience=auth0_audience,
            algorithms="RS256",
        )
        return UserClaims(
            sub=token_payload["sub"],
            permissions=token_payload.get("permissions", []),
        )

    except (
        ExpiredSignatureError,
        JWTError,
        JWTClaimsError,
        JWSError,
    ) as error:
        raise HTTPException(status_code=401, detail=str(error))

class UserClaims(BaseModel):
    sub: str
    permissions: list[str]

@server.get("/protected")
def protected(user_claims: UserClaims = Depends(validate_token)):
    return user_claims

@server.get("/good-morning")
def good_morning(request: Request, user_claims: UserClaims = Depends(validate_token)):
    id_token = request.cookies.get("id_token")
    if not id_token:
        raise HTTPException(status_code=400, detail="id_token not found in cookies")

    email = "No email found"
    try:
        _, payload_b64, _ = id_token.split(".")
        payload_b64 += "=" * (-len(payload_b64) % 4)
        payload_json = base64.urlsafe_b64decode(payload_b64).decode("utf-8")
        email = json.loads(payload_json).get("email", "No email found")
    except Exception as e:
        email = f"Error decoding email: {str(e)}"

    return {"message": f"Good morning, {user_claims.sub}! Your email is {email}"}

@server.get("/login")
def register():
    return RedirectResponse(
        f"https://{auth0_domain}/authorize"
        f"?response_type=code"
        f"&client_id={auth0_client_id}"
        f"&redirect_uri={redirect_uri}"
        f"&scope=offline_access openid profile email"
        f"&audience={auth0_audience}"
    )

@server.get("/token")
def get_access_token(code: str, response: Response):
    payload = (
        "grant_type=authorization_code"
        f"&client_id={auth0_client_id}"
        f"&client_secret={auth0_client_secret}"
        f"&code={code}"
        f"&redirect_uri={redirect_uri}"
    )
    headers = {"content-type": "application/x-www-form-urlencoded"}

    response_data = requests.post(f"https://{auth0_domain}/oauth/token", data=payload, headers=headers)
    response_json = response_data.json()

    access_token = response_json.get("access_token")
    id_token = response_json.get("id_token")

    if access_token and id_token:
        response.set_cookie(
            key="access_token", 
            value=access_token, 
            httponly=True, 
            secure=True, 
            samesite="Strict"
        )
        response.set_cookie(
            key="id_token", 
            value=id_token, 
            httponly=True, 
            secure=True, 
            samesite="Strict"
        )

    return {"access_token": access_token, "id_token": id_token}

def read_existing_data(file_path):
    if Path(file_path).exists():
        with open(file_path, "r") as f:
            return json.load(f)
    return []

def is_email_duplicate(email, existing_data):
    return any(user["email"] == email for user in existing_data)

@server.post("/user-info")
def get_user_info(request: Request):
    try:
        user_claims = validate_token(request)
        id_token = request.cookies.get("id_token")
        if not id_token:
            raise HTTPException(status_code=400, detail="id_token not found in cookies")

        email = "No email found"
        try:
            _, payload_b64, _ = id_token.split(".")
            payload_b64 += "=" * (-len(payload_b64) % 4)
            payload_json = base64.urlsafe_b64decode(payload_b64).decode("utf-8")
            email = json.loads(payload_json).get("email", "No email found")
        except Exception as e:
            email = f"Error decoding email: {str(e)}"

        file_path = "user_info.json"
        existing_data = read_existing_data(file_path)

        if is_email_duplicate(email, existing_data):
            return {"detail": "Email already exists. User data not saved."}

        user_info = {
            "sub": user_claims.sub,
            "permissions": user_claims.permissions,
            "email": email,
        }

        existing_data.append(user_info)

        with open(file_path, "w") as f:
            json.dump(existing_data, f, indent=4)

        return user_info

    except (ExpiredSignatureError, JWTError, JWTClaimsError, JWSError) as error:
        raise HTTPException(status_code=401, detail=str(error))
