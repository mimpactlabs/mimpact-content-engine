import json

description = input("Masukkan deskripsi gambar AI: ").lower()

analysis = {
    "subject": "",
    "style": "",
    "lighting": "",
    "camera": "",
    "mood": "",
    "quality": ""
}

# SUBJECT DETECTION
if "man" in description:
    analysis["subject"] = "man"
if "woman" in description:
    analysis["subject"] = "woman"
if "old" in description or "elderly" in description:
    analysis["subject"] = "elderly person"

# STYLE
if "cinematic" in description:
    analysis["style"] = "cinematic photography"
if "realistic" in description:
    analysis["style"] = "ultra realistic"

# LIGHTING
if "dramatic" in description:
    analysis["lighting"] = "dramatic lighting"
if "soft light" in description:
    analysis["lighting"] = "soft lighting"

# CAMERA
if "85mm" in description:
    analysis["camera"] = "85mm lens"
if "shallow depth" in description:
    analysis["camera"] += ", shallow depth of field"

# MOOD
if "dark" in description:
    analysis["mood"] = "dark mood"
if "moody" in description:
    analysis["mood"] = "moody atmosphere"

# QUALITY
if "8k" in description:
    analysis["quality"] = "8k resolution"
if "4k" in description:
    analysis["quality"] = "4k resolution"

print("\n=== ANALISIS TERSTRUKTUR ===")
print(analysis)

# BUILD PROFESSIONAL PROMPT
prompt_parts = [v for v in analysis.values() if v]
final_prompt = ", ".join(prompt_parts)

print("\n=== PROMPT RECONSTRUCTION V2 ===")
print(final_prompt)

print("\n=== JSON OUTPUT V2 ===")
print(json.dumps(analysis, indent=4))

print("\n=== MIDJOURNEY VERSION ===")
mj_prompt = f"{final_prompt} --ar 2:3 --v 6 --style raw"
print(mj_prompt)

print("\n=== STABLE DIFFUSION VERSION ===")
sd_prompt = f"{final_prompt}, highly detailed, sharp focus"
print(sd_prompt)

print("\n=== CLEAN UNIVERSAL VERSION ===")
print(final_prompt)

import json
from datetime import datetime

result_data = {
    "timestamp": datetime.utcnow().isoformat(),
    "analysis": analysis,
    "reconstructed_prompt": reconstructed_prompt,
    "json_output": structured_output
}

with open("output.json", "w") as f:
    json.dump(result_data, f, indent=4)

import json
import os
from datetime import datetime

# Pastikan folder history ada
os.makedirs("history", exist_ok=True)

timestamp = datetime.utcnow().strftime("%Y-%m-%dT%H-%M-%S")

result_data = {
    "timestamp": timestamp,
    "analysis": analysis,
    "reconstructed_prompt": reconstructed_prompt,
    "json_output": structured_output
}

filename = f"history/{timestamp}.json"

with open(filename, "w") as f:
    json.dump(result_data, f, indent=4)

print(f"\n=== FILE SAVED: {filename} ===")
