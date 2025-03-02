import requests
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

auth0_client_id = os.environ.get("AUTH0_CLIENT_ID2")
auth0_client_secret = os.environ.get("AUTH0_CLIENT_SECRET2")
auth0_audience = os.environ.get("AUTH0_AUDIENCE")

payload ={
    "client_id":auth0_client_id,
    "client_secret":auth0_client_secret,
    "audience": auth0_audience,
    "grant_type":"client_credentials"
    }

response = requests.post("https://modellaauth.us.auth0.com/oauth/token",json=payload)

print(response.json())