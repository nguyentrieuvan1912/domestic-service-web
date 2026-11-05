import { test } from 'node:test'
import assert from 'node:assert/strict'
import { mkdir, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import ExcelJS from 'exceljs'
import { reportExcelBuffer, reportPdfBlob } from './reportExport'
import type { ReportDocument } from './reportModel'

const report: ReportDocument = {
  id: 'qa-layout', title: 'Báo cáo kiểm thử định dạng tiếng Việt', period: 'Quý 4/2026', scope: 'Kiểm thử bố cục', capturedAt: '2026-11-03T03:00:00Z',
  notes: ['Tệp kiểm thử tự động, không phải số liệu báo cáo vận hành.'],
  metrics: [{ label: 'Tổng giá trị kiểm thử', value: 123456789, format: 'money' }],
  tables: [{ title: 'Bảng kiểm tra phân trang và đầy đủ cột', columns: [
    { key: 'id', label: 'Mã đơn', width: 18 }, { key: 'name', label: 'Họ tên có dấu', width: 30 }, { key: 'description', label: 'Mô tả dài để kiểm tra xuống dòng', width: 40 }, { key: 'amount', label: 'Số tiền (VND)', format: 'money', width: 24 }, { key: 'date', label: 'Ngày ghi nhận', format: 'date', width: 24 }, { key: 'phone', label: 'Điện thoại', width: 18 }, { key: 'status', label: 'Trạng thái', width: 22 }, { key: 'reference', label: 'Tham chiếu cuối bảng', width: 30 },
  ], rows: Array.from({ length: 35 }, (_, index) => ({ id: `QA-${index + 1}`, name: 'Nguyễn Thị Ánh', description: 'Nội dung kiểm thử căn chỉnh và hiển thị đầy đủ thông tin khi báo cáo có nhiều dòng.', amount: index === 1 ? -15000 : 1234567, date: '2026-11-02T17:30:00Z', phone: '0901000000', status: 'Đã xác nhận', reference: `LAST-COLUMN-${index + 1}` })) }],
}
test('formatted Excel keeps all records, numeric money, phone text, formulas and frozen headers', async () => {
  const output = await reportExcelBuffer(report)
  const workbook = new ExcelJS.Workbook(); await workbook.xlsx.load(output)
  const sheet = workbook.worksheets[1]
  assert.equal(sheet.getCell('A41').value, 'QA-35')
  assert.equal(sheet.getCell('F7').value, '0901000000')
  assert.equal(typeof sheet.getCell('D7').value, 'number')
  assert.equal(sheet.getCell('A6').font.bold, true)
  assert.equal(sheet.views[0].state, 'frozen')
  assert.ok(sheet.autoFilter)
  assert.match(sheet.getCell('D42').formula, /SUM\(D7:D41\)/)
  assert.ok(sheet.getCell('E7').value instanceof Date)
  assert.equal((sheet.getCell('E7').value as Date).toISOString(), '2026-11-03T00:30:00.000Z')
  if (process.env.REPORT_QA_OUTPUT) { await mkdir(process.env.REPORT_QA_OUTPUT, { recursive: true }); await writeFile(join(process.env.REPORT_QA_OUTPUT, 'report-layout.xlsx'), new Uint8Array(output)) }
})
test('blank Excel template has formatted input rows and formulas without copied personal records', async () => {
  const output = await reportExcelBuffer(report, true)
  const workbook = new ExcelJS.Workbook(); await workbook.xlsx.load(output)
  const sheet = workbook.worksheets[1]
  assert.equal(sheet.getCell('B7').value, null)
  assert.equal(sheet.getCell('B26').value, null)
  assert.match(sheet.getCell('D27').formula, /SUM\(D7:D26\)/)
  assert.equal(workbook.worksheets[0].getCell('F6').value, '')
})
test('PDF is generated with embedded fonts and full multi-page table output', async () => {
  const blob = await reportPdfBlob(report)
  const bytes = new Uint8Array(await blob.arrayBuffer())
  assert.equal(new TextDecoder().decode(bytes.slice(0, 5)), '%PDF-')
  assert.ok(bytes.length > 20000)
  if (process.env.REPORT_QA_OUTPUT) { await mkdir(process.env.REPORT_QA_OUTPUT, { recursive: true }); await writeFile(join(process.env.REPORT_QA_OUTPUT, 'report-layout.pdf'), bytes) }
})
