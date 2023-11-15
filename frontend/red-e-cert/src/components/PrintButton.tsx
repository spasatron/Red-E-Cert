import Cookies from "js-cookie";

async function uploadToDropbox(data: string) {
  // Convert base64 data to a Blob
  console.log(data);
  const base64ToBlob = (base64Data: string) => {
    const byteCharacters = atob(base64Data);
    console.log(byteCharacters);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    return new Blob([byteArray], { type: "application/pdf" });
  };

  const fileBlob = base64ToBlob(data);
  const dropbox_link_respose = await fetch(
    `http://localhost:8000/dropbox-upload-main-link`,
    {
      method: "GET",
      credentials: "include",
      headers: {
        Authorization: "Bearer " + Cookies.get("authToken"), // Include the token as a Beare
        "Content-Type": "text/x-typescript",
      },
    }
  );
  const dropbox_link = await dropbox_link_respose.json();
  console.log(dropbox_link);

  const dropbox_upload_response = await fetch(dropbox_link, {
    method: "POST",
    headers: {
      "Content-Type": "application/octet-stream",
    },
    body: fileBlob,
  });

  const dropbox_upload = await dropbox_upload_response.json();
  console.log(dropbox_upload);
}

function PrintButton() {
  const printScreen = async () => {
    // Find the element with the specified class name
    const toPrintElement = document.querySelector(".homepage-print");
    console.log(toPrintElement);
    if (toPrintElement) {
      // Extract the HTML content from the element
      const extractedHtml = toPrintElement.outerHTML;

      const blob = new Blob([extractedHtml], { type: "text/html" });
      const file = new File([blob], "document.html", { type: "text/html" });

      const formData = new FormData();
      formData.append("html_file", file);
      console.log("Getting Repsonse");
      console.log(file);
      const response_pdf = await fetch(`http://localhost:8000/generate-pdf`, {
        method: "POST",
        credentials: "include",
        body: formData,
      });
      const response_data = await response_pdf.json();
      console.log(response_data);

      await uploadToDropbox(response_data);
    }
  };
  return (
    <button
      type="submit"
      className="print-button hide-print"
      onClick={printScreen}
    >
      Upload To Dropbox
    </button>
  );
}

export default PrintButton;
