import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { API_URL } from '../config';

const VideoCapture = ({ sessionId, onAlphaChange }) => {
  const videoRef = useRef(null);
  const [prediction, setPrediction] = useState('');
  const [alpha, setAlpha] = useState(null);

  useEffect(() => {
    startVideo();
  }, []);

  const startVideo = () => {
    navigator.mediaDevices.getUserMedia({ video: true })
      .then(stream => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      })
      .catch(console.error);
  };

  const captureFrame = async () => {
    if (!videoRef.current) return;

    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
    canvas.toBlob(sendFrameToServer);
  };

  const sendFrameToServer = (blob) => {
    const formData = new FormData();
    formData.append('file', blob);
    formData.append('session_id', sessionId);
    formData.append('alpha', 0.0);

    axios.post(`${API_URL}/predict`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    .then(response => {
      const { prediction } = response.data;
      setPrediction(prediction);
      // Call onAlphaChange if needed here
    })
    .catch(console.error);
  };

  useEffect(() => {
    const interval = setInterval(captureFrame, 200); // Adjust as needed
    return () => clearInterval(interval);
  }, [captureFrame]);  // Add alpha to the dependency array

  return (
    <div className="video-container">
      <video ref={videoRef} className="video-capture" autoPlay playsInline muted />
      <div className="video-prediction">Prediction: {prediction}</div>
    </div>
  );
};

export default VideoCapture;
