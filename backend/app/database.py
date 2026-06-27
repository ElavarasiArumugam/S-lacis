import os
from dotenv import load_dotenv
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

# This physically loads the variables from your .env file
load_dotenv()

# Now it will grab your real password instead of a fallback!
SQLALCHEMY_DATABASE_URL = os.getenv("DATABASE_URL")

engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    pool_pre_ping=True
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

# Dependency to inject database sessions into our routes
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()