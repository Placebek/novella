from datetime import date
from json import dump
from typing import Optional
from pydantic import BaseModel


class RequestCreate(BaseModel):
    mp3: str
    text: Optional[str] = None
    user_id: int
    title: Optional[str] = None