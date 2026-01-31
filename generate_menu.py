from PIL import Image, ImageDraw, ImageFont
import os

def create_rich_menu():
    # Dimensions
    width = 1200
    height = 810
    
    # Colors (Shintai Brand)
    # Dark Slate: #0f172a / RGB(15, 23, 42)
    # Brand Orange: #f97316 / RGB(249, 115, 22)
    # Light Gray: #f8fafc / RGB(248, 250, 252)
    # White: #ffffff
    
    bg_color = (15, 23, 42)
    accent_color = (249, 115, 22)
    text_color = (255, 255, 255)
    secondary_bg = (30, 41, 59) # Lighter slate for right side buttons
    
    # Create Image
    img = Image.new('RGB', (width, height), color=bg_color)
    draw = ImageDraw.Draw(img)
    
    # --- Layout Definitions ---
    # Left Block (Main Action): 0,0 -> 600, 810
    # Right Top (Secondary): 600,0 -> 1200, 405
    # Right Bottom (Info): 600,405 -> 1200, 810
    
    # --- Draw Backgrounds ---
    # Left is already base bg_color
    
    # Right Top
    draw.rectangle([(600, 0), (1200, 405)], fill=secondary_bg)
    # Add a thin distinct border line
    draw.line([(598, 0), (598, 810)], fill=accent_color, width=4) # Vertical Divider
    draw.line([(600, 403), (1200, 403)], fill=bg_color, width=4) # Horizontal Divider on Right
    
    # --- Load Font ---
    # Try to load a system font that supports Chinese
    font_path = "/System/Library/Fonts/PingFang.ttc"
    try:
        title_font = ImageFont.truetype(font_path, 80)
        subtitle_font = ImageFont.truetype(font_path, 40)
        icon_font = ImageFont.truetype(font_path, 120) 
    except:
        print("Warning: PingFang font not found, using default.")
        title_font = ImageFont.load_default()
        subtitle_font = ImageFont.load_default()
        icon_font = ImageFont.load_default()

    # --- Draw Content: Left (Booking) ---
    # Icon simulation (Text for now, or simple shapes)
    # Circle for icon bg
    center_x_left = 300
    center_y_left = 350
    draw.ellipse([(center_x_left-100, center_y_left-100), (center_x_left+100, center_y_left+100)], fill=accent_color)
    
    # Text
    text_main = "立即預約"
    text_sub = "Book Service"
    
    # Calculate text size (approximate centering)
    draw.text((center_x_left, center_y_left), "📅", font=icon_font, fill='white', anchor="mm")
    draw.text((center_x_left, center_y_left + 160), text_main, font=title_font, fill='white', anchor="mm")
    draw.text((center_x_left, center_y_left + 220), text_sub, font=subtitle_font, fill=(200, 200, 200), anchor="mm")

    # --- Draw Content: Right Top (My Bookings) ---
    center_x_rt = 900
    center_y_rt = 202
    
    draw.text((center_x_rt - 180, center_y_rt), "📋", font=icon_font, fill='white', anchor="mm")
    draw.text((center_x_rt + 40, center_y_rt - 20), "我的預約", font=title_font, fill='white', anchor="mm")
    draw.text((center_x_rt + 40, center_y_rt + 40), "My Records", font=subtitle_font, fill=(148, 163, 184), anchor="mm")

    # --- Draw Content: Right Bottom (Contact/Map) ---
    center_x_rb = 900
    center_y_rb = 607
    
    draw.text((center_x_rb - 180, center_y_rb), "📍", font=icon_font, fill='white', anchor="mm")
    draw.text((center_x_rb + 40, center_y_rb - 20), "聯絡我們", font=title_font, fill='white', anchor="mm")
    draw.text((center_x_rb + 40, center_y_rb + 40), "Contact Us", font=subtitle_font, fill=(148, 163, 184), anchor="mm")

    # Save
    output_path = "shintai_rich_menu.jpg"
    img.save(output_path, quality=95)
    print(f"Image saved to {os.path.abspath(output_path)}")

if __name__ == "__main__":
    create_rich_menu()
