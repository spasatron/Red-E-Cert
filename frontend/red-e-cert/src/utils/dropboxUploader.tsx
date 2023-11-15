import Cookies from "js-cookie";

export async function uploadToDropbox(
  uri: string,
  fileBlob: Blob,
  onCompleteCallback?: () => void,
  onFailureCallback?: (error: Error) => void
) {
  try {
    const dropbox_upload_response = await fetch(uri, {
      method: "POST",
      headers: {
        "Content-Type": "application/octet-stream",
      },
      body: fileBlob,
    });
    if (!dropbox_upload_response.ok) {
      throw new Error(`HTTP error! Status: ${dropbox_upload_response.status}`);
    }
    //const dropbox_upload = await dropbox_upload_response.json();
    if (onCompleteCallback) {
      onCompleteCallback();
    }
  } catch (error) {
    onFailureCallback?.(error as Error);
  }
}

export async function getDropboxUploadURI(
  file: File,
  onFailureCallback?: (error: Error) => void
): Promise<string | undefined> {
  try {
    const dropbox_link_respose = await fetch(
      `http://localhost:8000/dropbox-upload-link`,
      {
        method: "POST",
        credentials: "include",
        headers: {
          Authorization: "Bearer " + Cookies.get("authToken"), // Include the token as a Beare
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ filename: file.name }),
      }
    );
    if (!dropbox_link_respose.ok) {
      throw new Error(`HTTP error! Status: ${dropbox_link_respose.status}`);
    }
    const dropbox_link = await dropbox_link_respose.json();
    return dropbox_link;
  } catch (error) {
    onFailureCallback?.(error as Error);
    return undefined;
  }
}
