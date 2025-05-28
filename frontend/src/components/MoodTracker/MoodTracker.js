import React, { useState, useRef, useEffect } from 'react';
import './MoodTracker.css';

const MoodTracker = () => {
    const [emotion, setEmotion] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const [isCameraOn, setIsCameraOn] = useState(false);
    const [moodHistory, setMoodHistory] = useState([]);
    const intervalRef = useRef(null);

    const startCamera = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
                await videoRef.current.play();
                setIsCameraOn(true);
            }
        } catch (err) {
            setError('Failed to access camera');
            console.error(err);
        }
    };

    const stopCamera = () => {
        if (videoRef.current && videoRef.current.srcObject) {
            const tracks = videoRef.current.srcObject.getTracks();
            tracks.forEach(track => track.stop());
            videoRef.current.srcObject = null;
        }
        setIsCameraOn(false);
    };

    const captureAndDetect = async () => {
        if (!videoRef.current || !canvasRef.current) return;
        const video = videoRef.current;
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');
        const width = video.videoWidth || 640;
        const height = video.videoHeight || 480;
        canvas.width = width;
        canvas.height = height;
        context.drawImage(video, 0, 0, width, height);
        canvas.toBlob(async (blob) => {
            if (!blob) return;
            const formData = new FormData();
            formData.append('image', blob, 'capture.jpg');
            try {
                setLoading(true);
                setError(null);
                const response = await fetch('http://127.0.0.1:5000/predict_emotion', {
                    method: 'POST',
                    body: formData,
                });
                const data = await response.json();
                if (response.ok) {
                    setEmotion(data.detected_emotion);
                    setMoodHistory(prev => {
                        if (prev.length === 0 || prev[prev.length - 1].emotion !== data.detected_emotion) {
                            return [...prev, {
                                emotion: data.detected_emotion,
                                timestamp: new Date().toLocaleString()
                            }];
                        }
                        return prev;
                    });
                } else {
                    setError(data.error || 'Failed to detect emotion');
                }
            } catch (err) {
                setError('Failed to connect to emotion detection service');
            } finally {
                setLoading(false);
            }
        }, 'image/jpeg');
    };

    useEffect(() => {
        if (isCameraOn) {
            intervalRef.current = setInterval(captureAndDetect, 2000); // every 2 seconds
        } else {
            clearInterval(intervalRef.current);
        }
        return () => clearInterval(intervalRef.current);
    }, [isCameraOn]);

    useEffect(() => {
        return () => {
            stopCamera();
        };
    }, []);

    return (
        <div className="mood-tracker-container">
            <div className="mood-tracker">
                <h1>Mood Tracker</h1>
                <p className="description">
                    Capture your current mood using your camera. The AI will detect your emotion!
                </p>
                {/* Show detected mood as plain text at the top */}
                {emotion && (
                    <p className="current-mood-text"><strong>Current Mood:</strong> {emotion}</p>
                )}
                <div className="main-content">
                    <div className="camera-section">
                        <div className="camera-container">
                            <video
                                ref={videoRef}
                                autoPlay
                                playsInline
                                className="camera-preview"
                                style={{ display: isCameraOn ? 'block' : 'none' }}
                            />
                            {!isCameraOn && (
                                <div className="camera-placeholder">
                                    Click "Start Camera" to begin
                                </div>
                            )}
                            <canvas ref={canvasRef} style={{ display: 'none' }} />
                        </div>
                        <div className="controls">
                            {!isCameraOn ? (
                                <button onClick={startCamera} className="control-button start">
                                    Start Camera
                                </button>
                            ) : (
                                <button onClick={stopCamera} className="control-button stop">
                                    Stop Camera
                                </button>
                            )}
                        </div>
                        {loading && (
                            <div className="status">
                                <div className="loading-spinner"></div>
                                <p>Detecting your mood...</p>
                            </div>
                        )}
                        {error && (
                            <div className="error">
                                <p>{error}</p>
                            </div>
                        )}
                    </div>
                    {moodHistory.length > 0 && (
                        <div className="mood-history">
                            <h2>Mood History</h2>
                            <div className="history-list">
                                {moodHistory.map((entry, index) => (
                                    <div key={index} className="history-item">
                                        <span className="history-emotion">{entry.emotion}</span>
                                        <span className="history-time">{entry.timestamp}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MoodTracker;