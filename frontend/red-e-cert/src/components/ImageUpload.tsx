import "../styles/print-styles.css";
import { uploadToDropbox, getDropboxUploadURI } from "../utils/dropboxUploader";
import { ChangeEvent } from "react";
import { getFilePreview } from "../utils/fileUtils";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const readArrayBufferFromFile = (file: File): Promise<ArrayBuffer> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const arrayBuffer = event.target?.result as ArrayBuffer;
      if (arrayBuffer) {
        resolve(arrayBuffer);
      } else {
        reject(new Error("Failed to read ArrayBuffer"));
      }
    };
    reader.readAsArrayBuffer(file);
  });
};

const handleFileSelect = async (
  setImageData: (dataURL: string | null) => void,
  event: ChangeEvent<HTMLInputElement>
) => {
  const selectedFile = event.target.files?.[0];

  if (selectedFile) {
    const arrayBuffer = await readArrayBufferFromFile(selectedFile);

    const dropbox_uri = await getDropboxUploadURI(
      selectedFile,
      (error: Error) => console.log(error.message)
    );

    if (dropbox_uri) {
      const blob = new Blob([arrayBuffer], { type: selectedFile.type });
      await toast.promise(
        uploadToDropbox(dropbox_uri, blob, undefined, (error: Error) =>
          console.log(error.message)
        ),
        {
          pending: "Uploading File to Dropbox",
          success: "Upload to Dropbox Successful",
          error: "Upload Failed",
        }
      );
    }
    const imageData = await getFilePreview(
      arrayBuffer,
      selectedFile.type,
      (error: Error) => {
        console.log(error.message);
      }
    );
    if (imageData) {
      setImageData(imageData);
    }
  }
};

interface ImageUploadComponentProps {
  setImageData: (dataURL: string | null) => void;
}

const ImageUploadComponent: React.FC<ImageUploadComponentProps> = ({
  setImageData,
}) => {
  return (
    <div className="hide-print center">
      <input
        type="file"
        accept="image/*, application/pdf"
        onInput={(event: ChangeEvent<HTMLInputElement>) =>
          handleFileSelect(setImageData, event)
        }
      />
    </div>
  );
};

export default ImageUploadComponent;
