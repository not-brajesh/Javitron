#!/usr/bin/env python3
"""
Generate responsive image sizes for srcset
Creates multiple sizes: 400w, 800w, 1200w for each image
Usage: python3 generate_responsive_images.py
"""

import os
from PIL import Image

ASSETS_DIR = "assets"
SIZES = [400, 800, 1200]  # Widths to generate
QUALITY = 75

# Images that need responsive sizes
IMAGES = [
    "image_1.png",   # Hero - needs all sizes
    "image_2.png",   # Hero - needs all sizes
    "image_3.png",   # Hero - needs all sizes
    "image_5.png",   # Showcase
    "image_6.png",   # Showcase
    "image_7.png",   # Showcase
    "image_8.png",   # Showcase
    "image_9.png",   # Team
    "image_10.png",  # Team
    "image_11.png",  # Team
    "image_12.png",  # Gallery
    "image_13.png",  # Gallery
    "image_14.png",  # Gallery
    "image_15.png",  # Team
    "image_16.png",  # Team
    "image_17.png",  # Team
]

def generate_responsive_sizes(image_path):
    """Generate multiple sizes for an image"""
    try:
        img = Image.open(image_path)
        original_width, original_height = img.size
        base_name = os.path.splitext(image_path)[0]
        
        print(f"\nProcessing: {image_path} ({original_width}x{original_height})")
        
        # Convert to RGB if necessary
        if img.mode in ('RGBA', 'LA', 'P'):
            background = Image.new('RGB', img.size, (255, 255, 255))
            if img.mode == 'P':
                img = img.convert('RGBA')
            if img.mode in ('RGBA', 'LA'):
                background.paste(img, mask=img.split()[-1])
                img = background
        elif img.mode != 'RGB':
            img = img.convert('RGB')
        
        generated_files = []
        
        for width in SIZES:
            # Skip if target width is larger than original
            if width >= original_width:
                # Just save optimized original size
                output_path = f"{base_name}.webp"
                if not os.path.exists(output_path):
                    img.save(output_path, 'WEBP', quality=QUALITY, method=6)
                    size_kb = os.path.getsize(output_path) / 1024
                    print(f"  ✓ {base_name}.webp ({original_width}w) - {size_kb:.1f}KB")
                    generated_files.append((output_path, original_width))
                continue
            
            # Calculate new height maintaining aspect ratio
            ratio = width / original_width
            new_height = int(original_height * ratio)
            
            # Resize image
            resized = img.resize((width, new_height), Image.LANCZOS)
            
            # Save with size suffix
            output_path = f"{base_name}_{width}.webp"
            resized.save(output_path, 'WEBP', quality=QUALITY, method=6)
            
            size_kb = os.path.getsize(output_path) / 1024
            print(f"  ✓ {base_name}_{width}.webp ({width}w) - {size_kb:.1f}KB")
            generated_files.append((output_path, width))
            
            # Also save original size as base WebP
            base_webp = f"{base_name}.webp"
            if not os.path.exists(base_webp):
                # Scale down original to max 1200px if it's too large
                if original_width > 1200:
                    ratio = 1200 / original_width
                    new_h = int(original_height * ratio)
                    orig_resized = img.resize((1200, new_h), Image.LANCZOS)
                    orig_resized.save(base_webp, 'WEBP', quality=QUALITY, method=6)
                else:
                    img.save(base_webp, 'WEBP', quality=QUALITY, method=6)
                base_size = os.path.getsize(base_webp) / 1024
                print(f"  ✓ {base_name}.webp (base) - {base_size:.1f}KB")
        
        return generated_files
        
    except Exception as e:
        print(f"  ✗ Failed: {e}")
        return []

def generate_html_srcset(base_name, widths):
    """Generate srcset attribute for HTML"""
    srcset_parts = [f"assets/{base_name}_{w}.webp {w}w" for w in widths if os.path.exists(f"assets/{base_name}_{w}.webp")]
    if os.path.exists(f"assets/{base_name}.webp"):
        # Get actual width of base image
        with Image.open(f"assets/{base_name}.webp") as img:
            base_width = img.size[0]
            srcset_parts.append(f"assets/{base_name}.webp {base_width}w")
    
    return ", ".join(srcset_parts)

def main():
    print("="*70)
    print("Generating Responsive Image Sizes")
    print("="*70)
    
    os.chdir(ASSETS_DIR)
    
    all_files = []
    total_original = 0
    total_generated = 0
    
    for image in IMAGES:
        if os.path.exists(image):
            original_size = os.path.getsize(image)
            total_original += original_size
            
            files = generate_responsive_sizes(image)
            all_files.extend(files)
            
            for f, _ in files:
                total_generated += os.path.getsize(f)
        else:
            print(f"\n⚠ Not found: {image}")
    
    print("\n" + "="*70)
    print(f"Generated {len(all_files)} responsive images")
    
    if total_original > 0:
        # Calculate size of largest version only (not sum of all)
        largest_total = sum(os.path.getsize(f[0]) for f in all_files if "_1200" in f[0] or ("_" not in f[0] and "400" not in f[0] and "800" not in f[0]))
        print(f"\nSize comparison (largest version per image):")
        print(f"  Original PNG: {total_original/1024:.1f}KB")
        print(f"  WebP versions: {largest_total/1024:.1f}KB")
        print(f"  Reduction: {((total_original - largest_total)/total_original)*100:.1f}%")
    
    print("\n" + "="*70)
    print("\nExample srcset for hero image:")
    print(f'  srcset="{generate_html_srcset("image_1", SIZES)}"')
    print("\nExample sizes attribute:")
    print('  sizes="(max-width: 600px) 400px, (max-width: 1200px) 800px, 1200px"')
    print("="*70)

if __name__ == "__main__":
    main()
