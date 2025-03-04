import requests
import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

auth0_client_id = os.environ.get("AUTH0_CLIENT_ID")
auth0_client_secret = os.environ.get("AUTH0_CLIENT_SECRET")
auth0_audience = os.environ.get("AUTH0_AUDIENCE")
auth0_domain = os.environ.get("AUTH0_DOMAIN")

payload ={
    "client_id":auth0_client_id,
    "client_secret":auth0_client_secret,
    "audience": auth0_audience,
    "grant_type":"client_credentials"
    }

response = requests.post(f"https://{auth0_domain}/oauth/token", json=payload)

print(response.json())