""" Entry Point for server """
import uvicorn

# pylint: disable-next=unused-import
from app.server import app


if __name__ == "__main__":
    # TODO change reload to true in production
    uvicorn.run("app.server:app", host="0.0.0.0", port=8000, reload=True)
