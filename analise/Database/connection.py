from sqlalchemy import create_engine

DATABASE_URL = (
    "postgresql://postgres.yyzxdrwzzdqroseiqkpo:"
    "cHbmqdBA3ave5M7Q@aws-0-us-west-2.pooler.supabase.com:5432/postgres"
)

engine = create_engine(DATABASE_URL)

def get_engine():
    return engine
