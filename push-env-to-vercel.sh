#!/usr/bin/env bash
#
# Push every var from .env.local to all 3 Vercel environments.
# Idempotent: rm-then-add so re-running this picks up any rotated values.
#
# Usage:
#   ./push-env-to-vercel.sh
#
# Requires: vercel CLI installed and `vercel link` already run.

set -euo pipefail

if [ ! -f .env.local ]; then
  echo "❌ .env.local not found in $(pwd)"
  exit 1
fi

if [ ! -d .vercel ]; then
  echo "❌ .vercel/ not found. Run 'vercel link' first."
  exit 1
fi

# Load .env.local into the current shell (set -a auto-exports sourced vars).
set -a
# shellcheck disable=SC1091
source .env.local
set +a

VARS=(
  BIGQUERY_CREDENTIALS_JSON
  BIGQUERY_PROJECT_ID
  BIGQUERY_DATASET_ID
  GHOST_ADMIN_API_KEY
  GHOST_API_URL
  RESEND_API_KEY
  RESEND_FROM_EMAIL
  TOOL_DOWNLOAD_TOKEN_SECRET
  NEXT_PUBLIC_MIXPANEL_TOKEN
  NEXT_PUBLIC_SITE_URL
  # Ask Ansh's AI. A key missing from this list works locally and 500s in
  # production - that is the single most common way to break this feature.
  ANTHROPIC_API_KEY
  GHOST_CONTENT_API_KEY
  VOYAGE_API_KEY
  APIFY_TOKEN
  APIFY_LINKEDIN_ACTOR_ID
  KB_GDOC_ID
  CRON_SECRET
  KB_SYNC_REPORT_TO
)

ENVIRONMENTS=(production preview development)

for var in "${VARS[@]}"; do
  value="${!var:-}"
  if [ -z "$value" ]; then
    echo "⚠  $var is empty in .env.local, skipping"
    continue
  fi

  for env in "${ENVIRONMENTS[@]}"; do
    # Remove any existing value so `add` doesn't prompt to overwrite.
    vercel env rm "$var" "$env" --yes >/dev/null 2>&1 || true

    # Pipe the value as stdin (avoids appearing in `ps` output).
    printf '%s' "$value" | vercel env add "$var" "$env" >/dev/null

    echo "✓  $var → $env"
  done
done

echo ""
echo "Done. All env vars pushed to Vercel (production, preview, development)."
echo "Run 'vercel env ls' to verify, or 'vercel deploy' to trigger a build."
