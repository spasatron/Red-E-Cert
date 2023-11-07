import { ChangeEvent } from "react";
import "../styles/print-styles.css";
import Cookies from "js-cookie";
import { useUser } from "../contexts/userContext";

interface ImageUploadComponentProps {
  onImageUpload: (dataURL: string | null) => void;
}

async function uploadToDropbox(data: string) {
  // Convert base64 data to a Blob
  console.log(data);
  const base64ToBlob = (base64Data: string) => {
    const byteCharacters = atob(base64Data);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    return new Blob([byteArray], { type: "application/octet-stream" });
  };

  const fileBlob = base64ToBlob(data.split(",")[1]);
  const dropbox_link_respose = await fetch(
    `http://localhost:8000/dropbox-upload-link`,
    {
      method: "GET",
      credentials: "include",
      headers: {
        Authorization: "Bearer " + Cookies.get("authToken"), // Include the token as a Beare
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

const ImageUploadComponent: React.FC<ImageUploadComponentProps> = ({
  onImageUpload,
}) => {
  const { user } = useUser();
  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        onImageUpload(e.target?.result as string);
        if (user?.qr_src) {
          uploadToDropbox(e.target?.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="hide-print">
      <input type="file" accept="image/*" onChange={handleFileChange} />
    </div>
  );
};

export default ImageUploadComponent;
