from pydantic import BaseModel

class LoginObject(BaseModel):
    email: str
    password: str

class SignupObject(BaseModel):
    email: str
    name: str
    password: str

class InviteObject(BaseModel):
    from_email: str
    to_email: str
    token: str