from dataclasses import Field
from datetime import datetime
from typing import Optional
from sqlalchemy import Boolean, String, Integer, ForeignKey, Column, Text, DateTime, func
from sqlalchemy.orm import relationship
from database.db import Base

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(30))
    hash_password = Column(String)
    created_at: Optional[datetime] = Column(
        DateTime(timezone=True), onupdate=func.now(), nullable=True
    )


class Request(Base):
    __tablename__ = "requests"

    id = Column(Integer, primary_key=True, index=True)
    mp3 = Column(String(100), nullable=False)
    text = Column(Text, nullable=True)
    user_id = Column(Integer, nullable=False)
    title = Column(String(50), nullable=True)
    created_at: Optional[datetime] = Column(
        DateTime(timezone=True), onupdate=func.now(), nullable=True
    )
