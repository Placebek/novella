from typing import List
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.api.request.schemas.create import RequestCreate
from database.db import get_db
from app.api.request.schemas.response import StatusResponse
from app.api.request.commands.request_crud import post_requests

router = APIRouter()

@router.post(
    '/requests',
    summary="Создание нового запроса",
    response_model=StatusResponse
)
async def create_request(request: RequestCreate, db: AsyncSession = Depends(get_db)):
    return await post_requests(request=request, db=db)