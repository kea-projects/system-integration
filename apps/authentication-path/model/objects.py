from pydantic import BaseModel
import uuid


class LoginObject(BaseModel):
    email: str
    password: str


class LoginRes(BaseModel):
    token: str


class SignupObject(BaseModel):
    email: str
    name: str
    password: str


class SignupRes(BaseModel):
    user_id: uuid.UUID
    email: str
    name: str


class InviteObject(BaseModel):
    from_email: str
    to_email: str
    token: str


class InviteRes(BaseModel):
    status_question_mark: str


class ValidateObject(BaseModel):
    token: str


class ValidateRes(BaseModel):
    isValid: bool
