# Modella API Project Overview

## Project Description

A FastAPI backend application integrated with MongoDB Atlas for data storage and AWS S3 for file management. The application serves as a platform for models and brands to connect and interact.

## Tech Stack

- **Framework**: FastAPI
- **Database**: MongoDB Atlas
- **File Storage**: AWS S3
- **Python Version**: 3.8+

## Core Components

### 1. Configuration

- **logging_config.py**: Handles application logging with rotating file handlers
- **settings.py**: Manages environment variables and database connections

### 2. Data Models

- **User.py**: User model with role-based structure (model/brand/admin)
- **file_model.py**: File metadata and URL management
- **rating_model.py**: Rating system implementation
- **tag.py**: Tagging system for user attributes

### 3. Services

- **file_service.py**:

  - Handles file uploads to AWS S3
  - Manages file visibility (private/public)
  - Generates presigned URLs
  - File size limit: 25MB
  - Supported file types: JPEG, PNG, PDF, MP4
  - Folders: image, profile-pic, portfolio, video

- **preferences_services.py** & **tag_services.py**:

  - Manage user preferences and tags
  - Filter functionality for matching
  - Support for random generation

- **rating_services.py**:

  - Rating system (1-5 scale)
  - Review management
  - Rating statistics

- **user_services.py**:
  - User CRUD operations
  - Role-based user management
  - Fake user generation for testing

### 4. Routes

All routes are prefixed with `/api/v1`

- **file_routes.py**: `/files`

  - File upload/download
  - Visibility management
  - URL generation

- **preferences_routes.py** & **tag_routes.py**: `/preferences`, `/tags`

  - Preference/tag management
  - Filtering endpoints
  - Random generation endpoints

- **rating_routes.py**: `/ratings`

  - Rating creation/updates
  - Review management
  - Rating statistics

- **user_routes.py**: `/users`
  - User management
  - Role-based operations
  - Test data generation

## Key Features

1. Role-based user system (Model/Brand/Admin)
2. Secure file management with AWS S3
3. Tag-based filtering system
4. Rating and review system
5. User preferences management
6. Public/Private file access control

## Database Collections

- users
- tags
- preferences
- ratings
- file_metadata

## File Management

- Secure file uploads to AWS S3
- Presigned URL generation
- Private/Public file access
- Folder organization
- File type validation
- Size limitations

## Security Features

- User validation
- File ownership checks
- Access control
- Error handling
- Request validation

## Testing Features

- Random data generation
- Fake user creation
- Test endpoints

## API Documentation

Available at `/docs` or `/redoc` endpoints
