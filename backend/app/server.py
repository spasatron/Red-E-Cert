""" Fast Api Server"""

import os
import datetime
import asyncio
import requests
import qrcode
import io
import base64

from fastapi import FastAPI, BackgroundTasks, Depends, HTTPException
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
        return True
    return False


@app.get("/get-qr-src")
async def get_qr_src(session_id: str = Depends(verify_token)):
    if session_id is None:
        raise HTTPException(405, "Unauthorized")

    root_link = await session.get_root_link(session_id)
    # Create a QR code
    data = f"https://www.dropbox.com/home/Apps/red-e-cert/{root_link}/main.pdf"  # Replace with your link
    qr = qrcode.QRCode(
        version=1,
        error_correction=qrcode.constants.ERROR_CORRECT_L,
        box_size=5,
        border=2,
    )
    qr.add_data(data)
    qr.make(fit=True)

    # Get the QR code image as a byte object
    img = qr.make_image(fill_color="black", back_color="white")
    in_memory_stream = io.BytesIO()
    img.save(in_memory_stream)
    # Seek to the beginning of the stream (if needed)
    in_memory_stream.seek(0)
    # Read data from the in-memory stream
    data = in_memory_stream.read()
    # Convert the byte object to Base64
    base64_image = base64.b64encode(data).decode()

    return "data:image/png; base64," + base64_image


@app.get("/dropbox-upload-link")
async def get_dropbox_upload_link(session_id: str = Depends(verify_token)):
    if session_id is None:
        raise HTTPException(405, "Unauthorized")
    return await session.get_file_upload_link(session_id)


# Post Methods
@app.post("/create-dropbox-session/{authCode}")
async def process_auth_code(session_id: str = Depends(session.create_session)):
    session_data = {"session_id": session_id}
    return create_access_token(session_data)
