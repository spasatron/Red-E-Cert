""" Entry Point for server """
import os

import uvicorn


# pylint: disable-next=unused-import
from app.server import app


if __name__ == "__main__":
    RELOAD = True if os.environ.get("DEVELOPMENT") else False

    uvicorn.run(
        "app.server:app", host="0.0.0.0", port=8000, reload=RELOAD, root_path="/api"
    )
