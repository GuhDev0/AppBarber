from sqlalchemy import create_engine
from dotenv import load_dotenv
import os

load_dotenv()
DATABASE_URL = os.getenv("URL_DB")

engine = create_engine(DATABASE_URL)

def get_engine():
    return engine
