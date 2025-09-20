#!/bin/bash

# Get absolute paths
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
SITE_DIR="$SCRIPT_DIR/.."

# Start IPFS daemon in background if not already running
if ! pgrep -x "ipfs" > /dev/null; then
  echo "Starting IPFS daemon..."
  ipfs daemon &
  sleep 10
else
  echo "IPFS daemon already running."
fi

# Timestamp for logging
timestamp=$(date +"%Y-%m-%d %H:%M:%S")

# Step 1: Git commit and push
cd "$SITE_DIR"
git add .
git commit -m "Auto commit on $timestamp"
git push origin Master

# Step 2: Add site folder to IPFS and capture output
echo "Adding site to IPFS..."
ipfs add -qr "$SITE_DIR" --ignore deploy > "$SCRIPT_DIR/ipfs_output.txt"
cid=$(tail -n 1 "$SCRIPT_DIR/ipfs_output.txt")
echo "$cid" > "$SCRIPT_DIR/cid.txt"

# Step 3: Log deployment to manifest.log
{
  echo "$timestamp — $cid"
  echo "Commit: Auto commit on $timestamp"
  echo "Update: Anchored site with refined layout and emotional clarity."
  echo "Domain: quietreference.xyz"
  echo "Note: This version holds space for truth without spectacle."
  echo ""
} >> "$SCRIPT_DIR/manifest.log"

# Step 4: Display result
echo "✅ Site deployed to IPFS:"
echo "🔗 https://ipfs.io/ipfs/$cid"

