import hashlib
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBasic, HTTPBasicCredentials
import secrets

from services.service import select_username_in_db
from database.db import get_db
from sqlalchemy.ext.asyncio import AsyncSession


security = HTTPBasic()


def hash_password(plain_password: str) -> str:
    return hashlib.sha256(plain_password.encode('utf-8')).hexdigest()


def verify_password(plain_password: str, hashed_password: str) -> str:
    return hash_password(plain_password) == hashed_password


async def authenticate(
    credentials: HTTPBasicCredentials = Depends(security),
    db: AsyncSession = Depends(get_db),
):
    username = credentials.username
    password = credentials.password

    user = await select_username_in_db(username=username, db=db)

    if user and verify_password(hashed_password=user.hash_password, plain_password=password):
        return {'success': True}

    raise HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Invalid username or password",
        headers={"WWW-Authenticate": "Basic"},
    )
