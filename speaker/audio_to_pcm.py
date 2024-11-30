from pydub import AudioSegment
import numpy as np
import wave

def convert_audio_to_pcm(input_file, output_file, sample_rate=16000, sample_width=2, channels=1):
    """
    Convert an audio file to raw PCM data.

    Args:
        input_file (str): Path to the input MP3 or WAV file.
        output_file (str): Path to save the converted PCM binary file.
        sample_rate (int): Target sample rate (e.g., 16000 Hz).
        sample_width (int): Number of bytes per sample (2 for 16-bit).
        channels (int): Number of channels (1 for mono).
    """
    # Load audio using pydub
    audio = AudioSegment.from_file(input_file)
    
    # Convert to target format
    audio = audio.set_frame_rate(sample_rate).set_sample_width(sample_width).set_channels(channels)
    
    # Get raw PCM data
    pcm_data = np.array(audio.get_array_of_samples(), dtype=np.int16)
    
    # Write PCM data to a binary file
    with open(output_file, "wb") as f:
        f.write(pcm_data.tobytes())
    
    print(f"Converted audio saved to {output_file}")

# Example usage
input_file = "input.mp3"  # Replace with your MP3 or WAV file
output_file = "output.bin" # Replace with your desired output file name

# Convert and save PCM data
convert_audio_to_pcm(input_file, output_file)

