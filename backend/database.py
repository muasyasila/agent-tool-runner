"""
Database setup for storing agent runs.
Uses Aiven PostgreSQL (free tier, no pausing).
"""

import os
from sqlalchemy import create_engine, Column, Integer, String, DateTime, JSON
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from datetime import datetime
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Get database URL from .env file
DATABASE_URL = os.getenv("DATABASE_URL")

if not DATABASE_URL:
    raise ValueError("DATABASE_URL not found in .env file. Please add it.")

# Create database engine
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# Define the Run model (table structure)
class Run(Base):
    __tablename__ = "runs"
    
    id = Column(Integer, primary_key=True, index=True)
    prompt = Column(String, nullable=False)
    final_response = Column(String, nullable=False)
    tool_used = Column(String, nullable=False)
    success = Column(Integer, default=1)  # 1 for true, 0 for false
    trace = Column(JSON, nullable=True)  # Store execution trace as JSON
    created_at = Column(DateTime, default=datetime.utcnow)

# Create all tables
def init_db():
    """Create database tables if they don't exist"""
    Base.metadata.create_all(bind=engine)

# Database dependency for FastAPI
def get_db():
    """Get database session - used by FastAPI endpoints"""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Functions for saving and retrieving runs
def save_run(db, prompt: str, final_response: str, tool_used: str, success: bool, trace: dict):
    """Save a completed agent run to the database"""
    db_run = Run(
        prompt=prompt,
        final_response=final_response,
        tool_used=tool_used,
        success=1 if success else 0,
        trace=trace
    )
    db.add(db_run)
    db.commit()
    db.refresh(db_run)
    return db_run

def get_recent_runs(db, limit: int = 20):
    """Get the most recent runs"""
    return db.query(Run).order_by(Run.created_at.desc()).limit(limit).all()

def get_run_by_id(db, run_id: int):
    """Get a specific run by ID"""
    return db.query(Run).filter(Run.id == run_id).first()