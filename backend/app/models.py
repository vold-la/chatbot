from typing import Optional
from uuid import UUID
from sqlmodel import Field, Session, SQLModel
from datetime import datetime

class MessageBase(SQLModel):
    content: str
    
class Message(MessageBase, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    sender: str 
    timestamp: datetime = Field(default_factory=datetime.now)
    