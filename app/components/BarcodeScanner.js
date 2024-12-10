import { useZxing } from "react-zxing";
import { useState, useEffect } from "react";
import axios from "axios";

export default function BarcodeScanner({ onProductScanned }) {
  const [isScanning, setIsScanning] = useState(false);
  const [manualBarcode, setManualBarcode] = useState("");
  const [error, setError] = useState("");
  const [hasCamera, setHasCamera] = useState(false);

  // Check if camera is available
  useEffect(() => {
    async function checkCamera() {
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const videoDevices = devices.filter(device => device.kind === 'videoinput');
        setHasCamera(videoDevices.length > 0);
        console.log('Available cameras:', videoDevices);
      } catch (err) {
        console.error('Error checking camera:', err);
        setError('Unable to access camera');
      }
    }
    checkCamera();
  }, []);

  const { ref } = useZxing({
    onDecodeResult: handleScan,
    paused: !isScanning,
    constraints: {
      video: {
        facingMode: "environment",
        width: { min: 640, ideal: 1280, max: 1920 },
        height: { min: 480, ideal: 720, max: 1080 }
      }
    },
    onError: (error) => {
      console.error("Scanner Error:", error);
      setError(`Scanner error: ${error.message}`);
    },
    onPlay: () => {
      console.log("Camera started successfully");
      setError("");
    }
  });

  async function handleScan(result) {
    console.log("Barcode detected:", result.getText());
    setIsScanning(false);
    const barcode = result.getText();
    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/products/scan`, { barcode });
      console.log("Response:", response.data);
      onProductScanned(response.data);
    } catch (error) {
      console.error("API Error:", error);
      setError(error.response?.data?.message || 'Failed to scan product');
    }
  }

  async function handleManualSubmit(e) {
    e.preventDefault();
    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/products/scan`, { 
        barcode: manualBarcode 
      });
      onProductScanned(response.data);
      setManualBarcode("");
    } catch (error) {
      console.error("Manual Entry Error:", error);
      setError(error.response?.data?.message || 'Failed to add product');
    }
  }

  async function startScanning() {
    try {
      setError("");
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: "environment" } 
      });
      console.log("Camera access granted:", stream);
      setIsScanning(true);
    } catch (err) {
      console.error("Error accessing camera:", err);
      setError(`Camera access error: ${err.message}`);
    }
  }

  return (
    <div className="p-4">
      <div className="flex gap-4 mb-4">
        {hasCamera ? (
          <button
            className="button-primary"
            onClick={() => {
              if (!isScanning) {
                startScanning();
              } else {
                setIsScanning(false);
              }
            }}
          >
            {isScanning ? 'Stop Scanning' : 'Start Scanner'}
          </button>
        ) : (
          <div className="text-red-500">No camera detected</div>
        )}
        
        <form onSubmit={handleManualSubmit} className="flex gap-2">
          <input
            type="text"
            value={manualBarcode}
            onChange={(e) => setManualBarcode(e.target.value)}
            placeholder="Enter barcode manually"
            className="border border-primary px-2 rounded"
          />
          <button type="submit" className="button-secondary">
            Add Product
          </button>
        </form>
      </div>

      {isScanning && (
        <div className="relative w-full max-w-md mx-auto">
          <video 
            ref={ref} 
            className="w-full rounded-lg transform scale-x-[-1]"
            autoPlay
            playsInline
            muted
          />
          <div className="text-sm text-gray-500 mt-2">
            Position the barcode in front of the camera
          </div>
        </div>
      )}

      {error && (
        <div className="text-red-500 mt-2">{error}</div>
      )}
    </div>
  );
}