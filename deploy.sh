#!/bin/bash

# Start IPFS daemon in background
ipfs daemon &

# Wait for IPFS to initialize
sleep 10

# Timestamp for logging
timestamp=$(date +"%Y-%m-%d %H:%M:%S")

# Step 1: Git commit and push
git add .
git commit -m "Auto commit on $timestamp"
git push origin Master

# Step 2: Add site folder to IPFS and capture output
ipfs add -qr ~/quiet-reference-site > ipfs_output.txt
cid=$(tail -n 1 ipfs_output.txt)
echo "$cid" > cid.txt

# Step 3: Log deployment to manifest.log
echo "$timestamp — $cid" >> manifest.log
echo "Commit: Auto commit on $timestamp" >> manifest.log
echo "Update: Anchored site with refined layout and emotional clarity." >> manifest.log
echo "Domain: quietreference.xyz" >> manifest.log
echo "Note: This version holds space for truth without spectacle." >> manifest.log
echo "" >> manifest.log

# Step 4: Display result
echo "✅ Site deployed to IPFS:"
echo "🔗 https://ipfs.io/ipfs/$cid"
