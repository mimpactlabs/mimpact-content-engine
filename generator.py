import random
from datetime import datetime

# List ide, hook, dan closing
ideas = [
    "Latih rindu sebelum Ramadhan menyapa",
    "Allah tidak pernah terlambat",
    "Diam bukan berarti kalah",
    "Jangan tunggu hancur untuk berubah",
    "Fokus diam-diam, hasilkan diam-diam"
]

hooks = [
    "Pernah merasa lelah?",
    "Mungkin kamu lupa satu hal...",
    "Kadang kita salah paham...",
    "Tenang dulu...",
    "Dengar ini baik-baik..."
]

closings = [
    "Allah tahu waktunya.",
    "Belum selesai.",
    "Masih ada harapan.",
    "Jangan menyerah.",
    "Percaya prosesnya."
]

# Fungsi untuk membuat script acak
def generate_script():
    idea = random.choice(ideas)
    hook = random.choice(hooks)
    closing = random.choice(closings)

    return f"""IDE: {idea}

HOOK:
{hook}

INTI:
{idea}

CLOSING:
{closing}
"""

# Buat nama file berdasarkan waktu
filename = f"output_{datetime.now().strftime('%Y%m%d_%H%M%S')}.txt"

# Tulis hasil ke file
with open(filename, "w", encoding="utf-8") as f:
    for i in range(5):
        f.write(generate_script())
        f.write("\n--------------------\n")

print(f"File {filename} berhasil dibuat.")
