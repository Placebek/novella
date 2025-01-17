import numpy as np
from fastapi import HTTPException
from whisper.audio import load_audio
from app.api.novella.schemes.response import RequestResponse, OptionsResponse
from app.api.novella.schemes.create import RequestCreate
from whisper_model.audio_transcribe import transcriber
from chatgpt.free_chat import get_novella_title, get_novellas_options_g4f, get_options_the_end_novella


async def request_novella(audio_file) -> RequestResponse:
    file_data = await audio_file.read()
    print('qqqq', audio_file)
    with open(audio_file.filename, "wb") as temp_file:
        temp_file.write(file_data)

    audio = load_audio(audio_file.filename)
    if not isinstance(audio, np.ndarray):
        raise HTTPException(status_code=400, detail="Uploaded file is not a valid audio format")
    try:
        print("DDDDDDD")
        text = transcriber.audio(audio_file=audio)
        print("DDDDDDD")
        title = get_novella_title(text=text)
        print("DDDDDDD")
        options = None
        while not options:
            print("SSSSSSSSS")
            options = get_novellas_options_g4f(text=text)
        return RequestResponse(
            text=text,
            title=title,
            options=options
        )
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error during transcription: {str(e)}")
    
async def get_options_bll(text: str):
    options = None
    while not options:
        options = get_novellas_options_g4f(text=text)
    return OptionsResponse(
        options=options
        )
async def the_end_novella_bll(text: str):
    options = None
    while not options:
        options = get_novellas_options_g4f(text=text)
    return OptionsResponse(
        options=options
        )