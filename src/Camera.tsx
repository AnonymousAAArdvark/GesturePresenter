import React, { useState, useEffect, useRef } from 'react';
import { Hands, HAND_CONNECTIONS, Results, VERSION } from '@mediapipe/hands';
import { drawConnectors, drawLandmarks } from '@mediapipe/drawing_utils';
import { getGesture } from './utils/GestureDetection'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowsRotate, faGear } from '@fortawesome/free-solid-svg-icons';
import './App.css';


interface CameraProps {
  flipped: boolean;
}

const Camera: React.FC<CameraProps> = ({ flipped }) => {
  const [isUserFacing, setIsUserFacing] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const handsRef = useRef<Hands | null>(null);
  const [gestureResult, setGestureResult] = useState(0);

  useEffect(() => {
    const getUserMedia = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: isUserFacing ? "user" : "environment",
            width: { ideal: 2532 },
            height: { ideal: 1170 }
          }
        });
        const video = videoRef.current;
        if (video) {
          video.srcObject = stream;
          video.onloadedmetadata = () => {
            video.play().then(() => {
              if (canvasRef.current) {
                canvasRef.current.width = video.videoWidth;
                canvasRef.current.height = video.videoHeight;
                initializeMediaPipe();
              }
            });
          };
        }
      } catch (err) {
        console.error("Error accessing media devices:", err);
      }
    };

    const handleResize = () => {
      setTimeout(() => {
        const video = videoRef.current;
        if (video && canvasRef.current) {
          canvasRef.current.width = video.videoWidth;
          canvasRef.current.height = video.videoHeight;
        }
      }, 1000); // might not be very reliable
    };

    getUserMedia();
    window.addEventListener('resize', handleResize);

    return () => {
      window.addEventListener('resize', handleResize);

      const stream = videoRef.current?.srcObject as MediaStream;
      stream?.getTracks().forEach(track => track.stop());
      if (handsRef.current) {
        handsRef.current.close();
        handsRef.current = null;
      }
    };
  }, [isUserFacing]);

  const initializeMediaPipe = () => {
    if (handsRef.current) {
      handsRef.current.close();
    }
    const hands = new Hands({
      locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands@${VERSION}/${file}`,
    });

    hands.setOptions({
      modelComplexity: 1,
      minDetectionConfidence: 0.25,
      minTrackingConfidence: 0.25,
    });

    hands.onResults(onResults);
    handsRef.current = hands;
    sendToMediaPipe();
  };

  const sendToMediaPipe = async () => {
    if (videoRef.current && handsRef.current) {
      await handsRef.current.send({ image: videoRef.current });
    }
  };

  const onResults = (results: Results) => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    const video = videoRef.current;
    if (!canvas || !ctx || !video) return;

    const videoWidth = video.videoWidth;
    const videoHeight = video.videoHeight;

    ctx.save();
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (isUserFacing) {
      ctx.translate(canvas.width, 0);
      ctx.scale(-1, 1);
    }
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    let vote = 0;
    results.multiHandLandmarks?.forEach(landmarks => {
      let scaledLandmarks = landmarks.map(landmark => ({
        x: landmark.x * videoWidth,
        y: landmark.y * videoHeight,
        z: landmark.z // Z-coordinate remains the same
      }));

      let gestureResult = getGesture(scaledLandmarks);

      if ((flipped || isUserFacing) && flipped !== isUserFacing) {
        gestureResult = gestureResult === "Left" ? "Right" : gestureResult === "Right" ? "Left" : gestureResult;
      }

      vote += (gestureResult === "Right") ? 1 : (gestureResult === "Left") ? -1 : 0;


      const handStyles: { [key: string]: { connectorStyle: any, landmarkStyle: any } } = {
        'Right': {
          connectorStyle: { color: '#00FF00', lineWidth: 5 },
          landmarkStyle: { color: '#00FF00', lineWidth: 5 }
        },
        'Left': {
          connectorStyle: { color: '#FF0000', lineWidth: 5 },
          landmarkStyle: { color: '#FF0000', lineWidth: 5 }
        },
        'None': {
          connectorStyle: { color: '#00BFFF', lineWidth: 2 },
          landmarkStyle: { color: '#00BFFF', lineWidth: 2 }
        }
      };

      const currentStyle = handStyles[gestureResult] || handStyles['None'];

      drawConnectors(ctx, landmarks, HAND_CONNECTIONS, currentStyle.connectorStyle);
      drawLandmarks(ctx, landmarks, currentStyle.landmarkStyle);

    });
    setGestureResult(vote)

    ctx.restore();
    requestAnimationFrame(sendToMediaPipe);
  };

  const flipCamera = () => {
    setIsUserFacing(!isUserFacing);
  }

  return (
    <div className="camera-container">
      <canvas ref={canvasRef} className="canvas-overlay" />
      <video ref={videoRef} className={`camera-feed ${isUserFacing ? 'user-facing' : ''}`} autoPlay playsInline />
      <button onClick={flipCamera} className="camera-button show-settings">
        <FontAwesomeIcon icon={faGear} />
      </button>
      <button onClick={flipCamera} className="camera-button switch-camera">
        <FontAwesomeIcon icon={faArrowsRotate} />
      </button>
    </div>
  );
};

export default Camera;