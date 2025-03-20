from typing import List

import logging

from fastapi import APIRouter

# Create a logger specific to this module
logger = logging.getLogger(__name__)

router = APIRouter(prefix="/keywords", tags=["keywords"])

keywords = {
    "natural_eye_colors": [
        "Brown", "Blue", "Hazel", "Green", "Gray", "Amber", "Red", "Violet", "Heterochromia"
    ],
    "body_types": [
        "Straight Size Models", "Plus-Size Models", "Petite Models", "Fitness Models",
        "Glamour Models", "Mature Models", "Alternative Models", "Parts Models", 
        "Child Models", "Body-Positive Models", "Androgynous Models", "Fit Models"
    ],
    "work_fields": [
        "Fashion/Runway Modeling", "Commercial Modeling", "Beauty Modeling",
        "Lingerie/Swimsuit Modeling", "Fitness Modeling", "Plus-Size Modeling",
        "Editorial Modeling", "Child Modeling", "Parts Modeling", "Catalog Modeling",
        "Runway Modeling", "Commercial Print Modeling", "Virtual Modeling", "Lifestyle Modeling"
    ],
    "skin_tones": [
        "Fair", "Light", "Medium", "Olive", "Tan", "Deep Tan", "Brown", "Dark Brown", "Ebony"
    ],
    "ethnicities": [
        "Caucasian", "African", "African-American", "Hispanic/Latino", "Asian",
        "South Asian (Indian, Pakistani, Bangladeshi)", "Middle Eastern",
        "Native American/Indigenous", "Pacific Islander", "Mixed-Race", 
        "Mediterranean", "Nordic", "East Asian (Chinese, Japanese, Korean)", 
        "Southeast Asian (Thai, Filipino, Vietnamese, etc.)", "Caribbean"
    ],
    "natural_hair_types": [
        "Straight", "Wavy", "Curly", "Coily", "Kinky", "Textured", "Afro", "Braided",
        "Buzz Cut", "Shaved", "Dyed/Colored Hair", "Gray/White Hair", "Bald"
    ],
    "genders": [
        "Female", "Male", "Non-Binary", "Androgynous", "Transgender Female", 
        "Transgender Male", "Genderfluid", "Agender"
    ],
    "locations": [
        "Mumbai, India", "New York City, USA", "Shanghai, China", "Dubai, UAE", 
        "Rome, Italy", "Seoul, South Korea", "Paris, France", "Mexico City, Mexico", 
        "London, United Kingdom", "Cape Town, South Africa"
    ],
    "experience_levels": [
        "Beginner (0-1 years)", "Intermediate (1-3 years)", "Experienced (3-5 years)",
        "Advanced (5-7 years)", "Expert (7+ years)"
    ],
}
def get_keywords(category: str) -> List[str]:
    """
    Retrieve a list of keywords for the specified category.

    Args:
        category (str): The category for which keywords are requested.

    Returns:
        list[str]: A list of keywords for the given category. If the category does not exist, returns an empty list.
    """
    normalized_category = category.lower()
    keywords_normalized = {k.lower(): v for k, v in keywords.items()}
    if normalized_category not in keywords_normalized:
        logger.warning(f"Requested unknown category: {category}")
    return keywords_normalized.get(normalized_category, [])


@router.get("/filters/{category}", response_model=List[str])
def get_allowed_values(category: str):
    """Fetch allowed values for a given category"""
    return keywords.get(category.lower(), [])