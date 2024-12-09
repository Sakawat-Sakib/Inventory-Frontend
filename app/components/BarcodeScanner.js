'use client'

import { useState, useEffect, useRef } from "react";
import Quagga from '@ericblade/quagga2';
import axios from "axios";

export default function BarcodeScanner({ onProductScanned }) {
  const [isScanning, setIsScanning] = useState(false);
  const [manualBarcode, setManualBarcode] = useState("");
  const [error, setError] = useState("");
  const scannerRef = useRef(null);

  const startScanner = async () => {
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Browser does not support camera access');
      }

      await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      });

      await Quagga.init({
        inputStream: {
          name: "Live",
          type: "LiveStream",
          target: scannerRef.current,
          constraints: {
            facingMode: "environment",
            width: { min: 450 },
            height: { min: 300 },
          },
        },
        frequency: 5,
        decoder: {
          readers: [
            "ean_reader",
            "ean_8_reader",
            "upc_reader",
            "upc_e_reader"
          ],
          debug: {
            drawBoundingBox: true,
            showPattern: true,
          },
        },
        locate: true,
        locator: {
          halfSample: true,
          patchSize: "medium",
        }
      });

      // Only log successful scans, not every frame
      Quagga.onProcessed(function(result) {
        if (result && result.boxes) {
          // Barcode pattern found, but not decoded yet
          const drawingCtx = Quagga.canvas.ctx.overlay;
          const drawingCanvas = Quagga.canvas.dom.overlay;

          drawingCtx.clearRect(
            0, 0, 
            parseInt(drawingCanvas.getAttribute("width")), 
            parseInt(drawingCanvas.getAttribute("height"))
          );

          if (result.boxes) {
            result.boxes.filter(function(box) {
              return box !== result.box;
            }).forEach(function(box) {
              Quagga.ImageDebug.drawPath(box, { x: 0, y: 1 }, drawingCtx, { 
                color: "yellow", 
                lineWidth: 2 
              });
            });
          }

          if (result.box) {
            Quagga.ImageDebug.drawPath(result.box, { x: 0, y: 1 }, drawingCtx, { 
              color: "green", 
              lineWidth: 2 
            });
          }
        }
      });

      Quagga.onDetected((result) => {
        const code = result.codeResult.code;
        console.log("Barcode successfully detected:", code);
        handleScan(code);
      });

      await Quagga.start();
      setIsScanning(true);
      setError("");
    } catch (err) {
      console.error("Scanner error:", err);
      setError(err.message || "Failed to start scanner");
      setIsScanning(false);
    }
  };

  const stopScanner = async () => {
    if (isScanning) {
      await Quagga.stop();
      setIsScanning(false);
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (isScanning) {
        Quagga.stop();
      }
    };
  }, [isScanning]);

  async function handleScan(barcode) {
    await stopScanner();
    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/products/scan`, { barcode });
      onProductScanned(response.data);
    } catch (error) {
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
      setError(error.response?.data?.message || 'Failed to add product');
    }
  }

  return (
    <div className="w-full max-w-3xl mx-auto p-4">
      <div className="flex flex-col sm:flex-row gap-4 mb-4">
        <button
          type="button"
          className="button-primary w-full sm:w-auto"
          onClick={async () => {
            if (isScanning) {
              await stopScanner();
            } else {
              await startScanner();
            }
          }}
        >
          {isScanning ? 'Stop Scanner' : 'Start Scanner'}
        </button>
        
        <form onSubmit={handleManualSubmit} className="flex flex-1 gap-2">
          <input
            type="text"
            value={manualBarcode}
            onChange={(e) => setManualBarcode(e.target.value)}
            placeholder="Enter barcode manually"
            className="flex-1 border border-primary px-2 rounded min-w-0"
          />
          <button type="submit" className="button-secondary whitespace-nowrap">
            Add Product
          </button>
        </form>
      </div>

      <div className="relative flex justify-center">
        <div 
          ref={scannerRef}
          className={`
            w-full 
            max-w-md 
            aspect-video 
            rounded-lg 
            overflow-hidden 
            bg-black 
            ${!isScanning && 'hidden'}
          `}
        >
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 
                          w-48 h-48 sm:w-64 sm:h-64 
                          border-2 border-red-500 opacity-50 
                          rounded-lg" />
          </div>
        </div>

        {isScanning && (
          <div className="absolute bottom-0 left-0 right-0 
                        text-sm text-gray-500 text-center 
                        bg-white bg-opacity-75 py-2 rounded-b-lg">
            Position the barcode in the center of the frame
          </div>
        )}
      </div>

      {error && (
        <div className="text-red-500 mt-4 text-center">
          {error}
        </div>
      )}
    </div>
  );
} 