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
    const [moodStats, setMoodStats] = useState({});
    const intervalRef = useRef(null);
    const chartIntervalRef = useRef(null);

    const fetchMoodStats = async () => {
        try {
            const response = await fetch('http://127.0.0.1:5000/mood_graph_data');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            const emotionCounts = {};
            const emotions = Object.keys(data).filter(key => key !== 'timestamps');
            emotions.forEach(emotion => {
                emotionCounts[emotion] = data[emotion].reduce((sum, count) => sum + count, 0);
            });
            setMoodStats(emotionCounts);
        } catch (err) {
            console.error("Error fetching mood stats:", err);
        }
    };

    useEffect(() => {
        fetchMoodStats();
        chartIntervalRef.current = setInterval(fetchMoodStats, 10000);
        return () => {
            clearInterval(chartIntervalRef.current);
        };
    }, []);

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
                    fetchMoodStats();
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
            intervalRef.current = setInterval(captureAndDetect, 2000);
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

    const renderMoodChart = () => {
        const maxValue = Math.max(...Object.values(moodStats));
        return (
            <div className="mood-chart">
                {Object.entries(moodStats).map(([emotion, count]) => (
                    <div key={emotion} className="chart-bar-container">
                        <div className="chart-bar" style={{
                            height: `${(count / maxValue) * 100}%`,
                            backgroundColor: 'rgba(240, 99, 195, 0.6)'
                        }} />
                        <div className="chart-label">{emotion}</div>
                        <div className="chart-value">{count}</div>
                    </div>
                ))}
            </div>
        );
    };

    return (
        <div className="mood-tracker-container">
            <div className="mood-tracker">
                <h1>Mood Tracker</h1>
                <p className="description">
                    Capture your current mood using your camera. The AI will detect your emotion!
                </p>
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

                    <div className="mood-history-chart">
                        <h2>Mood Distribution (Last 24 hrs)</h2>
                        <div style={{ width: '100%', height: '300px', position: 'relative' }}>
                            {Object.keys(moodStats).length > 0 ? (
                                renderMoodChart()
                            ) : (
                                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                                    <p>No mood data available for the last 24 hours.</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {moodHistory.length > 0 && (
                        <div className="mood-history">
                            <h2>Raw Mood History</h2>
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