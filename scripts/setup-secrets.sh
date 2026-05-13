#!/bin/bash
# AutomatikPOST — Configure Supabase secrets (run once)
# Execute: bash scripts/setup-secrets.sh

# Load key from gitignored .env.secrets
if [ -f "$(dirname "$0")/../.env.secrets" ]; then
  source "$(dirname "$0")/../.env.secrets"
else
  echo "❌ .env.secrets não encontrado. Crie o arquivo com ANTHROPIC_API_KEY=..."
  exit 1
fi

echo "🔗 Linking Supabase project..."
npx supabase link --project-ref wgghspuoffoedvkifacq

echo "🔑 Setting secrets..."
npx supabase secrets set ANTHROPIC_API_KEY="$ANTHROPIC_API_KEY"

echo "🗄️  Applying migrations..."
npx supabase db push

echo "⚡ Deploying Edge Functions..."
npx supabase functions deploy claude-proxy
npx supabase functions deploy wp-publish
npx supabase functions deploy wp-test

echo ""
echo "✅ Supabase pronto!"
