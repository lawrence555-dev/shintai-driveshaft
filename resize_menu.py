from PIL import Image
import os

# Source and Target Paths
source_path = "shintai_rich_menu.jpg"
target_path = "shintai_rich_menu_2500x1686.jpg"

try:
    if not os.path.exists(source_path):
        print(f"Error: {source_path} not found.")
        exit(1)

    with Image.open(source_path) as img:
        # Resize strictly to 2500x1686 as required by LINE
        # Using LANCZOS for high quality down/upscaling
        resized_img = img.resize((2500, 1686), Image.Resampling.LANCZOS)
        
        # Save as JPEG with high quality
        resized_img.save(target_path, quality=95, optimize=True)
        print(f"Successfully resized to 2500x1686: {target_path}")

except Exception as e:
    print(f"An error occurred: {e}")
