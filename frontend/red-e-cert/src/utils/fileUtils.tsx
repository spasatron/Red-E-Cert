import { pdfjs } from "react-pdf";
// This was a little hard to figure out how to do exactly. Need to move this to be local, but for development this is ok
pdfjs.GlobalWorkerOptions.workerSrc =
  "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";

function arrayBufferToBase64(arrayBuffer: ArrayBuffer): string {
  const bytes = new Uint8Array(arrayBuffer);
  var binary = "";
  for (var i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return "data:image/png;base64," + btoa(binary);
}

export const getFilePreview = async (
  fileData: ArrayBuffer,
  fileType: string,
  onFailureCallback?: (error: Error) => void
) => {
  if (fileType.startsWith("image/")) {
    return arrayBufferToBase64(fileData);
  } else if (fileType === "application/pdf") {
    try {
      const pdf = await pdfjs.getDocument(fileData).promise;

      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d");

      const page = await pdf.getPage(1);
      var scale = 1.5;
      var viewport = page.getViewport({ scale });

      // Prepare canvas using PDF page dimensions
      if (canvas && context) {
        canvas.height = viewport.height;
        canvas.width = viewport.width;
        // Render PDF page into canvas context
        context.fillStyle = "white";
        context.fillRect(0, 0, canvas.width, canvas.height);

        await page.render({ canvasContext: context, viewport: viewport })
          .promise;
      }
      console.log(canvas.toDataURL("image/png"));
      return canvas.toDataURL("image/png");
    } catch (error) {
      onFailureCallback?.(error as Error);
      return undefined;
    }
  }
  onFailureCallback?.(Error("Type Not Supported"));
  return undefined;
};
