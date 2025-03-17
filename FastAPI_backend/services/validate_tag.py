from fastapi import HTTPException

from services.keywords import get_keywords

def validate_tag_data(tag):
    """Validates tag data against predefined keyword lists and numeric constraints."""

    # Validation for categorical fields
    valid_fields = {
        "natural_eye_color": "natural_eye_colors",
        "body_Type": "body_types",
        "work_Field": "work_fields",
        "skin_Tone": "skin_tones",
        "ethnicity": "ethnicities",
        "natural_hair_type": "natural_hair_types",
        "gender": "genders",
        "location": "locations",
        "experience_Level": "experience_levels",
        "work_fields": "work_fields",
    }

    for field, keyword_category in valid_fields.items():
        value = getattr(tag, field, None)
        if value:
            allowed_values = get_keywords(keyword_category)

            if isinstance(value, list):  # Handle multiple selections 
                if not all(item in allowed_values for item in value):
                    raise HTTPException(
                        status_code=400,
                        detail=f"Invalid value in {field}. Allowed values: {allowed_values}"
                    )
            elif value not in allowed_values:  # Handle single selections
                raise HTTPException(
                    status_code=400,
                    detail=f"Invalid value '{value}' for {field}. Allowed values: {allowed_values}"
                )

    # Numeric field validation (applies to ModelTagData, BrandTagData, and ProjectTagData)
    def validate_numeric(field_name, value, min_val, max_val):
        if value is not None:
            if isinstance(value, tuple):  # Handle range values
                min_value, max_value = value
                if not (min_val <= min_value <= max_val and min_val <= max_value <= max_val and min_value <= max_value):
                    raise HTTPException(
                        status_code=400,
                        detail=f"Invalid range for {field_name}. Must be between {min_val} and {max_val}, with min ≤ max."
                    )
            elif not (min_val <= value <= max_val):  # Handle single values
                raise HTTPException(
                    status_code=400,
                    detail=f"{field_name} must be between {min_val} and {max_val}."
                )

    # Validate age, height, shoe size, and price range
    validate_numeric("age", getattr(tag, "age", None), 8, 100)
    validate_numeric("height", getattr(tag, "height", None), 116, 191)
    validate_numeric("shoe_Size", getattr(tag, "shoe_Size", None), 31, 50)
    validate_numeric("bust_chest", getattr(tag, "bust_chest", None), 61, 117)
    validate_numeric("waist", getattr(tag, "waist", None), 51, 91)
    validate_numeric("hips", getattr(tag, "hips", None), 61, 107)

