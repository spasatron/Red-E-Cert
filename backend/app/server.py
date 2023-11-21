""" Fast Api Server"""
import io
import base64

import datetime
import asyncio

import qrcode


from fastapi import FastAPI, Request, Depends, HTTPException, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware


from pyppeteer import launch

from .session_manager.session_manager import SessionManager
from .session_manager.token_manager import create_access_token, verify_token
from .tools.utils import generate_unique_filename


app = FastAPI(
    debug=True, max_request_size=1024 * 1024 * 100, root_path="/api"
)  # Set to a larger value (100MB in this example))
session = SessionManager()

app.add_middleware(
    CORSMiddleware,
    # Replace '*' with the specific origins you want to allow
    allow_origins=["http://localhost:5173"],
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


@app.get("/dropbox-upload-main-link")
async def get_dropbox_main_link(session_id: str = Depends(verify_token)):
    if session_id is None:
        raise HTTPException(405, "Unauthorized")
    link = await session.get_file_upload_link(session_id, file_name="main.pdf")
    return link


# Post Methods
@app.post("/create-dropbox-session/{authCode}")
async def process_auth_code(session_id: str = Depends(session.create_session)):
    session_data = {"session_id": session_id}
    return create_access_token(session_data)


@app.post("/dropbox-upload-link")
async def get_dropbox_upload_link(
    request: Request, session_id: str = Depends(verify_token)
):
    if session_id is None:
        raise HTTPException(405, "Unauthorized")

    request_body = await request.json()

    filename = request_body.get("filename")

    unique_filename = await generate_unique_filename(
        filename, lambda file: session.check_if_file_exists(session_id, file)
    )

    link = await session.get_file_upload_link(session_id, file_name=unique_filename)
    return link


@app.post("/generate-pdf")
async def generate_pdf(html_file: UploadFile = File(...)):
    # Ensure the uploaded file is HTML
    if not html_file.filename.endswith(".html"):
        raise HTTPException(
            status_code=400, detail="Invalid file format. Please provide an HTML file."
        )

    try:
        # Launch a headless Chromium browser (pyppeteer) for PDF generation
        browser = await launch()
        page = await browser.newPage()

        # Read and render the HTML content
        html_content = await html_file.read()
        html_content_str = html_content.decode("utf-8")
        await page.setContent(html_content_str)

        # Generate a PDF from the HTML content
        pdf = await page.pdf()
        # Close the browser
        await browser.close()

        pdf_base64 = base64.b64encode(pdf).decode()
        return pdf_base64
    except Exception as e:
        # pylint: disable-next=raise-missing-from
        raise HTTPException(status_code=500, detail=f"Error generating PDF: {str(e)}")


@app.post("/uploadfile")
async def create_upload_file(html_file: UploadFile = File(...)):
    return {"filename": html_file.filename}
