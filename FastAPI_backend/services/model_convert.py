from pydantic import BaseModel
from typing import Type, TypeVar, Optional, Tuple, List, Dict, Any

T = TypeVar("T", bound=BaseModel)

def convert_model(source: BaseModel, target_cls: Type[T], exclude_fields: Optional[List[str]] = None) -> T:
    """
    Converts a Pydantic model to another Pydantic model while:
    - Removing fields listed in `exclude_fields`
    - Ignoring None values
    - Ignoring tuples if they contain None values
    - Removing None values from lists and ignoring empty lists
    
    :param source: The source Pydantic model
    :param target_cls: The target Pydantic model class
    :param exclude_fields: List of fields to be excluded from conversion
    :return: An instance of target_cls with cleaned data
    """
    exclude_fields = set(exclude_fields or [])
    filtered_data: Dict[str, Any] = {}

    for key, value in source.model_dump(exclude=exclude_fields).items():
        if value is None:
            continue  # Ignore None values

        if isinstance(value, tuple):
            # Ignore tuple if it contains None values
            if any(v is None for v in value):
                continue  

        if isinstance(value, list):
            # Remove None values from list
            cleaned_list = [v for v in value if v is not None]
            if not cleaned_list:  # Ignore empty lists
                continue
            value = cleaned_list  # Update value to cleaned list

        filtered_data[key] = value

    return target_cls(**filtered_data)
