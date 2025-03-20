from slowapi import Limiter
from slowapi.util import get_remote_address
from setting import REDIS_URL


#  Global Limiter instance
limiter = Limiter(
    key_func=get_remote_address,  # Rate limit by IP address
    storage_uri=REDIS_URL
)
