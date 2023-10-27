interface DropBoxQRProps {
  authToken?: string;
}

const DropBoxQR: React.FC<DropBoxQRProps> = () => {
  return (
    <div>
      <img
        width="125"
        height="125"
        src="./src/assets/example_qr.png"
        alt="QR example"
      />
    </div>
  );
};

export default DropBoxQR;
