from sqlmodel import create_engine
import os

# Use mounted volume in production, local file in development
is_production = os.environ.get("FLY_APP_NAME") is not None
db_path = "/data/database.db" if is_production else "./database.db"
sqlite_url = f"sqlite:///{db_path}"

connect_args = {"check_same_thread": False}
engine = create_engine(sqlite_url, connect_args=connect_args)
