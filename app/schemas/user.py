from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime
from app.models.user import UserRole

# Base User schema
class UserBase(BaseModel):
    username: str
    email: EmailStr
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    role: UserRole = UserRole.USER

# User creation schema
class UserCreate(UserBase):
    password: str

# User update schema
class UserUpdate(BaseModel):
    username: Optional[str] = None
    email: Optional[EmailStr] = None
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    role: Optional[UserRole] = None
    is_active: Optional[bool] = None

# User response schema (without password)
class UserResponse(UserBase):
    id: int
    is_active: bool
    last_login: Optional[datetime] = None
    created_at: datetime
    updated_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True

# Login schema
class UserLogin(BaseModel):
    username: str
    password: str

# Token schema
class Token(BaseModel):
    access_token: str
    token_type: str
    user: UserResponse

# Token data schema
class TokenData(BaseModel):
    username: Optional[str] = None

# Password change schema
class PasswordChange(BaseModel):
    current_password: str
    new_password: str 