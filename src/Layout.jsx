import { useState } from 'react';
import { C } from './lib/tokens.js';
import { NAV, TITLES } from './lib/nav.js';
import { NOTIFS } from './lib/data.js';
import NotifPanel from './components/Notifications/NotifPanel.jsx';

export default function Layout({ page, go, children, showToast }) {
  const [open, setOpen] = useState(true);
  const [notif, setNotif] = useState(false);
  const unread = NOTIFS.filter(n => !n.read).length;

  return (
    <div className="app" onClick={() => notif && setNotif(false)}>
      <nav className={`rail ${open ? 'open' : ''}`} onClick={e => e.stopPropagation()}>
        <div className="rl">
          <div className="li">A</div>
          <span className="lt">AutomatikPOST</span>
        </div>
        <div className="rail-scroll">
          {NAV.map((g, gi) => (
            <div key={gi} className="rsec">
              <div className="rsl">{g.label}</div>
              {g.items.map(item => (
                <div
                  key={item.id}
                  className={`ni ${page === item.id || (page === 'editor' && item.id === 'posts') ? 'a' : ''}`}
                  onClick={() => go(item.id)}
                >
                  <div className="niw">{item.i}</div>
                  <span className="nl">{item.l}</span>
                  {item.b && <span className="nbadge">{item.b}</span>}
                </div>
              ))}
              {gi < NAV.length - 1 && <div className="rdiv" />}
            </div>
          ))}
        </div>
        <div style={{ padding: '8px', width: '100%', borderTop: `1px solid ${C.ovV}`, flexShrink: 0 }}>
          <div className="ni" style={{ height: 42 }}>
            <div style={{ width: 26, height: 26, borderRadius: '50%', background: C.pC, color: C.onPC, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 700, flexShrink: 0 }}>A</div>
            <div style={{ opacity: open ? 1 : 0, transition: 'opacity .14s' }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: C.on, whiteSpace: 'nowrap' }}>Administrador</div>
              <div className="mono" style={{ fontSize: 9, color: C.onV }}>ADMIN</div>
            </div>
          </div>
        </div>
      </nav>

      <div className={`main ${open ? 'ro' : ''}`}>
        <div className="tb" onClick={e => e.stopPropagation()}>
          <button className="ib" onClick={() => setOpen(o => !o)}>☰</button>
          <span className="tbt">{TITLES[page] || page}</span>
          {page === 'ai' && <span className="chip cp" style={{ fontSize: 11 }}>⚡ Claude AI</span>}
          <div style={{ flex: 1 }} />
          <div style={{ position: 'relative' }}>
            <button className="ib" onClick={() => setNotif(o => !o)} style={{ position: 'relative' }}>
              🔔
              {unread > 0 && <span style={{ position: 'absolute', top: 5, right: 5, width: 6, height: 6, borderRadius: '50%', background: C.err }} />}
            </button>
            {notif && <NotifPanel onClose={() => setNotif(false)} />}
          </div>
          <div style={{ width: 1, height: 18, background: C.ovV, margin: '0 3px' }} />
          <button className="btn bf bsm" onClick={() => go('create')}>✍️ Criar Post</button>
        </div>
        <div className="pg">{children}</div>
      </div>

      <button className="fab" onClick={() => go('create')}>✍️ <span>Novo Post</span></button>
    </div>
  );
}
