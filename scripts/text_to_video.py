import os
import sys
import numpy as np
from moviepy import ImageSequenceClip, concatenate_videoclips
from diffusers import DiffusionPipeline
import torch

DEVICE = "cuda" if torch.cuda.is_available() else "cpu"
DTYPE = torch.float16 if DEVICE == "cuda" else torch.float32
OUT_DIR = "assets/videos"
OUT_FILE = os.path.join(OUT_DIR, "manifesto_draft.mp4")

prompt = sys.argv[1] if len(sys.argv) > 1 else "A quiet, minimal scene"

beats = [
    (prompt, 3),
    ("words dissolving into silence, minimal", 3),
    ("a single candle, dark room, stillness", 3),
]

os.makedirs(OUT_DIR, exist_ok=True)

pipe = DiffusionPipeline.from_pretrained(
    "microsoft/text-to-video-ms-1.7b",
    torch_dtype=DTYPE,
).to(DEVICE)


def generate_clip(text):
    output = pipe(prompt=text, num_frames=16)
    return output.frames


clips = []
for i, (text, _) in enumerate(beats):
    frames = generate_clip(text)
    clip = ImageSequenceClip([np.array(f) for f in frames], fps=8)
    clip_path = os.path.join(OUT_DIR, f"beat_{i:02d}.mp4")
    clip.write_videofile(clip_path, codec="libx264", logger=None)
    clips.append(clip)

final = concatenate_videoclips(clips)
final.write_videofile(OUT_FILE, codec="libx264", logger=None)
print(f"Written: {OUT_FILE}")
