from typing import List, Annotated, Optional
from app.models import Message, MessageBase, User, UserBase, UserCreate, UserLogin
from app.database import engine
from sqlmodel import SQLModel, Session, select
from fastapi import FastAPI, HTTPException, Depends, status, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer
from datetime import datetime, timedelta
import jwt
from jwt.exceptions import InvalidTokenError

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


SECRET_KEY = "chdicncciwcwcuuieowjncd"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/signin", auto_error=False)


async def get_current_user(
    token: str = Depends(oauth2_scheme), db: Session = Depends(get_session)
) -> User:
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )

    if not token:
        raise credentials_exception

    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise credentials_exception
    except InvalidTokenError:
        raise credentials_exception

    user = db.exec(select(User).where(User.email == email)).first()
    if user is None:
        raise credentials_exception
    return user


def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt


@app.post("/api/auth/signup")
async def signup(user: UserCreate, db: Session = Depends(get_session)):
    try:
        existing_user = db.exec(select(User).where(User.email == user.email)).first()
        if existing_user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email already registered",
            )

        password_hash, salt = User.hash_password(user.password)
        db_user = User(
            email=user.email, name=user.name, password_hash=password_hash, salt=salt
        )
        db.add(db_user)
        db.commit()
        db.refresh(db_user)

        access_token = create_access_token(
            data={"sub": user.email},
            expires_delta=timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES),
        )

        return {"token": access_token, "token_type": "bearer"}
    except Exception as e:
        print(f"Signup error: {str(e)}")
        raise


@app.post("/api/auth/signin")
async def signin(user: UserLogin, db: Session = Depends(get_session)):
    try:
        db_user = db.exec(select(User).where(User.email == user.email)).first()
        if not db_user or not db_user.verify_password(user.password):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Incorrect email or password",
                headers={"WWW-Authenticate": "Bearer"},
            )

        access_token = create_access_token(
            data={"sub": user.email},
            expires_delta=timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES),
        )

        return {"token": access_token, "token_type": "bearer"}
    except Exception as e:
        print(f"Signin error: {str(e)}")
        raise


@app.get("/api/messages")
async def get_messages(
    current_user: User = Depends(get_current_user), db: Session = Depends(get_session)
):
    messages = db.exec(select(Message).where(Message.user_id == current_user.id)).all()
    for msg in messages:
        print(
            f"Message ID: {msg.id}, Content: {msg.content}, Deleted: {msg.deleted_at is not None}"
        )
        print(f"Full message dict: {msg.to_dict()}")
    return [msg.to_dict() for msg in messages]


def get_bot_response(message: str) -> str:
    return f"This is bot reply, you texted: {message}"


@app.post("/api/messages")
async def create_message(
    message: MessageBase,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_session),
):
    db_message = Message(
        content=message.content,
        user_id=current_user.id,
        sender="user",
        deleted_at=None,
        updated_at=None,
    )
    db.add(db_message)
    db.commit()
    db.refresh(db_message)

    bot_response = get_bot_response(message.content)
    bot_message = Message(
        content=bot_response,
        user_id=current_user.id,
        sender="bot",
        deleted_at=None,
        updated_at=None,
    )
    db.add(bot_message)
    db.commit()
    db.refresh(bot_message)

    return [db_message, bot_message]


@app.delete("/api/messages/{message_id}")
async def delete_message(
    message_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_session),
):
    message = db.exec(select(Message).where(Message.id == message_id)).first()
    if not message:
        raise HTTPException(status_code=404, detail="Message not found")
    if message.user_id != current_user.id:
        raise HTTPException(
            status_code=403, detail="Not authorized to delete this message"
        )

    message.deleted_at = datetime.now()
    db.commit()
    db.refresh(message)
    return message


@app.put("/api/messages/{message_id}")
async def update_message(
    message_id: int,
    message: MessageBase,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_session),
):
    db_message = db.exec(select(Message).where(Message.id == message_id)).first()
    if not db_message:
        raise HTTPException(status_code=404, detail="Message not found")
    if db_message.user_id != current_user.id:
        raise HTTPException(
            status_code=403, detail="Not authorized to update this message"
        )

    db_message.content = message.content
    db_message.updated_at = datetime.now()
    db.commit()
    db.refresh(db_message)
    return db_message
