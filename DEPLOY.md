# AutomatikPOST — Deploy na Vercel

## ✅ Checklist completo (faça uma vez só)

### Passo 1 — Instalar dependências do projeto
```bash
npm install
```

### Passo 2 — Configurar variáveis locais
Edite o arquivo `.env.local` (já criado) — confirme que está correto:
```
VITE_SUPABASE_URL=https://wgghspuoffoedvkifacq.supabase.co
VITE_SUPABASE_ANON_KEY=sb_publishable_Sl9jHkDAsyHZf58mbWM6MA_qt5T9LYQ
VITE_SITE_URL=https://project-t4nju.vercel.app
```

### Passo 3 — Configurar Supabase (rodar UMA vez)
```bash
npm install -g supabase
bash scripts/setup-secrets.sh
```
Este script configura: API Key do Claude, banco de dados e Edge Functions.

### Passo 4 — Configurar Vercel (rodar UMA vez)
```bash
npm install -g vercel
vercel login
vercel link --project prj_BVNtQ4BcADI1Yqyj9DYCgGeepGWT

# Adicionar variáveis de ambiente na Vercel:
echo "https://wgghspuoffoedvkifacq.supabase.co" | vercel env add VITE_SUPABASE_URL production
echo "sb_publishable_Sl9jHkDAsyHZf58mbWM6MA_qt5T9LYQ" | vercel env add VITE_SUPABASE_ANON_KEY production
echo "https://project-t4nju.vercel.app" | vercel env add VITE_SITE_URL production
```

### Passo 5 — Deploy
```bash
vercel --prod
```

### Passo 6 — Supabase Auth (Dashboard)
1. Abrir https://supabase.com/dashboard → projeto AutomatikPost
2. Authentication → URL Configuration:
   - Site URL: `https://project-t4nju.vercel.app`
   - Redirect URLs: `https://project-t4nju.vercel.app/**`
3. Authentication → Providers → Google → ativar (precisa de Client ID do Google Cloud)
4. Authentication → Providers → Facebook → ativar (precisa de App ID do Meta)

---

## Deploy automático via Git (após configuração inicial)
```bash
git add .
git commit -m "feat: nova funcionalidade"
git push origin main
# Vercel detecta e faz deploy automático ✅
```
