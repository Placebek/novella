from fastapi import APIRouter
from app.api.request.request import router as request_router


route = APIRouter()

route.include_router(request_router, prefix="", tags=["Request"])