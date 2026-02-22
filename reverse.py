description = input("Masukkan deskripsi gambar AI: ")

print("\n=== ANALISIS SEDERHANA ===")

if "cinematic" in description.lower():
    print("Style: cinematic")

if "8k" in description.lower():
    print("Quality: 8k")

if "85mm" in description.lower():
    print("Camera: 85mm lens")

print("\n=== PROMPT REKONSTRUKSI ===")
print(description)

print("\n=== JSON OUTPUT ===")
print('{"description": "' + description + '"}')
Fix reverse engine file
