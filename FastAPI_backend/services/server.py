# import os
# import httpx
# from typing import Annotated
# from fastapi import FastAPI, Depends, HTTPException
# from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
# from jose import jws, jwt, ExpiredSignatureError, JWTError, JWSError
# from jose.exceptions import JWTClaimsError
# from pydantic import BaseModel
# from starlette.responses import RedirectResponse
# from models.User import UserUpdate
# from config.setting import user_collection
# from datetime import datetime, timezone
# from fastapi.middleware.cors import CORSMiddleware

# server = FastAPI()

# # Load secrets from environment variables
# AUTH0_DOMAIN = os.getenv("AUTH0_DOMAIN")
# AUTH0_CLIENT_ID = os.getenv("AUTH0_CLIENT_ID")
# AUTH0_CLIENT_SECRET = os.getenv("AUTH0_CLIENT_SECRET")
# AUTH0_MANAGEMENT_CLIENT_ID = os.getenv("AUTH0_MANAGEMENT_CLIENT_ID")
# AUTH0_MANAGEMENT_CLIENT_SECRET = os.getenv("AUTH0_MANAGEMENT_CLIENT_SECRET")
# JWKS_ENDPOINT = f"https://{AUTH0_DOMAIN}/.well-known/jwks.json"
# AUDIENCE = os.getenv("AUDIENCE")

# security = HTTPBearer()

# # Enable CORS
# server.add_middleware(
#     CORSMiddleware,
#     allow_origins=["http://localhost:3000"],  # Change to specific frontend URL in production
#     allow_credentials=True,
#     allow_methods=["*"],
#     allow_headers=["*"],
# )

# async def fetch_jwks():
#     async with httpx.AsyncClient() as client:
#         response = await client.get(JWKS_ENDPOINT)
#         return response.json()["keys"]

# async def find_public_key(kid):
#     jwks = await fetch_jwks()
#     for key in jwks:
#         if key["kid"] == kid:
#             return key
#     return None

# async def decode_access_token(access_token: str):
#     try:
#         unverified_headers = jws.get_unverified_header(access_token)
#         #
#         kid = unverified_headers.get("kid")
#         if not kid:
#             raise HTTPException(status_code=401, detail="Invalid token: No key ID found")
#         # public_key = await find_public_key(unverified_headers["kid"])
#         public_key = await find_public_key(kid)
#         if not public_key:
#             raise HTTPException(status_code=401, detail="Invalid token: Public key not found")

#         payload = jwt.decode(
#             access_token,
#             key=public_key,
#             audience=AUDIENCE,
#             algorithms="RS256",
#         )
#         print(payload)
#         return payload
#     except (ExpiredSignatureError, JWTError, JWTClaimsError, JWSError) as error:
#         raise HTTPException(status_code=401, detail=str(error))

# class UserClaims(BaseModel):
#     sub: str
#     permissions: list[str]
#     name: str
#     email: str

# async def validate_token(credentials: Annotated[HTTPAuthorizationCredentials, Depends(security)]):
#     token_payload = await decode_access_token(credentials.credentials)

#     email = token_payload.get("email")  # Avoid KeyError
#     if not email:
#         raise HTTPException(status_code=400, detail="Email is missing in the token")

#     return UserClaims(
#         sub=token_payload["sub"],
#         permissions=token_payload.get("permissions", []),
#         name=token_payload.get("name"),
#         email=token_payload.get("email"),
#     )

# @server.get("/protected")
# def protected(user_claims: UserClaims = Depends(validate_token)):
#     return user_claims

# @server.get("/good-morning")
# def good_morning(user_claims: UserClaims = Depends(validate_token)):
#     return {"message": f"Good morning! {user_claims.name}"}

# @server.get("/login")
# def register():
#     return RedirectResponse(
#         f"https://{AUTH0_DOMAIN}/authorize"
#         "?response_type=code"
#         f"&client_id={AUTH0_CLIENT_ID}"
#         "&redirect_uri=http://localhost:8000/token"
#         f"&scope=offline_access openid profile email"
#         f"&audience={AUDIENCE}"
#     )

# @server.get("/token")
# async def get_access_token(code: str):
#     payload = {
#         "grant_type": "authorization_code",
#         "client_id": AUTH0_CLIENT_ID,
#         "client_secret": AUTH0_CLIENT_SECRET,
#         "code": code,
#         "redirect_uri": "http://localhost:8000/token",
#     }
#     headers = {"content-type": "application/x-www-form-urlencoded"}
#     async with httpx.AsyncClient() as client:
#         response = await client.post(f"https://{AUTH0_DOMAIN}/oauth/token", data=payload, headers=headers)
#     token_data = response.json()

#     access_token = token_data.get("access_token")
#     if access_token:
#         user_claims = await decode_access_token(access_token)
#         print(user_claims)
#         existing_user = await user_collection.find_one({"email": user_claims["email"]})
#         if not existing_user:
#             user_data = {
#                 "user_Id": user_claims["sub"],
#                 "name": user_claims["name"],
#                 "email": user_claims["email"],
#                 "auth_method": "google" if "google" in user_claims["sub"] else "custom",
#                 "role": "pending",
#                 "created_At": datetime.now(timezone.utc),
#                 "updated_At": None,
#                 "bio": None,
#             }
#             await user_collection.insert_one(user_data)
#         return {"message": f"User {user_claims['name']} logged in successfully"}
#     raise HTTPException(status_code=401, detail="Invalid token")


# @server.get("/me")
# async def get_current_user(user_claims: UserClaims = Depends(validate_token)):
#     # Fetch the user from the database using the email from the token
#     user = await user_collection.find_one({"email": user_claims.email})

#     if not user:
#         raise HTTPException(status_code=404, detail="User not found")

#     return {
#         "user_Id": user.get("user_Id"),
#         "role": user.get("role")
#     }



# @server.put("/me/update")
# async def update_user(
#     user_update: UserUpdate,
#     user_claims: UserClaims = Depends(validate_token),
# ):
#     # Fetch the current user from the database
#     existing_user = await user_collection.find_one({"email": user_claims.email})

#     if not existing_user:
#         raise HTTPException(status_code=404, detail="User not found")

#     # Prepare update data
#     update_data = {
#         "updated_At": datetime.now(timezone.utc)  # Always update this
#     }

#     if user_update.name is not None:
#         update_data["name"] = user_update.name
#     if user_update.bio is not None:
#         update_data["bio"] = user_update.bio

#     # Update the user in the database
#     await user_collection.update_one(
#         {"email": user_claims.email}, {"$set": update_data, "$currentDate": {"updated_At": True}}
#     )

#     return {"message": "User updated successfully", "updated_fields": update_data}



# @server.delete("/me/delete")
# async def delete_user(user_claims: UserClaims = Depends(validate_token)):
#     async with httpx.AsyncClient() as client:
#         management_token = await get_management_token()
#         delete_url = f"https://{AUTH0_DOMAIN}/api/v2/users/{user_claims.sub}"
#         headers = {"Authorization": f"Bearer {management_token}"}
#         auth0_delete_response = await client.delete(delete_url, headers=headers)

#     if auth0_delete_response.status_code in [200, 204]:
#         await user_collection.delete_one({"email": user_claims.email})
#         return {"message": "User successfully deleted from MongoDB and Auth0"}
#     raise HTTPException(status_code=500, detail="Failed to delete user from Auth0")

# async def get_management_token():
#     token_url = f"https://{AUTH0_DOMAIN}/oauth/token"
#     token_payload = {
#         "client_id": AUTH0_MANAGEMENT_CLIENT_ID,
#         "client_secret": AUTH0_MANAGEMENT_CLIENT_SECRET,
#         "audience": f"https://{AUTH0_DOMAIN}/api/v2/",
#         "grant_type": "client_credentials"
#     }
#     async with httpx.AsyncClient() as client:
#         response = await client.post(token_url, json=token_payload)
#         if response.status_code != 200:
#             raise HTTPException(status_code=500, detail="Failed to fetch Auth0 management token")
#     token = response.json().get("access_token")
#     if not token:
#         raise HTTPException(status_code=500, detail=f"Auth0 token fetch failed: {response.json()}")
#     return token
