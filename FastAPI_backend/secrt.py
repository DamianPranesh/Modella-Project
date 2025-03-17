import secrets
secret_key = secrets.token_urlsafe(32)  # Generates a random 32-byte string
print(secret_key)
