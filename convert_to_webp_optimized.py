#!/usr/bin/env python3
"""
Convert PNG images to optimized WebP format (target: <200KB per image)
Usage: python3 convert_to_webp_optimized.py
"""

import os
from PIL import Image

ASSETS_DIR = "assets"
MAX_SIZE_KB = 200  # Target max size in KB

# Image configurations with max dimensions and quality
IMAGE_CONFIGS = {
    # Hero images - larger but optimized
    "image_1.png": {"max_width": 1920, "quality": 75, "priority": True},
    "image_2.png": {"max_width": 1920, "quality": 75, "priority": True},
    "image_3.png": {"max_width": 1920, "quality": 75, "priority": True},
    
    # Team member images - smaller, portrait
    "image_9.png": {"max_width": 600, "quality": 80, "priority": False},
    "image_10.png": {"max_width": 600, "quality": 80, "priority": False},
    "image_11.png": {"max_width": 600, "quality": 80, "priority": False},
    "image_15.png": {"max_width": 600, "quality": 80, "priority": False},
    "image_16.png": {"max_width": 600, "quality": 80, "priority": False},
    "image_17.png": {"max_width": 600, "quality": 80, "priority": False},
    
    # Showcase/gallery images - medium size
    "image_5.png": {"max_width": 800, "quality": 80, "priority": False},
    "image_6.png": {"max_width": 800, "quality": 80, "priority": False},
    "image_7.png": {"max_width": 800, "quality": 80, "priority": False},
    "image_8.png": {"max_width": 800, "quality": 80, "priority": False},
    "image_12.png": {"max_width": 800, "quality": 80, "priority": False},
    "image_13.png": {"max_width": 800, "quality": 80, "priority": False},
    "image_14.png": {"max_width": 800, "quality": 80, "priority": False},
}

def get_file_size_kb(filepath):
    """Get file size in KB"""
    return os.path.getsize(filepath) / 1024

def optimize_image(image_path, config):
    """Convert and optimize a single image to WebP"""
    try:
        img = Image.open(image_path)
        original_width, original_height = img.size
        
        # Calculate new dimensions while maintaining aspect ratio
        max_width = config["max_width"]
        quality = config["quality"]
        
        if original_width > max_width:
            ratio = max_width / original_width
            new_width = max_width
            new_height = int(original_height * ratio)
            img = img.resize((new_width, new_height), Image.LANCZOS)
            print(f"  Resized: {original_width}x{original_height} → {new_width}x{new_height}")
        
        # Convert to RGB if necessary (WebP doesn't support all PNG modes)
        if img.mode in ('RGBA', 'LA', 'P'):
            # Create white background for transparent images
            background = Image.new('RGB', img.size, (255, 255, 255))
            if img.mode == 'P':
                img = img.convert('RGBA')
            if img.mode in ('RGBA', 'LA'):
                background.paste(img, mask=img.split()[-1] if img.mode in ('RGBA', 'LA') else None)
                img = background
        elif img.mode != 'RGB':
            img = img.convert('RGB')
        
        # Get output path
        base_name = os.path.splitext(image_path)[0]
        output_path = f"{base_name}.webp"
        
        # Try different quality levels until under 200KB
        current_quality = quality
        while current_quality >= 50:
            img.save(output_path, 'WEBP', quality=current_quality, method=6)
            size_kb = get_file_size_kb(output_path)
            
            if size_kb <= MAX_SIZE_KB:
                break
            
            current_quality -= 5
            print(f"  Quality {current_quality + 5}% too large ({size_kb:.1f}KB), trying {current_quality}%...")
        
        final_size_kb = get_file_size_kb(output_path)
        original_size_kb = get_file_size_kb(image_path)
        savings = ((original_size_kb - final_size_kb) / original_size_kb) * 100
        
        status = "✓" if final_size_kb <= MAX_SIZE_KB else "⚠"
        print(f"{status} {os.path.basename(image_path)} → {os.path.basename(output_path)}")
        print(f"  Size: {original_size_kb:.1f}KB → {final_size_kb:.1f}KB ({savings:.1f}% reduction, quality: {current_quality}%)")
        
        return final_size_kb <= MAX_SIZE_KB
        
    except Exception as e:
        print(f"✗ Failed to convert {image_path}: {e}")
        return False

def main():
    print("="*70)
    print("Converting PNG images to optimized WebP format (target: <200KB)")
    print("="*70)
    
    os.chdir(ASSETS_DIR)
    
    success_count = 0
    fail_count = 0
    too_large_count = 0
    total_original = 0
    total_webp = 0
    
    for image, config in IMAGE_CONFIGS.items():
        if os.path.exists(image):
            original_size = get_file_size_kb(image)
            total_original += original_size
            
            print(f"\nProcessing: {image}")
            if config["priority"]:
                print("  [Priority image - preloaded in HTML]")
            
            if optimize_image(image, config):
                webp_name = image.replace('.png', '.webp')
                webp_size = get_file_size_kb(webp_name)
                total_webp += webp_size
                
                if webp_size <= MAX_SIZE_KB:
                    success_count += 1
                else:
                    too_large_count += 1
                    print(f"  ⚠ Warning: Still over {MAX_SIZE_KB}KB ({webp_size:.1f}KB)")
            else:
                fail_count += 1
        else:
            print(f"\n⚠ Image not found: {image}")
            fail_count += 1
    
    print("\n" + "="*70)
    print(f"Conversion complete:")
    print(f"  ✓ Under {MAX_SIZE_KB}KB: {success_count} images")
    print(f"  ⚠ Over {MAX_SIZE_KB}KB: {too_large_count} images")
    print(f"  ✗ Failed: {fail_count} images")
    
    if total_original > 0:
        total_savings = ((total_original - total_webp) / total_original) * 100
        print(f"\nTotal size reduction:")
        print(f"  {total_original:.1f}KB → {total_webp:.1f}KB ({total_savings:.1f}% smaller)")
        print(f"  Space saved: {total_original - total_webp:.1f}KB")
    
    print("="*70)
    
    if too_large_count > 0:
        print("\nNote: Some images are still over 200KB. Consider:")
        print("  - Further reducing max_width in IMAGE_CONFIGS")
        print("  - Using lower base quality (currently 75-80%)")
        print("  - Using more aggressive resizing for specific images")

if __name__ == "__main__":
    main()
