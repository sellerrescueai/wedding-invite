import math

cx = 100
cy = 100
r1 = 22
r2 = 92
lines = []

for i in range(24):
    angle = i * 15
    rad = math.radians(angle)
    x1 = cx + r1 * math.cos(rad)
    y1 = cy + r1 * math.sin(rad)
    x2 = cx + r2 * math.cos(rad)
    y2 = cy + r2 * math.sin(rad)
    lines.append(f'<line x1="{round(x1, 1)}" y1="{round(y1, 1)}" x2="{round(x2, 1)}" y2="{round(y2, 1)}"/>')

print("\n".join(lines))
