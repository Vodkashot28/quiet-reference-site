#!/bin/bash

# ─── Setup Paths ────────────────────────────────────────────────────────────────
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
SITE_DIR="$SCRIPT_DIR/.."

# ─── Start IPFS Daemon if Not Running ───────────────────────────────────────────
if ! pgrep -x "ipfs" > /dev/null; then
  echo "Starting IPFS daemon..."
  ipfs daemon &
  sleep 10
else
  echo "IPFS daemon already running."
fi

# ─── Timestamp for Logging ──────────────────────────────────────────────────────
timestamp=$(date +"%Y-%m-%d %H:%M:%S")

# ─── Step 1: Git Commit and Push ────────────────────────────────────────────────
cd "$SITE_DIR"
git add .
git commit -m "Auto commit on $timestamp"
git push origin Master

# ─── Step 2: Add Site to IPFS (CIDv1) ────────────────────────────────────────────
echo "Adding site to IPFS..."
ipfs add -qr --cid-version=1 --hash=sha2-256 "$SITE_DIR" --ignore deploy > "$SCRIPT_DIR/ipfs_output.txt"
cid=$(tail -n 1 "$SCRIPT_DIR/ipfs_output.txt")
echo "$cid" > "$SCRIPT_DIR/cid.txt"

# ─── Step 3: Publish to IPNS ────────────────────────────────────────────────────
echo "Publishing to IPNS..."
ipns_publish=$(ipfs name publish /ipfs/$cid)
ipns_id=$(echo "$ipns_publish" | awk '{print $3}')

# ─── Step 4: Log to Manifest ────────────────────────────────────────────────────
{
  echo "$timestamp — $cid"
  echo "Commit: Auto commit on $timestamp"
  echo "Update: Anchored site with refined layout and emotional clarity."
  echo "Domain: quietreference.xyz"
  echo "IPNS: $ipns_id"
  echo "Note: This version holds space for truth without spectacle."
  echo ""
} >> "$SCRIPT_DIR/manifest.log"

# ─── Step 5: Display Result ─────────────────────────────────────────────────────
echo "✅ Site deployed to IPFS:"
echo "🔗 https://ipfs.io/ipfs/$cid"
echo "🔗 https://ipfs.io/ipns/$ipns_id"
