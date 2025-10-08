#!/usr/bin/env python3
"""
Создание простого favicon.ico для Mostbet
"""

from PIL import Image, ImageDraw, ImageFont
import io

def create_favicon():
    # Создаем изображение 32x32
    size = 32
    img = Image.new('RGBA', (size, size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    
    # Фон - оранжевый круг
    draw.ellipse([2, 2, size-2, size-2], fill=(255, 107, 53, 255), outline=(255, 255, 255, 255))
    
    # Буква M в центре
    try:
        # Пытаемся использовать системный шрифт
        font = ImageFont.truetype("/System/Library/Fonts/Arial.ttf", 20)
    except:
        # Fallback на стандартный шрифт
        font = ImageFont.load_default()
    
    # Рисуем букву M
    text = "M"
    bbox = draw.textbbox((0, 0), text, font=font)
    text_width = bbox[2] - bbox[0]
    text_height = bbox[3] - bbox[1]
    
    x = (size - text_width) // 2
    y = (size - text_height) // 2 - 2
    
    draw.text((x, y), text, fill=(255, 255, 255, 255), font=font)
    
    # Сохраняем как ICO
    img.save('favicon.ico', format='ICO', sizes=[(16, 16), (32, 32)])
    print("Favicon.ico создан успешно!")

if __name__ == "__main__":
    create_favicon()

