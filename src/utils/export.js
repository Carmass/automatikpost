// AutomatikPOST — Export utilities
// PDF: jsPDF + jspdf-autotable
// CSV: PapaParse
// XLSX: SheetJS

// ── PDF ──────────────────────────────────────────────────────
export async function exportPDF(title, columns, rows, filename) {
  const { default: jsPDF } = await import('jspdf')
  const { default: autoTable } = await import('jspdf-autotable')

  const doc = new jsPDF({ orientation: rows.length > 20 ? 'l' : 'p', unit: 'mm', format: 'a4' })

  // Header
  doc.setFillColor(26, 86, 219)
  doc.rect(0, 0, 300, 18, 'F')
  doc.setTextColor(255, 255, 255)
  doc.setFontSize(13)
  doc.setFont('helvetica', 'bold')
  doc.text('AutomatikPOST', 10, 12)
  doc.setFontSize(10)
  doc.text(title, 10, 24)
  doc.setTextColor(100, 100, 100)
  doc.setFontSize(8)
  doc.text(`Gerado em: ${new Date().toLocaleString('pt-BR')}`, 10, 30)

  autoTable(doc, {
    startY: 35,
    head: [columns.map(c => c.label)],
    body: rows.map(row => columns.map(c => row[c.key] ?? '—')),
    styles: { fontSize: 9, cellPadding: 3 },
    headStyles: { fillColor: [26, 86, 219], textColor: 255, fontStyle: 'bold' },
    alternateRowStyles: { fillColor: [238, 242, 250] },
  })

  doc.save(filename || `${title.replace(/\s+/g, '-').toLowerCase()}.pdf`)
}

// ── CSV ──────────────────────────────────────────────────────
export async function exportCSV(columns, rows, filename) {
  const { default: Papa } = await import('papaparse')
  const data = rows.map(row => {
    const obj = {}
    columns.forEach(c => { obj[c.label] = row[c.key] ?? '' })
    return obj
  })
  const csv = Papa.unparse(data, { header: true })
  const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' })  // BOM for Excel UTF-8
  downloadBlob(blob, filename || 'export.csv')
}

// ── XLSX ─────────────────────────────────────────────────────
export async function exportXLSX(sheets, filename) {
  // sheets = [{ name, columns, rows }]
  const XLSX = await import('xlsx')
  const wb = XLSX.utils.book_new()
  for (const { name, columns, rows } of sheets) {
    const wsData = [
      columns.map(c => c.label),
      ...rows.map(row => columns.map(c => row[c.key] ?? ''))
    ]
    const ws = XLSX.utils.aoa_to_sheet(wsData)
    // Column widths
    ws['!cols'] = columns.map(() => ({ wch: 22 }))
    XLSX.utils.book_append_sheet(wb, ws, name.slice(0, 31))
  }
  XLSX.writeFile(wb, filename || 'export.xlsx')
}

// ── Helper ───────────────────────────────────────────────────
function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url; a.download = filename
  document.body.appendChild(a)
  a.click()
  setTimeout(() => { document.body.removeChild(a); URL.revokeObjectURL(url) }, 100)
}

// ── Report definitions ────────────────────────────────────────
export const REPORT_COLS = {
  performance: [
    { key: 'title',   label: 'Post' },
    { key: 'status',  label: 'Status' },
    { key: 'views',   label: 'Views' },
    { key: 'seo_score', label: 'Score SEO' },
    { key: 'category', label: 'Categoria' },
    { key: 'created_at', label: 'Criado em' },
  ],
  wordpress: [
    { key: 'title',     label: 'Post' },
    { key: 'wp_name',   label: 'Site WP' },
    { key: 'status',    label: 'Status' },
    { key: 'wp_post_id', label: 'WP ID' },
    { key: 'duration_ms', label: 'Duração (ms)' },
    { key: 'created_at', label: 'Data' },
  ],
  automations: [
    { key: 'name',     label: 'Automação' },
    { key: 'category', label: 'Categoria' },
    { key: 'runs',     label: 'Execuções' },
    { key: 'active',   label: 'Ativa' },
    { key: 'last_run', label: 'Último disparo' },
  ],
  backups: [
    { key: 'name',        label: 'Nome' },
    { key: 'type',        label: 'Tipo' },
    { key: 'posts_count', label: 'Posts' },
    { key: 'size_bytes',  label: 'Tamanho' },
    { key: 'status',      label: 'Status' },
    { key: 'created_at',  label: 'Data' },
  ],
}

// ── Main export function ──────────────────────────────────────
export async function doExport({ reportType, format, rows, period }) {
  const cols = REPORT_COLS[reportType] || REPORT_COLS.performance
  const title = `Relatório de ${
    {performance:'Performance',wordpress:'Publicações WP',automations:'Automações',backups:'Backups'}[reportType]||reportType
  } — ${period}`
  const fname = `automatikpost-${reportType}-${period}-${Date.now()}`

  if (format === 'pdf')  return exportPDF(title, cols, rows, `${fname}.pdf`)
  if (format === 'csv')  return exportCSV(cols, rows, `${fname}.csv`)
  if (format === 'xlsx') return exportXLSX([{ name: title.slice(0,31), columns: cols, rows }], `${fname}.xlsx`)
  if (format === 'json') {
    const blob = new Blob([JSON.stringify({ title, generatedAt: new Date().toISOString(), rows }, null, 2)], { type: 'application/json' })
    downloadBlob(blob, `${fname}.json`)
  }
}
