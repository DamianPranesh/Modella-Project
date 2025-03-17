# Activate the virtual environment
& .\mvenv\Scripts\Activate.ps1

# Run the backend using uvicorn
uvicorn main:app --reload

# to run .\run_backend.ps1 or powershell -ExecutionPolicy Bypass -File .\run_backend.ps1

