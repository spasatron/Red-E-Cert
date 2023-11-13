import "../styles/print-styles.css";
import { uploadToDropbox, getDropboxUploadURI } from "../utils/dropboxUploader";
import { ChangeEvent } from "react";
import { getFilePreview } from "../utils/fileUtils";

const handleFileSelect = (
  setImageData: (dataURL: string | null) => void,
  event: ChangeEvent<HTMLInputElement>
) => {
  const selectedFile = event.target.files?.[0];

  if (selectedFile) {
    const reader = new FileReader();
    reader.onload = async (event: ProgressEvent<FileReader>) => {
      const arrayBuffer = event.target?.result as ArrayBuffer;

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

      const dropbox_uri = await getDropboxUploadURI(selectedFile);
      if (dropbox_uri) {
        const blob = new Blob([arrayBuffer], { type: selectedFile.type });
        uploadToDropbox(dropbox_uri, blob);
      }
    };
    reader.readAsArrayBuffer(selectedFile);
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
