// AutomatikPOST — File upload with preview + Supabase Storage
import { useState, useRef } from 'react'
import { useAuth } from '../../contexts/AuthContext.jsx'
import { uploadMedia } from '../../hooks/useDB.js'

const ACCEPT_IMAGE = 'image/jpeg,image/png,image/webp,image/gif'
const ACCEPT_ANY   = 'image/*,video/*,application/pdf'

export default function UploadZone({ onUploaded, accept = ACCEPT_ANY, maxMB = 50, label = 'Clique ou arraste um arquivo' }) {
  const { user } = useAuth()
  const inputRef  = useRef(null)
  const [dragging, setDragging]  = useState(false)
  const [uploading, setUploading] = useState(false)
  const [preview, setPreview]    = useState(null)
  const [progress, setProgress]  = useState(0)
  const [error, setError]        = useState('')

  const handleFile = async (file) => {
    if (!file) return
    if (file.size > maxMB * 1024 * 1024) { setError(`Arquivo muito grande. Máx: ${maxMB}MB`); return }
    setError('')
    if (file.type.startsWith('image/')) setPreview(URL.createObjectURL(file))
    setUploading(true); setProgress(30)

    try {
      // Simulate progress
      const t1 = setTimeout(() => setProgress(60), 300)
      const t2 = setTimeout(() => setProgress(90), 600)
      const media = await uploadMedia(file, user.id)
      clearTimeout(t1); clearTimeout(t2)
      setProgress(100)
      setTimeout(() => { setProgress(0); setUploading(false) }, 500)
      onUploaded?.(media)
    } catch (err) {
      setError(err.message)
      setUploading(false); setProgress(0)
    }
  }

  const onDrop = (e) => { e.preventDefault(); setDragging(false); handleFile(e.dataTransfer.files[0]) }

  return (
    <div>
      <div
        onClick={() => !uploading && inputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        style={{
          border: `2px dashed ${dragging ? '#1A56DB' : '#C4C6D0'}`,
          borderRadius: 12, padding: preview ? 8 : '24px 16px', textAlign: 'center',
          cursor: uploading ? 'wait' : 'pointer', transition: 'all .14s',
          background: dragging ? '#EEF2FA' : '#F3F6FD',
        }}>
        {preview
          ? <img src={preview} alt="preview" style={{ maxHeight: 180, maxWidth: '100%', borderRadius: 8, objectFit: 'cover' }} />
          : <>
            <div style={{ fontSize: 28, marginBottom: 6, opacity: .5 }}>🖼</div>
            <div style={{ fontSize: 13, color: '#44474F', marginBottom: 3 }}>{label}</div>
            <div style={{ fontSize: 11, color: '#74777F' }}>Máx {maxMB}MB · {accept.includes('video') ? 'Imagem, Vídeo, PDF' : 'Imagem'}</div>
          </>
        }
        <input ref={inputRef} type="file" accept={accept} style={{ display: 'none' }}
          onChange={e => handleFile(e.target.files[0])} />
      </div>
      {uploading && (
        <div style={{ marginTop: 8 }}>
          <div style={{ height: 5, background: '#E3EAF8', borderRadius: 99, overflow: 'hidden' }}>
            <div style={{ height: '100%', background: '#1A56DB', borderRadius: 99, width: `${progress}%`, transition: 'width .3s' }} />
          </div>
          <div style={{ fontSize: 11, color: '#74777F', marginTop: 4 }}>Enviando... {progress}%</div>
        </div>
      )}
      {error && <div style={{ fontSize: 12, color: '#BA1A1A', marginTop: 6 }}>⚠️ {error}</div>}
    </div>
  )
}
