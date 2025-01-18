from flask import Flask, request, jsonify
from flask_cors import CORS
from werkzeug.utils import secure_filename
from moviepy import *
from google.cloud import storage, speech, translate_v3
from pydub import AudioSegment
import os

app = Flask(__name__)
CORS(app)

UPLOAD_FOLDER = 'uploads'
ALLOWED_EXTENSIONS = {'mp4', 'avi', 'mov'}
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

# Set up Google Cloud credentials
os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = '/Users/adithya/Downloads/App Translation Sharath Chenna.json'

# Initialize Google Cloud clients
storage_client = storage.Client()
speech_client = speech.SpeechClient()
audio_output_path = "/uploads/temp_audio.wav"

BUCKET_NAME = "translation_980"

# Initialize Google Cloud Translation client
translate_client = translate_v3.TranslationServiceClient()

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

# def extract_audio_from_video(video_path, audio_output_path):
#     audio_clip = AudioFileClip(video_path)
#     audio_clip.write_audiofile(audio_output_path, codec='pcm_s16le')
#     audio_clip.close()

#     # Convert to mono
#     audio = AudioSegment.from_file(audio_output_path)
#     audio = audio.set_channels(1)
#     audio.export(audio_output_path, format="wav")

# def split_audio(audio_path, segment_length_ms=60000):
#     audio = AudioSegment.from_wav(audio_path)
#     segments = [audio[i:i + segment_length_ms] for i in range(0, len(audio), segment_length_ms)]
#     return segments

def transcribe_audio_segments(audio_path):
    with open(audio_path, "rb") as audio_file:
        content = audio_file.read()

    audio = speech.RecognitionAudio(content=content)
    config = speech.RecognitionConfig(
        encoding=speech.RecognitionConfig.AudioEncoding.LINEAR16,
        sample_rate_hertz=44100,
        language_code="en-US",
        enable_automatic_punctuation=True
    )

    try:
        response = speech_client.recognize(config=config, audio=audio)
        transcription = ""
        for result in response.results:
            transcription += result.alternatives[0].transcript + " "
        return transcription.strip()
    except Exception as e:
        print(f"Error during transcription: {e}")
        return None

def transcribe_video(video_path):
    audio_path = "temp_audio.mp3"
    video_clip = VideoFileClip(video_path)
    video_clip.audio.write_audiofile(audio_path)
    video_clip.close()  # Close the video clip to free resources

    # Convert audio configuration to match Google Speech requirements
    config = speech.RecognitionConfig(
        encoding=speech.RecognitionConfig.AudioEncoding.ENCODING_UNSPECIFIED,
        sample_rate_hertz=44100,
        language_code="en-US",
        enable_automatic_punctuation=True
    )

    # Use long_running_recognize for large files
    with open(audio_path, "rb") as audio_file:
        content = audio_file.read()
    
    audio = speech.RecognitionAudio(content=content)
    operation = speech_client.long_running_recognize(config=config, audio=audio)
    response = operation.result(timeout=300)  # Increased timeout for longer files

    transcription = ""
    for result in response.results:
        transcription += result.alternatives[0].transcript + " "

    # Cleanup
    if os.path.exists(audio_path):
        os.remove(audio_path)

    return transcription.strip()

@app.route('/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return jsonify({"error": "No file part"}), 400
    file = request.files['file']
    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400
    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)
        file.save(file_path)
        
        transcription = transcribe_video(file_path)
        
        if transcription:
            return jsonify({"transcription": transcription}), 200
        else:
            return jsonify({"error": "Transcription failed"}), 500
    return jsonify({"error": "Invalid file type"}), 400

@app.route('/translate', methods=['POST'])
def translate_text():
    data = request.json
    text = data.get('text')  # Get the transcription text from the request
    
    if not text:
        return jsonify({"error": "No text provided"}), 400

    # Define the target languages
    target_languages = {
        "Hindi": "hi",
        "Marathi": "mr",
        "Gujarati": "gu",
        "Tamil": "ta",
        "Kannada": "kn",
        "Telugu": "te",
        "Bengali": "bn",
        "Malayalam": "ml",
        "Punjabi": "pa",
        "Odia": "or"
    }

    project_id = "app-translation-448216"
    location = "global"
    parent = f"projects/{project_id}/locations/{location}"

    translations = {}
    for language, code in target_languages.items():
        try:
            request_config = {
                "parent": parent,
                "contents": [text],
                "mime_type": "text/plain",
                "source_language_code": "en",
                "target_language_code": code,
            }
            response = translate_client.translate_text(request=request_config)
            translations[language] = response.translations[0].translated_text
        except Exception as e:
            translations[language] = f"Error: {str(e)}"
    
    return jsonify({"translations": translations}), 200

if __name__ == '__main__':
    app.run(debug=True)