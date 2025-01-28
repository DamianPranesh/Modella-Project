import logging
from logging.handlers import RotatingFileHandler

# Define log file name and format
LOG_FILE = "application.log"

# Create a rotating file handler (rotates logs when they reach a certain size)
file_handler = RotatingFileHandler(LOG_FILE, maxBytes=5 * 1024 * 1024, backupCount=3)  # 5 MB files, keep 3 backups
file_handler.setLevel(logging.WARNING)

# Create a console handler
console_handler = logging.StreamHandler()
console_handler.setLevel(logging.INFO)

# Define log format
formatter = logging.Formatter("%(asctime)s - %(name)s - %(levelname)s - %(message)s")
file_handler.setFormatter(formatter)
console_handler.setFormatter(formatter)

# Configure the root logger
logging.basicConfig(
    level=logging.INFO,  # Minimum level to log
    handlers=[file_handler, console_handler]
)
