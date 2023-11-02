""" Fast Api Server"""

import os
import datetime
import asyncio
import requests
from fastapi import FastAPI, BackgroundTasks, Depends
from fastapi.middleware.cors import CORSMiddleware

import dropbox
from dropbox.files import CommitInfo, WriteMode

from app.session_manager.session_manager import SessionManager
from app.session_manager.token_manager import create_access_token, verify_token

app = FastAPI()
session = SessionManager()

app.add_middleware(
    CORSMiddleware,
    # Replace '*' with the specific origins you want to allow
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
async def startup():
    asyncio.create_task(session.clean_expired_sessions())


# Get Methods
@app.get("/")
def get_root():
    return {"Root": "Response"}


@app.get("/last-refresh")
async def get_last_refresh():
    return {
        "Last Update": session.last_update,
        "Time Elapsed": datetime.datetime.now() - session.last_update,
    }


@app.get("/session-list")
async def list_sessions():
    return session.list_active_sessions()


@app.get("/verify-session")
async def verify_session(session_id: str = Depends(verify_token)):
    if session_id:
        return "Token Valid"
    return "Invalid Token"


# Post Methods
@app.post("/create-dropbox-session/{authCode}")
async def process_auth_code(session_id: str = Depends(session.create_session)):
    session_data = {"session_id": session_id}
    return create_access_token(session_data)
