from typing import Optional, List
from uuid import UUID
from sqlmodel import Field, Session, SQLModel, Relationship
from datetime import datetime
import hashlib
import os


class UserBase(SQLModel):
    email: str = Field(unique=True, index=True)
    name: str


class UserLogin(SQLModel):
    email: str
    password: str


class UserCreate(UserBase):
    password: str


class User(UserBase, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    password_hash: str = Field(exclude=True)
    salt: str = Field(exclude=True)
    messages: List["Message"] = Relationship(back_populates="user")

    def verify_password(self, password: str) -> bool:
        hashed = hashlib.pbkdf2_hmac(
            "sha256", password.encode("utf-8"), self.salt.encode("utf-8"), 100000
        ).hex()
        return hashed == self.password_hash

    @staticmethod
    def hash_password(password: str) -> tuple[str, str]:
        salt = os.urandom(32).hex()
        hashed = hashlib.pbkdf2_hmac(
            "sha256", password.encode("utf-8"), salt.encode("utf-8"), 100000
        ).hex()
        return hashed, salt


class MessageBase(SQLModel):
    content: str
    sender: str = "user"  # Default to user, bot messages will override this


class Message(MessageBase, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: int = Field(foreign_key="user.id")
    timestamp: datetime = Field(default_factory=datetime.now)
    deleted_at: Optional[datetime] = Field(default=None)
    updated_at: Optional[datetime] = Field(default=None)
    user: Optional[User] = Relationship(back_populates="messages")

    def to_dict(self) -> dict:
        return {
            "id": self.id,
            "content": self.content,
            "sender": self.sender,
            "user_id": self.user_id,
            "timestamp": self.timestamp.isoformat(),
            "deleted_at": self.deleted_at.isoformat() if self.deleted_at else None,
            "updated_at": self.updated_at.isoformat() if self.updated_at else None,
        }
