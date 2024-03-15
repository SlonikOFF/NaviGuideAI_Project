import os
import torch
from TTS.api import TTS
device = "cuda" if torch.cuda.is_available() else "cpu"
tts = TTS("tts_models/en/ljspeech/fast_pitch").to(device)

def get_next_available_filename(output_dir):
    file_counter = 1
    while True:
        output_file = os.path.join(output_dir, f"output_en_{file_counter}.wav")
        if not os.path.exists(output_file):
            break
        file_counter += 1
    return output_file

def process_and_save_audio(input_text, output_dir):
    os.makedirs(output_dir, exist_ok=True)
    output_file = get_next_available_filename(output_dir)
    tts.tts_to_file(text=input_text, speaker_wav="dictor_en.wav", file_path=output_file)

input_text = ("Sankt-Petersburg is the cultural capital of Russia, rich in history and architecture, with beautiful "
              "bridges and embankments, white nights, the Hermitage, the Russian Museum, the Peter and Paul Fortress, "
              "magnificent gardens and parks.")
output_directory = "tts_output"
process_and_save_audio(input_text, output_directory)