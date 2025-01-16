from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from models.models import User

async def select_username_in_db(username: str, db: AsyncSession) -> User | None:
    result = await db.execute(
        select(User)
        .filter(User.username == username)
    )
    user = result.scalar_one_or_none()
    return user
