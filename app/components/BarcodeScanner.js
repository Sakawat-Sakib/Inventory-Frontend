import { useZxing } from "react-zxing";
import { useState, useEffect } from "react";
import axios from "axios";

export default function BarcodeScanner({ onProductScanned }) {
  const [isScanning, setIsScanning] = useState(false);
  const [manualBarcode, setManualBarcode] = useState("");
  const [error, setError] = useState("");
  const [hasCamera, setHasCamera] = useState(false);
  const [isFrontCamera, setIsFrontCamera] = useState(false);

  // Check if camera is available
  useEffect(() => {
    async function checkCamera() {
      try {
        // First request camera permissions
        await navigator.mediaDevices.getUserMedia({ video: true });
        const devices = await navigator.mediaDevices.enumerateDevices();
        const videoDevices = devices.filter(device => device.kind === 'videoinput');
        setHasCamera(videoDevices.length > 0);
        console.log('Available cameras:', videoDevices);
      } catch (err) {
        console.error('Error checking camera:', err);
        setError('Unable to access camera');
        setHasCamera(false);
      }
    }
    checkCamera();
  }, []);

  const { ref } = useZxing({
    onDecodeResult: handleScan,
    paused: !isScanning,
    constraints: {
      video: {
        // Simplified video constraints for better browser compatibility
        facingMode: isFrontCamera ? "user" : "environment",
        width: 640,
        height: 480
      }
    },
    onError: (error) => {
      console.error("Scanner Error:", error);
      setError(`Scanner error: ${error.message}`);
      setIsScanning(false);
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
      // Request camera access with basic constraints first
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: isFrontCamera ? "user" : "environment",
          width: 640,
          height: 480
        }
      });
      
      if (stream) {
        stream.getTracks().forEach(track => track.stop()); // Stop the test stream
        setIsScanning(true);
      }
    } catch (err) {
      console.error("Error accessing camera:", err);
      setError(`Camera access error: ${err.message}`);
      setIsScanning(false);
    }
  }

  return (
    <div className="p-4">
      <div className="flex flex-col sm:flex-row justify-between gap-4 mb-4">
        {/* Left side - Camera controls */}
        <div className="flex gap-2">
          {hasCamera ? (
            <>
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
              <button
                className="button-secondary"
                onClick={() => {
                  setIsFrontCamera(!isFrontCamera);
                  if (isScanning) {
                    setIsScanning(false);
                    setTimeout(() => startScanning(), 100);
                  }
                }}
              >
                Switch Camera
              </button>
            </>
          ) : (
            <div className="text-red-500">No camera detected</div>
          )}
        </div>

        {/* Right side - Manual input form */}
        <form onSubmit={handleManualSubmit} className="flex gap-2 w-full sm:w-auto">
          <input
            type="text"
            value={manualBarcode}
            onChange={(e) => setManualBarcode(e.target.value)}
            placeholder="Enter barcode manually"
            className="border border-primary px-2 rounded flex-1 sm:w-64"
          />
          <button type="submit" className="button-secondary whitespace-nowrap">
            Add Product
          </button>
        </form>
      </div>

      {isScanning && (
        <div className="relative w-full max-w-md mx-auto">
          <video 
            ref={ref} 
            className={`w-full rounded-lg ${isFrontCamera ? 'transform scale-x-[-1]' : ''}`}
            autoPlay
            playsInline
            muted
          />
          <div className="text-sm text-red-500 mt-2">
            <span className="font-bold">Tips : </span> Scanner performs better when the surrounding area of the barcode is white.

          </div>
        </div>
      )}

      {error && (
        <div className="text-red-500 mt-2">{error}</div>
      )}
    </div>
  );
}



