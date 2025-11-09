#!/bin/bash

# Video Compression Script for WebM Files
# This script compresses all .webm files in public/videos/ directory
# Target: 2-3 Mbps bitrate with VP9 codec

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if FFmpeg is installed
if ! command -v ffmpeg &> /dev/null; then
    echo -e "${RED}Error: FFmpeg is not installed.${NC}"
    echo "Please install FFmpeg first:"
    echo "  Windows: Download from https://ffmpeg.org/download.html"
    echo "  Mac: brew install ffmpeg"
    echo "  Linux: sudo apt-get install ffmpeg"
    exit 1
fi

# Create backup directory
BACKUP_DIR="public/videos/backup_$(date +%Y%m%d_%H%M%S)"
mkdir -p "$BACKUP_DIR"

echo -e "${YELLOW}Creating backup of original videos...${NC}"
cp public/videos/*.webm "$BACKUP_DIR/" 2>/dev/null || true
echo -e "${GREEN}Backup created in: $BACKUP_DIR${NC}"

# Compression settings
BITRATE="2500k"  # 2.5 Mbps target bitrate
CRF="32"         # Constant Rate Factor (lower = better quality, higher = smaller size)
PRESET="slow"    # Encoding preset (slower = better compression)

# Counter
TOTAL=$(find public/videos -name "*.webm" -not -path "*/backup_*/*" | wc -l)
COUNT=0

echo -e "${YELLOW}Starting compression of $TOTAL video files...${NC}"
echo ""

# Process each .webm file
find public/videos -name "*.webm" -not -path "*/backup_*/*" | while read -r video; do
    COUNT=$((COUNT + 1))
    filename=$(basename "$video")
    temp_file="${video}.compressed"
    
    echo -e "${YELLOW}[$COUNT/$TOTAL] Compressing: $filename${NC}"
    
    # Two-pass encoding for optimal quality/size ratio
    # Pass 1: Analyze
    ffmpeg -i "$video" \
        -c:v libvpx-vp9 \
        -b:v "$BITRATE" \
        -crf "$CRF" \
        -pass 1 \
        -an \
        -f null \
        /dev/null 2>/dev/null
    
    # Pass 2: Encode
    ffmpeg -i "$video" \
        -c:v libvpx-vp9 \
        -b:v "$BITRATE" \
        -crf "$CRF" \
        -pass 2 \
        -preset "$PRESET" \
        -c:a libopus \
        -b:a 128k \
        -y \
        "$temp_file" 2>/dev/null
    
    if [ -f "$temp_file" ]; then
        # Get original and new sizes
        ORIGINAL_SIZE=$(stat -f%z "$video" 2>/dev/null || stat -c%s "$video" 2>/dev/null)
        NEW_SIZE=$(stat -f%z "$temp_file" 2>/dev/null || stat -c%s "$temp_file" 2>/dev/null)
        
        # Calculate reduction percentage
        if [ "$ORIGINAL_SIZE" -gt 0 ]; then
            REDUCTION=$((100 - (NEW_SIZE * 100 / ORIGINAL_SIZE)))
            ORIGINAL_MB=$((ORIGINAL_SIZE / 1024 / 1024))
            NEW_MB=$((NEW_SIZE / 1024 / 1024))
            
            echo -e "${GREEN}✓ Compressed: ${ORIGINAL_MB}MB → ${NEW_MB}MB (${REDUCTION}% reduction)${NC}"
            
            # Replace original with compressed version
            mv "$temp_file" "$video"
        else
            echo -e "${RED}✗ Error compressing $filename${NC}"
            rm -f "$temp_file"
        fi
    else
        echo -e "${RED}✗ Failed to compress $filename${NC}"
    fi
    
    # Clean up pass log files
    rm -f ffmpeg2pass-*.log 2>/dev/null
    
    echo ""
done

echo -e "${GREEN}Compression complete!${NC}"
echo -e "${YELLOW}Original videos backed up in: $BACKUP_DIR${NC}"
echo ""
echo "Next steps:"
echo "1. Test the compressed videos in your browser"
echo "2. If quality is acceptable, you can delete the backup folder"
echo "3. If quality is too low, restore from backup and adjust CRF/BITRATE settings"

