""" Manages everything that has to do with the sessions. Creation and Deletion"""
import os
import datetime
import asyncio
import secrets
import requests

from fastapi import Depends, HTTPException
import dropbox
from dropbox import Dropbox


APP_KEY = "b8iisj0jc2bo1pe"
APP_SECRET = os.environ.get("DropBoxSecret")


class SessionManager:
    def __init__(self, session_timeout=datetime.timedelta(minutes=30)):
        self.sessions = {}
        self.SESSION_TIMEOUT = session_timeout
        self.last_update = datetime.datetime.now()

    async def clean_expired_sessions(self):
        while True:
            await asyncio.sleep(60)  # Check for expired sessions every minute
            now = datetime.datetime.now()
            self.last_update = now
            print("Checking to see if sessions have expired")
            for session_id, session_data in list(self.sessions.items()):
                expires_at = session_data.get("timeout")
                if expires_at < now:
                    del self.sessions[session_id]
                    print(f"Session {session_id} has expired and is removed.")

    def list_active_sessions(self):
        return {"active_sessions": list(self.sessions.keys())}

    # Generate a unique session ID
    def generate_unique_session_id(self):
        while True:
            session_id = secrets.token_urlsafe(16)
            if session_id not in self.sessions:
                return session_id

    async def create_session(self, authCode: str):
        dropbox_endpoint = "https://api.dropboxapi.com/oauth2/token"
        params = {
            "code": authCode,
            "grant_type": "authorization_code",
            "client_id": APP_KEY,
            "redirect_uri": "http://localhost:5173/authenticate",
            "client_secret": APP_SECRET,
        }

        response = requests.post(dropbox_endpoint, data=params)

        if response.status_code == 200:
            # add info to current sessions
            data = response.json()
            access_token = data.get("access_token")

            dbx = Dropbox(access_token, app_key=APP_KEY, app_secret=APP_SECRET)
            timeout = datetime.datetime.now() + self.SESSION_TIMEOUT
            session_id = self.generate_unique_session_id()

            self.sessions[session_id] = {"timeout": timeout, "dbx": dbx}
            return session_id

        else:
            raise HTTPException(response.status_code, response.text)

    async def get_session(self, session_id: str = Depends()):
        if session_id in self.sessions.keys():
            return self.sessions[session_id]
        else:
            raise HTTPException(404, "Session Not Found")

    async def get_root_link(self, session_id: str):
        session = await self.get_session(session_id=session_id)
        if session.get("root-link"):
            return session.get("root-link")
        # Otherwise get current time for root
        session["root-link"] = datetime.datetime.now().strftime("%Y%m%d_%H%M%S")
        return session["root-link"]

    async def get_file_upload_link(self, session_id: str):
        root_link = await self.get_root_link(session_id)
        session = await self.get_session(session_id)

        dbx = session["dbx"]

        commit_info = dropbox.files.CommitInfo(
            path="/" + root_link + "/test.png", mode=dropbox.files.WriteMode.overwrite
        )

        return dbx.files_get_temporary_upload_link(commit_info).link
