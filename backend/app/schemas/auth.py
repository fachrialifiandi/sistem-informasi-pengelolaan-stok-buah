from pydantic import BaseModel, Field

class LoginRequest(BaseModel):
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

class RegisterRequest(BaseModel):
    fullName: str = Field(..., description="User's full name")
    email: str = Field(..., description="Email address of the user")
    password: str = Field(..., min_length=8, description="Password must be at least 8 characters long")

class RegisterResponse(BaseModel):
    email: str
    fullName: str
    recoveryKey: str

class ForgotPasswordRequest(BaseModel):
    email: str
    recoveryKey: str = Field(..., description="The 8-character recovery key")
    newPassword: str = Field(..., min_length=8, description="The new password")

class ChangePasswordRequest(BaseModel):
    currentPassword: str = Field(..., description="The user's current password")
    newPassword: str = Field(..., min_length=8, description="The new password")
