#!/usr/bin/env bash

# Usage:
#   DNSIMPLE_TOKEN=<token> DNSIMPLE_ACCOUNT_ID=<account_id> ./dnslink.sh <zone> <cid>

set -euo pipefail

ZONE="$1"
CID="$2"

if [[ -z "${DNSIMPLE_TOKEN:-}" || -z "${DNSIMPLE_ACCOUNT_ID:-}" || -z "$ZONE" || -z "$CID" ]]; then
  echo "Usage: DNSIMPLE_TOKEN=<token> DNSIMPLE_ACCOUNT_ID=<id> ./dnslink.sh <zone> <cid>"
  exit 1
fi

BASE="https://api.dnsimple.com/v2/$DNSIMPLE_ACCOUNT_ID/zones/$ZONE/records"
AUTH=(-H "Authorization: Bearer $DNSIMPLE_TOKEN" -H "Accept: application/json")
RECORD_NAME="_dnslink"
TTL=120
CONTENT="dnslink=/ipfs/$CID"

record_id=$(
  curl -s "${AUTH[@]}" "$BASE?name=$RECORD_NAME&type=TXT" \
    | jq -r '.data[0].id // empty'
)

if [[ -z "$record_id" ]]; then
  curl -s -X POST "${AUTH[@]}" -H "Content-Type: application/json" \
    -d "{\"name\":\"$RECORD_NAME\",\"type\":\"TXT\",\"content\":\"$CONTENT\",\"ttl\":$TTL}" \
    "$BASE" | jq -r '.data.id'
else
  curl -s -X PATCH "${AUTH[@]}" -H "Content-Type: application/json" \
    -d "{\"content\":\"$CONTENT\",\"ttl\":$TTL}" \
    "$BASE/$record_id" | jq -r '.data.id'
fi

echo "Done: https://ipfs.io/ipns/$ZONE"
