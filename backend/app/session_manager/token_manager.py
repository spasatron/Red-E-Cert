from datetime import datetime, timedelta

from fastapi import Depends, Header

from pydantic import BaseModel

from jose import JWTError, jwt


# TODO Change
SECRET_KEY = "dev-secret-key"
ALGORITHM = "HS256"

# Token expiration time (in minutes)
ACCESS_TOKEN_EXPIRE_MINUTES = 30


# Pydantic model for user authentication
class UserAuth(BaseModel):
    sessions_id: str


# Get Token Header
def get_current_token(authorization: str = Header(...)):
    if authorization is None:
        return None
    if authorization.startswith("Bearer "):
        token = authorization.split("Bearer ")[1]
        return token
    return None


# Function to create an access token
def create_access_token(
    data: dict,
    expires_delta: timedelta = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES),
):
    to_encode = data.copy()
    expire = datetime.utcnow() + expires_delta
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt


# Function to verify and decode a token
def verify_token(token: str = Depends(get_current_token)):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        session_id = payload.get("session_id")
        if session_id is None:
            return None
    except JWTError:
        return None
    return session_id
