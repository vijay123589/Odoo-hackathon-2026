from typing import Generic, TypeVar, Optional
from pydantic import BaseModel

DataType = TypeVar("DataType")

class APIResponse(BaseModel, Generic[DataType]):
    success: bool
    message: str
    data: Optional[DataType] = None
