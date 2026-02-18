import random
from datetime import datetime

ideas = [...]
hooks = [...]
closings = [...]

def generate_script():
    ...

# Buat nama file berdasarkan waktu
filename = f"output_{datetime.now().strftime('%Y%m%d_%H%M%S')}.txt"

with open(filename, "w", encoding="utf-8") as f:
    for i in range(5):
        f.write(generate_script())
        f.write("\n--------------------\n")

print(f"File {filename} berhasil dibuat.")
