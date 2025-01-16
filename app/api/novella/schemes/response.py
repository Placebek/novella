from pydantic import BaseModel


class RequestResponse(BaseModel):
    text: str
    title: str
    options: list[dict]

class OptionsResponse(BaseModel):
    options: list[dict]