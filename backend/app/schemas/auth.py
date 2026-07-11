from pydantic import BaseModel, EmailStr, Field

class LoginRequest(BaseModel):
    # Although named username for API spec, it corresponds to email input on UI
    username: str = Field(..., description="Email address of the user")
    password: str = Field(..., min_length=8, description="Password must be at least 8 characters long")

class UserResponse(BaseModel):
    id: str
    username: str
    full_name: str
    role: str

class LoginResponse(BaseModel):
    access_token: str
    token_type: str = "Bearer"
    user: UserResponse
