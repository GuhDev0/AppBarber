from sqlalchemy import create_engine
from dotenv import load_dotenv
import os

load_dotenv()
DATABASE_URL = os.getenv("URL_DB")

engine = create_engine(DATABASE_URL,
                        pool_pre_ping=True)

def get_engine():
    return engine
