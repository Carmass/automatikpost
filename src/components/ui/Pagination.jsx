// AutomatikPOST — Reusable Pagination component
import { useMemo } from 'react'

export function usePagination(items, perPage = 20) {
  const [page, setPage] = useState(1)
  const total = Math.ceil(items.length / perPage)
  const paginated = useMemo(() => items.slice((page-1)*perPage, page*perPage), [items, page, perPage])
  return { page, setPage, total, paginated, perPage, totalItems: items.length }
}

export default function Pagination({ page, total, onPage, perPage, totalItems }) {
  if (total <= 1) return null
  const C_P = '#1A56DB', C_S = '#EEF2FA', C_T = '#74777F'
  const pages = []
  for (let i = 1; i <= total; i++) {
    if (i === 1 || i === total || Math.abs(i - page) <= 1) pages.push(i)
    else if (pages[pages.length-1] !== '…') pages.push('…')
  }
  return (
    <div style={{ display:'flex', alignItems:'center', gap:4, padding:'14px 0', justifyContent:'center', fontFamily:"'Plus Jakarta Sans',sans-serif" }}>
      <span style={{ fontSize:12, color:C_T, marginRight:8 }}>
        {(page-1)*perPage + 1}–{Math.min(page*perPage, totalItems)} de {totalItems}
      </span>
      <PBtn label="←" disabled={page<=1} onClick={()=>onPage(page-1)} />
      {pages.map((p,i) => (
        p === '…'
          ? <span key={`e${i}`} style={{ padding:'0 4px', color:C_T, fontSize:13 }}>…</span>
          : <PBtn key={p} label={p} active={p===page} onClick={()=>onPage(p)} />
      ))}
      <PBtn label="→" disabled={page>=total} onClick={()=>onPage(page+1)} />
    </div>
  )
}

function PBtn({ label, active, disabled, onClick }) {
  const C_P = '#1A56DB'
  return (
    <button onClick={onClick} disabled={disabled}
      style={{ minWidth:30, height:30, borderRadius:7, border:`1.5px solid ${active?C_P:'#C4C6D0'}`, background: active ? C_P : 'transparent', color: active ? '#fff' : disabled ? '#C4C6D0' : '#1A1C20', cursor: disabled ? 'not-allowed' : 'pointer', fontFamily:"'Plus Jakarta Sans',sans-serif", fontSize:13, fontWeight: active ? 700 : 400, transition:'all .12s' }}>
      {label}
    </button>
  )
}
