from PIL import Image, ImageDraw

# Source Path
source_path = "shintai_rich_menu_2500x1686.jpg"
target_path = "shintai_rich_menu_1666_split.jpg"

try:
    img = Image.open(source_path)
    # Original is 2500x1686
    
    # We need to split at x = 1666 (approx 2/3 width)
    split_x = 1666
    
    # 1. Extract Content Visuals
    # We grab the "Left" content from the original's left side (0 to ~1250)
    # We grab the "Right" content from the original's right side (1250 to 2500)
    left_source = img.crop((0, 0, 1250, 1686))
    right_source = img.crop((1250, 0, 2500, 1686))
    
    # 2. Resize to new Layout Ratios
    # Left needs to become 1666px wide (Stretch/Fit)
    left_new = left_source.resize((split_x, 1686), Image.Resampling.LANCZOS)
    
    # Right needs to become 834px wide (Squash/Fit)
    right_width = 2500 - split_x
    right_new = right_source.resize((right_width, 1686), Image.Resampling.LANCZOS)
    
    # 3. Paste into new Canvas
    new_img = Image.new('RGB', (2500, 1686), (0, 0, 0))
    new_img.paste(left_new, (0, 0))
    new_img.paste(right_new, (split_x, 0))
    
    # 4. Draw Neon Dividers
    draw = ImageDraw.Draw(new_img)
    neon_color = "#ff6b00"
    line_width = 20
    
    # Vertical Line at x=1666
    draw.rectangle([split_x - line_width//2, 0, split_x + line_width//2, 1686], fill=neon_color)
    
    # Horizontal Line at y=843 (Right side only)
    draw.rectangle([split_x, 843 - line_width//2, 2500, 843 + line_width//2], fill=neon_color)
    
    # 5. Save
    new_img.save(target_path, quality=95)
    print(f"Saved 2:1 split layout to: {target_path}")

except Exception as e:
    print(f"Error: {e}")
