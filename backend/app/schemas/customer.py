from pydantic import BaseModel, EmailStr
from typing import Optional

class CustomerCreate(BaseModel):
    name: str
    email: EmailStr
    phone: Optional[str] = None
    address: Optional[str] = None

class CustomerResponse(CustomerCreate):
    id: int

    class Config:
        from_attributes = True