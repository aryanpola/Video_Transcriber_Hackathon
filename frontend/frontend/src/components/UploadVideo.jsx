import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';

const UploadVideo = () => {
    const [videoFile, setVideoFile] = useState(null);
    const [videoPreview, setVideoPreview] = useState(null);
    const [showTextEditor, setShowTextEditor] = useState(false);
    const [transcription, setTranscription] = useState('');
    const [translation, setTranslation] = useState('');
    const fileInputRef = useRef(null);
    const [selectedLanguage, setSelectedLanguage] = useState('');
    const [availableLanguages, setAvailableLanguages] = useState(['Hindi', 'Bengali', 'Marathi', 'Gujarati', 'Punjabi', 'Tamil', 'Telugu', 'Kannada', 'Malayalam', 'Odia']);
    const [isLoading, setIsLoading] = useState(false);
    const [bleuScores, setBleuScores] = useState([]);

    useEffect(() => {
        // Load data from localStorage on component mount
        const storedVideo = localStorage.getItem('videoFile');
        const storedTranscription = localStorage.getItem('transcription');
        const storedTranslation = localStorage.getItem('translation');
        const storedVideoPreview = localStorage.getItem('videoPreview');

        if (storedVideo) {
            setVideoFile(JSON.parse(storedVideo));
            setVideoPreview(storedVideoPreview);
        }
        if (storedTranscription) setTranscription(storedTranscription);
        if (storedTranslation) setTranslation(storedTranslation);
    }, []);

    useEffect(() => {
        // Save data to localStorage whenever it changes
        if (videoFile) {
            localStorage.setItem('videoFile', JSON.stringify(videoFile));
            localStorage.setItem('videoPreview', videoPreview);
        }
        localStorage.setItem('transcription', transcription);
        localStorage.setItem('translation', translation);
    }, [videoFile, videoPreview, transcription, translation]);

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file && file.type.startsWith('video/')) {
            setVideoFile(file);
            setVideoPreview(URL.createObjectURL(file));
        } else {
            alert('Please upload a valid video file.');
        }
    };

    const handleTranscribe = async () => {
        if (!videoFile) {
            alert('No video file selected for transcription.');
            return;
        }
        const formData = new FormData();
        formData.append('file', videoFile);

        setIsLoading(true);
        try {
            const uploadResponse = await axios.post('http://127.0.0.1:5000/upload', formData);
            setTranscription(uploadResponse.data.transcription);
            setShowTextEditor(true);
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleTranslate = async () => {
        setIsLoading(true);
        try {
            const translateResponse = await axios.post('http://127.0.0.1:5000/translate', 
                { text: transcription });
            const translations = translateResponse.data.translations;
            setTranslation(translations[selectedLanguage] || translations['Hindi']);
            setBleuScores(translateResponse.data.bleu_scores);
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = () => {
        setVideoFile(null);
        setVideoPreview(null);
        setShowTextEditor(false);
        setTranscription('');
        setTranslation('');
        setBleuScores([]);
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
        localStorage.removeItem('videoFile');
        localStorage.removeItem('videoPreview');
        localStorage.removeItem('transcription');
        localStorage.removeItem('translation');
    };

    return (
        <div style={{ textAlign: 'center', padding: '20px', backgroundColor: 'white', marginTop: '45px', }}>
            {/* Title and Subtitle above the upload box */}
            <div style={{ marginBottom: '30px' }}>
                <div style={{ fontSize: '36px', fontWeight: 'bold', color: '#003366' }}>
                    Free English Transcriber
                </div>
                <div style={{ fontSize: '18px', color: '#00509E', marginTop: '10px' }}>
                    Upload your English video and let our AI turn it into precise text!
                </div>
            </div>

            <div
                style={{
                    textAlign: 'center',
                    padding: '20px',
                    border: '2px dashed #007bff',
                    borderRadius: '10px',
                    width: '400px',
                    margin: 'auto',
                    backgroundColor: 'white',
                }}
            >
                <label htmlFor="fileInput" style={{ cursor: 'pointer', display: 'block', padding: '20px' }}>
                    <img
                        src="https://png.pngtree.com/png-clipart/20190921/original/pngtree-file-upload-icon-png-image_4717174.jpg"
                        alt="Upload Icon"
                        style={{ marginBottom: '10px', width: '50px', height: '50px', borderRadius: '50%' }}
                    />
                    <div style={{ fontWeight: 'bold', fontSize: '18px', color: '#333' }}>Drag & drop files here</div>
                    <div style={{ fontSize: '14px', color: '#666' }}>or click to browse</div>
                </label>
                <input
                    id="fileInput"
                    type="file"
                    accept="video/*"
                    onChange={handleFileChange}
                    ref={fileInputRef}
                    style={{ display: 'none' }}
                />

                {videoPreview && (
                    <div style={{ marginTop: '-50px' }}>
                        <h4>Video Preview:</h4>
                        <video
                            src={videoPreview}
                            controls
                            width="100%"
                            style={{ border: '1px solid #ccc', borderRadius: '8px' }}
                        />
                    </div>
                )}

                {videoFile && (
                    <div style={{ marginTop: '20px' }}>
                        <button
                            onClick={handleTranscribe}
                            style={{
                                marginRight: '10px',
                                padding: '10px 20px',
                                fontSize: '16px',
                                backgroundColor: '#003366',
                                color: 'white',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: 'pointer',
                            }}
                        >
                            Transcribe
                        </button>
                        <button
                            onClick={handleDelete}
                            style={{
                                padding: '10px 20px',
                                fontSize: '16px',
                                backgroundColor: '#dc3545',
                                color: 'white',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: 'pointer',
                            }}
                        >
                            Delete
                        </button>
                    </div>
                )}
            </div>

            {/* Loader */}
            {isLoading && (
                <div style={{ marginTop: '20px', fontSize: '16px', color: '#00509E' }}>
                    Loading...
                </div>
            )}

            {/* Text Editor Below the Upload Box */}
            {showTextEditor && (
                <div
                    style={{
                        marginTop: '30px',
                        textAlign: 'left',
                        padding: '20px',
                        border: '1px solid #e0e0e0',
                        borderRadius: '10px',
                        backgroundColor: 'white',
                        width: '95%',
                        margin: '30px auto',
                        boxShadow: '0px 1px 3px rgba(0, 0, 0, 0.1)',
                    }}
                >
                    <h4 style={{ color: '#003366', fontWeight: 'bold', marginBottom: '10px' }}>Transcribed Text</h4>
                    <textarea
                        value={transcription}
                        onChange={(e) => setTranscription(e.target.value)}
                        placeholder="Your transcribed text..."
                        style={{
                            width: '95%',
                            height: '200px',
                            borderRadius: '5px',
                            padding: '10px',
                            fontSize: '14px',
                            color: '#000000',
                            resize: 'none',
                            backgroundColor: '#FFFFFF',
                        }}
                    />
                    <select
                        value={selectedLanguage}
                        onChange={(e) => setSelectedLanguage(e.target.value)}
                        style={{
                            marginTop: '20px',
                            padding: '10px',
                            fontSize: '16px',
                            borderRadius: '4px',
                            width: '100%',
                        }}
                    >
                        <option value="" disabled>Select a language</option>
                        {availableLanguages.map((lang) => (
                            <option key={lang} value={lang}>
                                {lang}
                            </option>
                        ))}
                    </select>
                        <button
                            onClick={handleTranslate}
                            style={{
                                marginTop: '10px',
                                marginBottom:'10px',
                                padding: '10px 20px',
                                fontSize: '16px',
                                backgroundColor: '#00509E',
                                color: 'white',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: 'pointer',
                            }}
                        >
                            Translate
                        </button>
                    <textarea
                        value={translation}
                        placeholder="Translation will appear here..."
                        style={{
                            width: '95%',
                            height: '200px',
                            borderRadius: '5px',
                            padding: '10px',
                            fontSize: '14px',
                            color: '#000000',
                            resize: 'none',
                            backgroundColor: '#FFFFFF',
                        }}
                        readOnly
                    />
                    {(
                        <div style={{ marginTop: '10px', fontSize: '16px', color: '#00509E' }}>
                            BLEU Score: {parseInt(bleuScores[selectedLanguage]) * 10} %
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default UploadVideo;