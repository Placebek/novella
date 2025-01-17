
from fastapi import APIRouter, Depends, File, UploadFile
from sqlalchemy.ext.asyncio import AsyncSession
from app.api.novella.schemes.create import OptionsCreate
from services.context import authenticate
from database.db import get_db
from app.api.novella.commands.novella_bll import request_novella, get_options_bll, the_end_novella_bll
from app.api.novella.schemes.response import RequestResponse, OptionsResponse
from dotenv import load_dotenv

load_dotenv()
router = APIRouter()

@router.post(
    "/mp3",
    response_model=RequestResponse
)
async def request(
    audio_file: UploadFile = File(...),
    user: dict = Depends(authenticate),
    db: AsyncSession = Depends(get_db)
):
    return await request_novella(audio_file=audio_file)


@router.post(
    "/g4f",
    response_model=OptionsResponse
)
async def get_options(
    text: OptionsCreate,
    user: dict = Depends(authenticate),
    db: AsyncSession = Depends(get_db)
):
    return await get_options_bll(text)


@router.post(
    "/theEnd",
    response_model=OptionsResponse
)
async def the_end_novella(
    text: OptionsCreate,
    user: dict = Depends(authenticate),
    db: AsyncSession = Depends(get_db)
):
    return await the_end_novella_bll(text=text)
