import { useState } from 'react'
import { useAuth } from '../../contexts/AuthContext.jsx'

const S = {
  page: { minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', background:'#F3F6FD', fontFamily:"'Plus Jakarta Sans',sans-serif" },
  card: { background:'#fff', borderRadius:24, width:420, maxWidth:'95vw', padding:40, boxShadow:'0 8px 40px rgba(0,0,0,.10)' },
  logo: { width:44, height:44, borderRadius:12, background:'#1A56DB', color:'#fff', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:800, fontSize:18, marginBottom:18 },
  h1: { fontSize:22, fontWeight:800, marginBottom:6 },
  sub: { fontSize:13, color:'#74777F', marginBottom:28, lineHeight:1.5 },
  lbl: { display:'block', fontSize:11, fontWeight:700, color:'#44474F', marginBottom:5, textTransform:'uppercase', letterSpacing:.2 },
  inp: { width:'100%', background:'#EEF2FA', border:'1.5px solid #C4C6D0', borderRadius:10, padding:'10px 13px', fontSize:13, fontFamily:"'Plus Jakarta Sans',sans-serif", outline:'none', marginBottom:14, transition:'border .14s, box-shadow .14s', boxSizing:'border-box' },
  btn: { width:'100%', padding:13, borderRadius:999, border:'none', background:'#1A56DB', color:'#fff', fontSize:14, fontWeight:700, cursor:'pointer', fontFamily:"'Plus Jakarta Sans',sans-serif", transition:'filter .14s', marginTop:4 },
  err: { background:'#FFDAD6', color:'#BA1A1A', borderRadius:9, padding:'9px 12px', fontSize:12, marginBottom:14, lineHeight:1.5 },
  ok:  { background:'#BFFFF5', color:'#002019', borderRadius:9, padding:'9px 12px', fontSize:12, marginBottom:14, lineHeight:1.5 },
  link: { color:'#1A56DB', cursor:'pointer', fontWeight:600, fontSize:12, textDecoration:'none', background:'none', border:'none', fontFamily:"'Plus Jakarta Sans',sans-serif' }" },
  tabs: { display:'flex', gap:0, marginBottom:28, background:'#EEF2FA', borderRadius:10, padding:4 },
  tab:  { flex:1, padding:'8px 0', textAlign:'center', borderRadius:7, fontSize:13, fontWeight:600, cursor:'pointer', transition:'all .14s', border:'none', fontFamily:"'Plus Jakarta Sans',sans-serif", background:'transparent', color:'#44474F' },
}

export default function LoginPage() {
  const { signIn, signUp, resetPassword } = useAuth()
  const [mode, setMode]   = useState('login')  // 'login' | 'signup' | 'forgot'
  const [email, setEmail] = useState('')
  const [pass,  setPass]  = useState('')
  const [name,  setName]  = useState('')
  const [err,   setErr]   = useState('')
  const [ok,    setOk]    = useState('')
  const [busy,  setBusy]  = useState(false)

  const handle = async (e) => {
    e.preventDefault()
    setErr(''); setOk(''); setBusy(true)
    try {
      if (mode === 'login')  await signIn(email, pass)
      if (mode === 'signup') { await signUp(email, pass, name); setOk('Conta criada! Verifique seu e-mail para confirmar.') }
      if (mode === 'forgot') { await resetPassword(email); setOk('Link de recuperação enviado para seu e-mail.') }
    } catch (e) {
      const msgs = {
        'Invalid login credentials': 'E-mail ou senha incorretos.',
        'Email not confirmed': 'Confirme seu e-mail antes de entrar.',
        'User already registered': 'Este e-mail já está cadastrado.',
        'Password should be at least 6 characters': 'A senha deve ter ao menos 6 caracteres.',
      }
      setErr(msgs[e.message] || e.message)
    } finally { setBusy(false) }
  }

  return (
    <div style={S.page}>
      <div style={S.card}>
        <div style={S.logo}>A</div>
        <div style={S.h1}>AutomatikPOST</div>
        <div style={S.sub}>
          {mode === 'login'  && 'Entre para gerenciar seu conteúdo com IA.'}
          {mode === 'signup' && 'Crie sua conta gratuitamente.'}
          {mode === 'forgot' && 'Recupere o acesso à sua conta.'}
        </div>

        {mode !== 'forgot' && (
          <div style={S.tabs}>
            {[['login','Entrar'],['signup','Criar conta']].map(([m,l]) => (
              <button key={m} style={{...S.tab, ...(mode===m ? {background:'#fff', color:'#1A56DB', boxShadow:'0 1px 4px rgba(0,0,0,.1)'} : {})}}
                onClick={() => { setMode(m); setErr(''); setOk('') }}>{l}</button>
            ))}
          </div>
        )}

        {err && <div style={S.err}>⚠️ {err}</div>}
        {ok  && <div style={S.ok}>✅ {ok}</div>}

        <form onSubmit={handle}>
          {mode === 'signup' && (
            <div><label style={S.lbl}>Nome completo</label>
              <input style={S.inp} type="text" placeholder="Ana Lima" value={name} onChange={e=>setName(e.target.value)} required
                onFocus={e=>{e.target.style.borderColor='#1A56DB';e.target.style.boxShadow='0 0 0 3px #D9E4FF'}}
                onBlur={e=>{e.target.style.borderColor='#C4C6D0';e.target.style.boxShadow='none'}}/>
            </div>
          )}
          <div><label style={S.lbl}>E-mail</label>
            <input style={S.inp} type="email" placeholder="voce@empresa.com" value={email} onChange={e=>setEmail(e.target.value)} required
              onFocus={e=>{e.target.style.borderColor='#1A56DB';e.target.style.boxShadow='0 0 0 3px #D9E4FF'}}
              onBlur={e=>{e.target.style.borderColor='#C4C6D0';e.target.style.boxShadow='none'}}/>
          </div>
          {mode !== 'forgot' && (
            <div><label style={S.lbl}>Senha</label>
              <input style={S.inp} type="password" placeholder={mode==='signup'?'Mínimo 6 caracteres':'••••••••'} value={pass} onChange={e=>setPass(e.target.value)} required minLength={6}
                onFocus={e=>{e.target.style.borderColor='#1A56DB';e.target.style.boxShadow='0 0 0 3px #D9E4FF'}}
                onBlur={e=>{e.target.style.borderColor='#C4C6D0';e.target.style.boxShadow='none'}}/>
            </div>
          )}
          <button style={{...S.btn, opacity:busy?.6:1}} disabled={busy} type="submit"
            onMouseEnter={e=>e.target.style.filter='brightness(1.08)'}
            onMouseLeave={e=>e.target.style.filter='none'}>
            {busy ? '⏳ Aguarde...' : mode==='login' ? '→ Entrar' : mode==='signup' ? '→ Criar conta' : '→ Enviar link'}
          </button>
        </form>

        <div style={{ marginTop:18, textAlign:'center', fontSize:12, color:'#74777F' }}>
          {mode === 'login' && (
            <><button style={S.link} onClick={()=>{setMode('forgot');setErr('');setOk('')}}>Esqueci minha senha</button></>
          )}
          {mode === 'forgot' && (
            <button style={S.link} onClick={()=>{setMode('login');setErr('');setOk('')}}>← Voltar ao login</button>
          )}
        </div>
      </div>
    </div>
  )
}
