const handleTranslate = async () => {
    try {
        const translateResponse = await axios.post('http://127.0.0.1:5000/translate', { 
            text: transcription
        });
        setTranslation(translateResponse.data.translations);
        console.log(translateResponse.data.translations);
    } catch (error) {
        console.error('Error:', error);
    }
} 