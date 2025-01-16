from datetime import datetime
from json import dump
from typing import Optional
from pydantic import BaseModel


class RequestCreate(BaseModel):
    text: Optional[str] = None
    title: Optional[str] = None
    is_active: Optional[bool] = True
    is_finished: Optional[bool] = False
    # update: Optionaldatetime

class OptionsCreate(BaseModel):
    text: str
    