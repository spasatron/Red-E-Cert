import pako from "pako";
function getBytesInString(str: string): Promise<number> {
  return new Promise((resolve) => {
    // Create a Blob from the string, specifying the UTF-8 encoding
    const blob = new Blob([str], { type: "text/plain; charset=UTF-8" });

    // Create a FileReader to read the Blob
    const reader = new FileReader();

    // Define a callback to be executed when the FileReader finishes reading
    reader.onload = () => {
      // The reader.result contains the bytes
      const arrayBuffer = reader.result as ArrayBuffer;
      const bytes = new Uint8Array(arrayBuffer);
      resolve(bytes.length);
    };

    // Start reading the Blob
    reader.readAsArrayBuffer(blob);
  });
}

function PrintButton() {
  //   const printScreen = () => {
  //     const doc = new jsPDF();
  //     console.log("Printing");
  //     // Convert the HTML content into a string
  //     const html = document.querySelector(".homepage-print");
  //     console.log(html);
  //     if (html) {
  //       // Clone the HTML element to avoid modifying the actual document
  //       const htmlClone = html.cloneNode(true) as HTMLHtmlElement;

  //       // Hide elements with a specific class name (e.g., "hidden-on-pdf")
  //       const elementsToHide = htmlClone.querySelectorAll(".hide-print");
  //       elementsToHide.forEach((element) => {
  //         if (element instanceof HTMLElement) {
  //           element.style.display = "none";
  //         }
  //       });

  //       // Set text color to black for all text elements
  //       const textElements = htmlClone.querySelectorAll("td");
  //       textElements.forEach((element) => {
  //         if (element instanceof HTMLElement) {
  //           element.style.color = "black";
  //         }
  //       });

  //       const htmlDocument = htmlClone.outerHTML;

  //       // Add HTML content to the PDF
  //       doc.html(htmlDocument, {
  //         callback: function (pdf) {
  //           // Generate a base64 version of the PDF
  //           var pdfBase64 = pdf.output("datauristring");

  //           // Log the PDF data in the console
  //           console.log(pdfBase64);
  //           pdf.save("sample.pdf");
  //         },
  //       });
  //     }
  //   };

  const printScreen = async () => {
    // Find the element with the specified class name
    const toPrintElement = document.querySelector(".homepage-print");
    console.log(toPrintElement);
    if (toPrintElement) {
      // Extract the HTML content from the element
      const extractedHtml = toPrintElement.outerHTML;
      const compressed = pako.deflate(extractedHtml);
      console.log(
        "Uncompressed Size",
        getBytesInString(extractedHtml.toString())
      );
      console.log("Compressed Size:", compressed.byteLength);
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
    }
  };
  return (
    <button className="print-button hide-print" onClick={printScreen}>
      Print
    </button>
  );
}

export default PrintButton;
