#!/usr/bin/env python3
"""
Convert PNG images to WebP format for better web performance
Usage: python3 convert_to_webp.py
"""

import os
from PIL import Image

ASSETS_DIR = "assets"
QUALITY = 85  # WebP quality (0-100)

# List of all PNG images to convert
images = [
    "image_1.png",   # Hero image
    "image_2.png",   # Hero image
    "image_3.png",   # Hero image
    "image_5.png",   # Showcase
    "image_6.png",   # Showcase
    "image_8.png",   # Showcase
    "image_9.png",   # Team member
    "image_10.png",  # Team member
    "image_11.png",  # Team member
    "image_12.png",  # Gallery
    "image_13.png",  # Gallery
    "image_14.png",  # Gallery
    "image_15.png",  # Team member
    "image_16.png",  # Team member
    "image_17.png",  # Team member
]

def convert_to_webp(image_path, quality=QUALITY):
    """Convert a single PNG image to WebP format"""
    try:
        # Open the image
        img = Image.open(image_path)
        
        # Convert to RGB if necessary (for PNG with transparency, keep RGBA)
        if img.mode in ('RGBA', 'LA', 'P'):
            # Keep transparency
            img = img.convert('RGBA')
        else:
            img = img.convert('RGB')
        
        # Get output path
        base_name = os.path.splitext(image_path)[0]
        output_path = f"{base_name}.webp"
        
        # Save as WebP
        img.save(output_path, 'WEBP', quality=quality, method=6)
        
        # Get file sizes
        original_size = os.path.getsize(image_path)
        webp_size = os.path.getsize(output_path)
        savings = ((original_size - webp_size) / original_size) * 100
        
        print(f"✓ Converted: {image_path} → {output_path}")
        print(f"  Size: {original_size/1024:.1f}KB → {webp_size/1024:.1f}KB ({savings:.1f}% reduction)")
        
        return True
        
    except Exception as e:
        print(f"✗ Failed to convert {image_path}: {e}")
        return False

def main():
    print("="*60)
    print("Converting PNG images to WebP format")
    print("="*60)
    
    os.chdir(ASSETS_DIR)
    
    success_count = 0
    fail_count = 0
    total_original = 0
    total_webp = 0
    
    for image in images:
        if os.path.exists(image):
            original_size = os.path.getsize(image)
            if convert_to_webp(image):
                webp_name = image.replace('.png', '.webp')
                webp_size = os.path.getsize(webp_name)
                total_original += original_size
                total_webp += webp_size
                success_count += 1
            else:
                fail_count += 1
        else:
            print(f"⚠ Image not found: {image}")
            fail_count += 1
    
    print("\n" + "="*60)
    print(f"Conversion complete: {success_count} successful, {fail_count} failed")
    if total_original > 0:
        total_savings = ((total_original - total_webp) / total_original) * 100
        print(f"Total size reduction: {total_original/1024:.1f}KB → {total_webp/1024:.1f}KB ({total_savings:.1f}% smaller)")
    print("="*60)

if __name__ == "__main__":
    main()
