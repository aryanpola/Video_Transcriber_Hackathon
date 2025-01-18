import React, { useState } from 'react';
import axios from 'axios';

function VideoUploader() {
  const [file, setFile] = useState(null);
  const [transcription, setTranscription] = useState('');
  const [translation, setTranslation] = useState('');
  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) {
      alert('Please select a file first!');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      const uploadResponse = await axios.post('http://127.0.0.1:5000/upload', formData);
   
      setTranscription(uploadResponse.data.transcription);

      // console.log(uploadResponse.data.transcription);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleTranslate = async () => {
    try{
      const translateResponse = await axios.post('http://127.0.0.1:5000/translate', 
        { text: transcription });
      setTranslation(translateResponse.data.translations);
      console.log(translateResponse.data.translations);
    } catch (error) {
      console.error('Error:', error);
    }
  }
  return (
    <div>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleUpload}>Upload and Transcribe</button>
      {transcription && (
        <div>
          <div>
            <h3>Transcription:</h3>
            <p>{transcription}</p>
          </div>
          <button onClick={handleTranslate}>Translate</button>
          <h3>Hindi Translation:</h3>
          <p>{translation.Hindi}</p>
        </div>
      )}
    </div>
  );
}

export default VideoUploader;