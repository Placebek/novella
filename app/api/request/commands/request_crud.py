from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from model.model import Request
from app.api.request.schemas.create import RequestCreate
from app.api.request.schemas.response import StatusResponse


async def post_requests(request: RequestCreate, db: AsyncSession) -> StatusResponse:
    new_request = Request(
    mp3=request.mp3,
    text=request.text,
    user_id=request.user_id,
    title=request.title,
    )
    db.add(new_request)
    await db.commit()
    await db.refresh(new_request)

    return StatusResponse(status="success", message="Запрос успешно создан")