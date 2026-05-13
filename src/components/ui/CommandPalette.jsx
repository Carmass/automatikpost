// AutomatikPOST — Command Palette (Cmd+K)
import { useState, useEffect, useRef } from 'react'

const ACTIONS = [
  { id:'posts',        label:'Posts',          icon:'📄', cat:'Páginas' },
  { id:'editor',       label:'Novo post',       icon:'✍️', cat:'Ações',  data:{} },
  { id:'ai',           label:'Produtor IA',     icon:'✨', cat:'Páginas' },
  { id:'calendar',     label:'Calendário',      icon:'📅', cat:'Páginas' },
  { id:'performance',  label:'Performance',     icon:'📊', cat:'Páginas' },
  { id:'wordpress',    label:'WordPress',       icon:'⊞', cat:'Páginas' },
  { id:'automations',  label:'Automações',      icon:'⚡', cat:'Páginas' },
  { id:'templates',    label:'Templates',       icon:'📋', cat:'Páginas' },
  { id:'contentbrief', label:'Content Brief',   icon:'📋', cat:'IA' },
  { id:'seodeep',      label:'SEO Profundo',    icon:'🔍', cat:'IA' },
  { id:'abtest',       label:'Testes A/B',      icon:'🔬', cat:'IA' },
  { id:'repurpose',    label:'Repurposing',     icon:'♻️', cat:'IA' },
  { id:'contentgap',   label:'Content Gap',     icon:'🕳', cat:'IA' },
  { id:'settings',     label:'Configurações',   icon:'⚙️', cat:'Admin' },
  { id:'admin',        label:'Painel Admin',    icon:'🛡', cat:'Admin' },
  { id:'backup',       label:'Backup',          icon:'💾', cat:'Admin' },
  { id:'support',      label:'Suporte',         icon:'💬', cat:'Admin' },
]

export default function CommandPalette({ go, onClose }) {
  const [query, setQuery] = useState('')
  const [sel,   setSel]   = useState(0)
  const inputRef = useRef(null)

  useEffect(() => { inputRef.current?.focus() }, [])

  const filtered = ACTIONS.filter(a =>
    a.label.toLowerCase().includes(query.toLowerCase()) ||
    a.cat.toLowerCase().includes(query.toLowerCase())
  )

  useEffect(() => { setSel(0) }, [query])

  const exec = (action) => {
    go(action.id, action.data ?? null)
    onClose()
  }

  const onKey = (e) => {
    if (e.key === 'ArrowDown')  { e.preventDefault(); setSel(s => Math.min(s+1, filtered.length-1)) }
    if (e.key === 'ArrowUp')    { e.preventDefault(); setSel(s => Math.max(s-1, 0)) }
    if (e.key === 'Enter')      { if (filtered[sel]) exec(filtered[sel]) }
    if (e.key === 'Escape')     onClose()
  }

  const grouped = filtered.reduce((acc, a) => {
    if (!acc[a.cat]) acc[a.cat] = []
    acc[a.cat].push(a)
    return acc
  }, {})

  return (
    <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,.5)', zIndex:999, display:'flex', alignItems:'flex-start', justifyContent:'center', paddingTop:80 }}
      onClick={onClose}>
      <div style={{ background:'#fff', borderRadius:16, width:560, maxWidth:'95vw', boxShadow:'0 24px 64px rgba(0,0,0,.25)', overflow:'hidden', fontFamily:"'Plus Jakarta Sans',sans-serif" }}
        onClick={e=>e.stopPropagation()}>
        <div style={{ padding:'10px 14px', borderBottom:'1px solid #E3EAF8', display:'flex', alignItems:'center', gap:9 }}>
          <span style={{ fontSize:16, opacity:.5 }}>🔍</span>
          <input ref={inputRef} value={query} onChange={e=>setQuery(e.target.value)} onKeyDown={onKey}
            placeholder="Buscar páginas e ações..." autoComplete="off"
            style={{ flex:1, border:'none', outline:'none', fontSize:14, fontFamily:"'Plus Jakarta Sans',sans-serif", background:'transparent', color:'#1A1C20' }}/>
          <kbd style={{ fontSize:11, padding:'2px 7px', background:'#EEF2FA', borderRadius:5, color:'#74777F', border:'1px solid #C4C6D0' }}>Esc</kbd>
        </div>
        <div style={{ maxHeight:380, overflowY:'auto', padding:'6px 0' }}>
          {filtered.length === 0 && (
            <div style={{ padding:'20px', textAlign:'center', color:'#74777F', fontSize:13 }}>Nenhum resultado para "{query}"</div>
          )}
          {Object.entries(grouped).map(([cat, items]) => (
            <div key={cat}>
              <div style={{ fontSize:10, fontWeight:700, color:'#74777F', textTransform:'uppercase', letterSpacing:.5, padding:'8px 14px 4px' }}>{cat}</div>
              {items.map((a, i) => {
                const globalIdx = filtered.indexOf(a)
                const active    = globalIdx === sel
                return (
                  <div key={a.id}
                    style={{ display:'flex', alignItems:'center', gap:11, padding:'9px 14px', cursor:'pointer', background: active ? '#EEF2FA' : 'transparent', transition:'background .1s' }}
                    onMouseEnter={() => setSel(globalIdx)}
                    onClick={() => exec(a)}>
                    <span style={{ fontSize:16, width:22, textAlign:'center', flexShrink:0 }}>{a.icon}</span>
                    <span style={{ fontSize:13, fontWeight: active ? 600 : 400, flex:1 }}>{a.label}</span>
                    {active && <kbd style={{ fontSize:10, padding:'1px 6px', background:'#D9E4FF', borderRadius:4, color:'#1A56DB' }}>↵</kbd>}
                  </div>
                )
              })}
            </div>
          ))}
        </div>
        <div style={{ padding:'6px 14px', borderTop:'1px solid #E3EAF8', display:'flex', gap:12, fontSize:11, color:'#74777F' }}>
          <span>↑↓ navegar</span><span>↵ abrir</span><span>Esc fechar</span>
        </div>
      </div>
    </div>
  )
}
