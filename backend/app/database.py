from sqlmodel import create_engine

sqlite_url = f"sqlite:///./database.db"

connect_args = {"check_same_thread" : False}
engine = create_engine(sqlite_url, connect_args=connect_args)