import { ChangeEvent } from "react";
import "../styles/print-styles.css";

interface ImageUploadComponentProps {
  onImageUpload: (dataURL: string | null) => void;
}

const ImageUploadComponent: React.FC<ImageUploadComponentProps> = ({
  onImageUpload,
}) => {
  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        onImageUpload(e.target?.result as string);
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
