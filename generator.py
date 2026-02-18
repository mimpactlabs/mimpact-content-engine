import random

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

def generate_script():
    idea = random.choice(ideas)
    hook = random.choice(hooks)
    closing = random.choice(closings)

    script = f"""
IDE: {idea}

HOOK:
{hook}

INTI:
{idea}

CLOSING:
{closing}
"""
    return script

for i in range(5):
    print(generate_script())
    print("------")
