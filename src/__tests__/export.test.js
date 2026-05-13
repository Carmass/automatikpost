import { describe, it, expect, vi } from 'vitest'

// Mock browser APIs
global.URL.createObjectURL = vi.fn(() => 'blob:test')
global.URL.revokeObjectURL = vi.fn()
document.body.appendChild = vi.fn()
document.body.removeChild = vi.fn()
document.createElement = vi.fn(() => ({ click: vi.fn(), href: '', download: '' }))

// Mock jsPDF
vi.mock('jspdf', () => ({ default: vi.fn().mockImplementation(() => ({
  setFillColor: vi.fn(), rect: vi.fn(), setTextColor: vi.fn(), setFontSize: vi.fn(),
  setFont: vi.fn(), text: vi.fn(), save: vi.fn()
})) }))
vi.mock('jspdf-autotable', () => ({ default: vi.fn() }))
vi.mock('papaparse', () => ({ default: { unparse: vi.fn().mockReturnValue('col1,col2\nval1,val2') } }))
vi.mock('xlsx', () => ({ utils: { book_new: vi.fn(() => ({})), aoa_to_sheet: vi.fn(() => ({})), book_append_sheet: vi.fn() }, writeFile: vi.fn() }))

import { exportCSV, exportXLSX, REPORT_COLS } from '../utils/export.js'

describe('REPORT_COLS', () => {
  it('has required keys', () => {
    expect(REPORT_COLS.performance).toBeDefined()
    expect(REPORT_COLS.wordpress).toBeDefined()
    expect(REPORT_COLS.automations).toBeDefined()
    expect(REPORT_COLS.performance[0]).toHaveProperty('key')
    expect(REPORT_COLS.performance[0]).toHaveProperty('label')
  })
})

describe('exportCSV', () => {
  it('generates blob without throwing', async () => {
    await expect(exportCSV(REPORT_COLS.performance, [{ title: 'Test', status: 'published' }], 'test.csv')).resolves.not.toThrow()
  })
})
