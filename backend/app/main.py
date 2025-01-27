from typing import List, Annotated
from app.models import Message, MessageBase
from app.database import engine
from sqlmodel import SQLModel, Session, select
from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"], 
)


SQLModel.metadata.create_all(engine)

def get_session():
    with Session(engine) as session:
        yield session
        
SessionDep = Annotated[Session, Depends(get_session)]


def get_agent_response(user_message: str) -> str :
    return f"Hi there, you said: '{user_message}'"


@app.get('/messages/', response_model=List[Message])
async def read_messages(session: SessionDep):
    messages = session.exec(select(Message).order_by(Message.timestamp)).all()
    return messages

@app.post('/messages/', response_model=List[Message])
async def create_message(message: MessageBase, session: SessionDep):
    
    user_message = Message(
        content=message.content,
        sender='user',
    )
    session.add(user_message)
    session.commit()
    
    agent_message = Message(
        content=get_agent_response(message.content),
        sender='agent',
    )
    session.add(agent_message)
    session.commit()
    
    session.refresh(agent_message)
    session.refresh(user_message)
    
    return [ user_message, agent_message ]
    
@app.delete('/messages/{message_id}')
async def delete_message(message_id: int, session: SessionDep):
    message = session.get(Message, message_id)
    if not message or message.sender != 'user':
        raise HTTPException(status_code=404, detail="Message not found or cannot be deleted.")
    
    session.delete(message)
    session.commit()
    return {"detail": "Message deleted."}
        
@app.put('/messages/{message_id}')
async def update_message(message_id: int, message_update: MessageBase, session: SessionDep):
    
    message = session.get(Message, message_id)
    if not message or message.sender != 'user':
        raise HTTPException(status_code=404, detail="Message not found or cannot be deleted.")
    
    message.content = message_update.content
    session.add(message)
    session.commit()
    session.refresh(message)
    return message
