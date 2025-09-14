#!/bin/bash

# Step 1: Add and commit all changes
git add .
timestamp=$(date +"%Y-%m-%d %H:%M:%S")
git commit -m "Auto commit on $timestamp"

# Step 2: Push to GitHub
git push origin Master

# Step 3: Deploy to IPFS
ipfs_output=$(ipfs add -qr --pin=false --recursive ./quiet-reference-site)
cid=$(echo "$ipfs_output" | tail -n 1)

# Step 4: Save CID to file
echo "$cid" > cid.txt

# Step 5: Log CID with timestamp
echo "$timestamp – $cid" >> manifest.log

# Step 6: Display result
echo "✅ Site deployed to IPFS: https://ipfs.io/ipfs/$cid"
