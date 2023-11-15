import os
from typing import Callable
from typing_extensions import Awaitable


async def generate_unique_filename(
    filename: str, is_filename_taken_func: Callable[[str], Awaitable[bool]]
) -> str:
    """Returns a unique filename based on weather the file already exists in the system or not"""
    counter = 1
    new_filename = filename.lower()
    if new_filename == "main.pdf":
        base, ext = os.path.splitext(filename)
        new_filename = f"{base}_{counter}{ext}"

    while await is_filename_taken_func(new_filename):
        base, ext = os.path.splitext(new_filename)
        counter += 1
        new_filename = f"{base}_{counter}{ext}"

    return new_filename
