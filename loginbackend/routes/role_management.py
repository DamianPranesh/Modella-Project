from fastapi import APIRouter, HTTPException, Depends
from auth0.management import Auth0
from auth0.authentication import GetToken
import os
from dotenv import load_dotenv

load_dotenv()

router = APIRouter()

def get_auth0_management():
    domain = os.getenv('AUTH0_DOMAIN')
    client_id = os.getenv('AUTH0_CLIENT_ID')
    client_secret = os.getenv('AUTH0_CLIENT_SECRET')
    
    get_token = GetToken(domain)
    token = get_token.client_credentials(
        client_id,
        client_secret,
        f'https://{domain}/api/v2/'
    )
    
    return Auth0(domain, token['access_token'])

@router.post("/assign-role")
async def assign_role(user_id: str, role: str):
    try:
        auth0 = get_auth0_management()
        
        # Update user metadata
        auth0.users.update(user_id, {
            'app_metadata': {
                'role': role
            }
        })
        
        # Get role ID from Auth0
        roles = auth0.roles.list()
        role_id = next(r['id'] for r in roles if r['name'] == role)
        
        # Assign role to user
        auth0.users.add_roles(user_id, [role_id])
        
        return {"success": True}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))