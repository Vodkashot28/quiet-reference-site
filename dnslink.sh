#!/usr/bin/env bash

# Usage:
#   DNSIMPLE_TOKEN=<token> ./dnslink.sh <domain> <hash>

set -e

ZONE="$1"
HASH="$2"

if [[ -z "$DNSIMPLE_TOKEN" || -z "$ZONE" || -z "$HASH" ]]; then
  echo "Usage: DNSIMPLE_TOKEN=<token> ./dnslink.sh <domain> <hash>"
  exit 1
fi

RECORD_NAME="_dnslink"
RECORD_TTL=120

# Look up existing record ID
record_id=$(
  curl -s "https://api.dnsimple.com/v1/domains/$ZONE/records?name=$RECORD_NAME&type=TXT" \
    -H "X-DNSimple-Domain-Token: $DNSIMPLE_TOKEN" \
    -H "Accept: application/json" \
    | jq -r '.[0].id'
)

if [[ -z "$record_id" || "$record_id" == "null" ]]; then
  # Create new record
  curl -s -X POST "https://api.dnsimple.com/v1/domains/$ZONE/records" \
    -H "X-DNSimple-Domain-Token: $DNSIMPLE_TOKEN" \
    -H "Accept: application/json" \
    -H "Content-Type: application/json" \
    -d "{\"record\":{ \"name\":\"$RECORD_NAME\", \"record_type\":\"TXT\", \"content\":\"dnslink=/ipfs/$HASH\", \"ttl\":$RECORD_TTL }}" \
    | jq -r '.id'
  printf "\nIt looks like we're good: https://ipfs.io/ipns/$ZONE\n"
else
  # Update existing record
  curl -s -X PUT "https://api.dnsimple.com/v1/domains/$ZONE/records/$record_id" \
    -H "X-DNSimple-Domain-Token: $DNSIMPLE_TOKEN" \
    -H "Accept: application/json" \
    -H "Content-Type: application/json" \
    -d "{\"record\":{ \"content\":\"dnslink=/ipfs/$HASH\", \"name\":\"$RECORD_NAME\", \"ttl\":$RECORD_TTL }}" \
    | jq -r '.id'
  printf "\nIt looks like we're good: https://ipfs.io/ipns/$ZONE\n"
fi
