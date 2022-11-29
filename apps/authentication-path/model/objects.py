from pydantic import BaseModel
from uuid import UUID


class HTTPError(BaseModel):
    detail: str

    class Config:
        schema_extra = {
            "example": {"detail": "Some additional information about the error"}
        }


class ValidateResError(BaseModel):
    isValid: bool

    class Config:
        schema_extra = {"example": {"isValid": False}}


class LoginObject(BaseModel):
    email: str
    password: str

    class Config:
        schema_extra = {
            "example": {
                "email": "bobertRobert@someemail.com",
                "name": "Bobert Rob",
                "password": "SecretPassword123",
            }
        }


class LoginRes(BaseModel):
    token: str

    class Config:
        schema_extra = {
            "example": {
                "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE2Njk2NzkyNTkuOTgyNzMxLCJleHAiOjE2NzAyODQwNjAuOTgyNzMxLCJzdWIiOiJ2YWxpZDNAZW1haWwuY29tIn0.C5VZ3L2njziXTNyGGVk7CUVbXXfxcdfQJFA0PszU9P4"
            }
        }


class SignupObject(BaseModel):
    email: str
    name: str
    password: str

    class Config:
        schema_extra = {
            "example": {
                "email": "validEmail@email.com",
                "name": "Bob Builder",
                "password": "1234password",
            }
        }


class SignupRes(BaseModel):
    user_id: UUID
    email: str
    name: str

    class Config:
        schema_extra = {
            "examples": {
                "user_id": "80028aea4d2848b4b2e5d91074f0b85f",
                "email": "valid8@email.com",
                "name": "Bobert Rob",
            }
        }


class InviteObject(BaseModel):
    token: str


class InviteRes(BaseModel):
    status: str


class ValidateObject(BaseModel):
    token: str

    class Config:
        schema_extra = {
            "example": {
                "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE2Njk2NzU4MDQuMzYyNjg0LCJleHAiOjE2NzAyODA2MDUuMzYyNjg0LCJzdWIiOiJzb21lQGVtYWlsLmNvbSJ9.0MzJy0ERFNLFCuzBL7fJoAiUmECKjvHD-OJeNdH8Dkw"
            }
        }


class ValidateRes(BaseModel):
    isValid: bool

    class Config:
        schema_extra = {"example": {"isValid": True}}
