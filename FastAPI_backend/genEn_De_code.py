from dotenv import load_dotenv
import os
from cryptography.fernet import Fernet

# Load environment variables from .env file
load_dotenv()

# Get the encryption key from the environment variable
key = os.getenv('ENCRYPTION_KEY')

if key is None:
    raise ValueError("ENCRYPTION_KEY not set in environment variables")

# If key is found, convert to bytes
cipher_suite = Fernet(key.encode())

def encrypt_value(value: str) -> str:
    return cipher_suite.encrypt(value.encode()).decode()

def decrypt_value(encrypted_value: str) -> str:
    return cipher_suite.decrypt(encrypted_value.encode()).decode()

# Example
original = "brand_67c5b2c43ae5b4ccb85b9a11"
encrypted = encrypt_value(original)
print(f"Encrypted: {encrypted}")
print(f"Decrypted: {decrypt_value(encrypted)}")

