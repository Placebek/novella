from fastapi import APIRouter

from app.api.novella.router import router as novella_router

route = APIRouter()

route.include_router(novella_router, prefix="/novellas")