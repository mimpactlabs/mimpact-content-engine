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
