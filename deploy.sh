#!/usr/bin/env bash
# Manually trigger a Vercel production deployment.
# Run this from the repo root when the GitHub auto-deploy doesn't fire.
# Usage: bash deploy.sh

TOKEN=$(python3 -c "import json; print(json.load(open(r'C:\Users\bryan\AppData\Roaming\com.vercel.cli\Data\auth.json'))['token'])")

RESULT=$(curl -s -X POST "https://api.vercel.com/v13/deployments?teamId=team_7VwrjylCTvt300pqYvF7MGu5" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name":"zennify-accelerate","project":"prj_twZAK0AdSfyZNlbz2eCI48Ki6yBh","target":"production","gitSource":{"type":"github","org":"bryanbabb1","repo":"ZennifyAccelerate","ref":"main"}}')

STATE=$(echo "$RESULT" | python3 -c "import sys,json; d=json.load(sys.stdin); print(d.get('status', d.get('readyState','?')))")
ID=$(echo "$RESULT" | python3 -c "import sys,json; d=json.load(sys.stdin); print(d.get('id','?'))")

echo "Deployment triggered: $STATE (id: $ID)"
echo "Monitor at: https://vercel.com/bryanbabb-8196s-projects/zennify-accelerate"
