import json
import wave
from pathlib import Path
root = Path(__file__).resolve().parent.parent
durations = {}
for path in (root / 'public' / 'audio').glob('*.wav'):
    with wave.open(str(path)) as audio:
        durations[path.stem] = round(audio.getnframes() / audio.getframerate())
(root / 'shared' / 'audio-durations.mjs').write_text('export const audioDurations = ' + json.dumps(durations) + ';\n', encoding='utf-8')
print(f'Verified {len(durations)} WAV recordings; duration metadata saved.')
