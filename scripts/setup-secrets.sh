#!/bin/bash
# AutomatikPOST — Configure Supabase secrets (run once)
# Execute: bash scripts/setup-secrets.sh

echo "🔗 Linking Supabase project..."
npx supabase link --project-ref wgghspuoffoedvkifacq

echo "🔑 Setting secrets..."
npx supabase secrets set \
  ANTHROPIC_API_KEY=SUA_CHAVE_ANTHROPIC_AQUI

echo "🗄️  Applying migrations..."
npx supabase db push

echo "⚡ Deploying Edge Functions..."
npx supabase functions deploy claude-proxy
npx supabase functions deploy wp-publish
npx supabase functions deploy wp-test

echo ""
echo "✅ Supabase pronto! Agora: vercel --prod"
