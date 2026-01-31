from PIL import Image, ImageDraw

# Source Path
source_path = "shintai_rich_menu_2500x1686.jpg"
target_path = "shintai_rich_menu_fixed.jpg"

try:
    img = Image.open(source_path)
    width, height = img.size # Should be 2500, 1686

    # 1. Define the "Visual" split point in the current image
    # The user says the line is too left. Let's estimate the current visual divider is around x=1050 to 1150.
    # We will grab content to the left and right of this "bad" area to avoid the old line.
    
    # Left Content Source: 0 to ~1100
    left_source = img.crop((0, 0, 1100, 1686))
    # Right Content Source: ~1250 to 2500
    right_source = img.crop((1250, 0, 2500, 1686))

    # 2. Define LINE's Official Grid Targets
    # Left A: 1250 x 1686
    # Right B+C: 1250 x 1686
    target_left_width = 1250
    target_right_width = 1250
    
    # 3. Resize parts to fill their new correct homes
    # Using LANCZOS for quality. Slight stretching is acceptable for this style.
    left_fixed = left_source.resize((target_left_width, 1686), Image.Resampling.LANCZOS)
    right_fixed = right_source.resize((target_right_width, 1686), Image.Resampling.LANCZOS)

    # 4. Create new Canvas
    new_img = Image.new('RGB', (2500, 1686), (0, 0, 0))
    new_img.paste(left_fixed, (0, 0))
    new_img.paste(right_fixed, (1250, 0))

    # 5. Draw Clean Dividers (Neon Style)
    draw = ImageDraw.Draw(new_img)
    neon_color = "#ff6b00"
    
    # Vertical Line at x=1250 (Center)
    # Draw a thick line to emulate the neon bar
    line_width = 20
    draw.rectangle([1250 - line_width//2, 0, 1250 + line_width//2, 1686], fill=neon_color)
    
    # Horizontal Line at y=843 (Right Side Center)
    # Only from x=1250 to 2500
    draw.rectangle([1250, 843 - line_width//2, 2500, 843 + line_width//2], fill=neon_color)

    # 6. Save
    new_img.save(target_path, quality=95)
    print(f"Fixed alignment saved to: {target_path}")

except Exception as e:
    print(f"Error: {e}")
