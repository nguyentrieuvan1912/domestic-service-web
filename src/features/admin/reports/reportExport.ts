import type { Content, TDocumentDefinitions } from 'pdfmake/interfaces'
import type { ReportDocument, ReportTable, CellValue } from './reportModel'
import { formatReportValue } from './reportModel'

function filename(report: ReportDocument, extension: string, template = false) {
  const scope = report.scope.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/g, 'd').toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 60)
  return `cleanmaster-${template ? 'mau-' : ''}${report.id}-${scope}.${extension}`
}
function download(blob: Blob, name: string) {
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a'); link.href = url; link.download = name; link.click()
  setTimeout(() => URL.revokeObjectURL(url), 5000)
}
function pdfTables(table: ReportTable): Content[] {
  const columnGroups = table.columns.length <= 7 ? [table.columns] : Array.from({ length: Math.ceil((table.columns.length - 1) / 6) }, (_, index) => [table.columns[0], ...table.columns.slice(1 + index * 6, 1 + (index + 1) * 6)])
  return columnGroups.flatMap((columns, index): Content[] => {
    const totalWidth = columns.reduce((total, column) => total + (column.width || 25), 0)
    const body = [columns.map(column => ({ text: column.label, bold: true, color: '#ffffff', fillColor: '#065f46', margin: [0, 4, 0, 4] as [number, number, number, number] })),
      ...table.rows.map((row, rowIndex) => columns.map(column => ({ text: formatReportValue(row[column.key] ?? '', column.format), alignment: ['money', 'number', 'percent'].includes(column.format || '') ? 'right' as const : 'left' as const, fillColor: rowIndex % 2 ? '#f1f5f4' : '#ffffff', margin: [0, 3, 0, 3] as [number, number, number, number] }))) ]
    return [{ text: table.title + (columnGroups.length > 1 ? ` · Phần ${index + 1}/${columnGroups.length}` : ''), style: 'section', margin: [0, 18, 0, 8] },
      ...(table.rows.length ? [{ table: { headerRows: 1, widths: columns.map(column => (column.width || 25) / totalWidth * (770 - columns.length * 10)), body }, layout: { hLineWidth: () => 0.5, vLineWidth: () => 0, hLineColor: () => '#e2e8f0', paddingLeft: () => 5, paddingRight: () => 5 }, fontSize: 8.5 } as Content] : [{ text: 'Không có dữ liệu trong phạm vi đã chọn.', color: '#64748b', italics: true }])]
  })
}
export function pdfDefinition(report: ReportDocument): TDocumentDefinitions {
  return {
    pageSize: 'A4', pageOrientation: 'landscape', pageMargins: [36, 38, 36, 40],
    info: { title: report.title, author: 'CleanMaster', subject: `${report.period} · ${report.scope}` },
    defaultStyle: { font: 'Roboto', fontSize: 10, color: '#334155', lineHeight: 1.2 },
    styles: { brand: { fontSize: 10, bold: true, color: '#047857', characterSpacing: 2 }, title: { fontSize: 23, bold: true, color: '#0f172a' }, section: { fontSize: 13, bold: true, color: '#0f172a' } },
    footer: (page, count) => ({ columns: [{ text: 'CLEANMASTER · Báo cáo quản trị', color: '#64748b' }, { text: `Trang ${page}/${count}`, alignment: 'right', color: '#64748b' }], margin: [36, 12, 36, 0], fontSize: 8 }),
    content: [
      { text: 'CLEANMASTER / BÁO CÁO', style: 'brand', margin: [0, 0, 0, 10] },
      { text: report.title, style: 'title', margin: [0, 0, 0, 8] },
      { text: `${report.period}  |  ${report.scope}`, color: '#475569', margin: [0, 0, 0, 4] },
      { text: `Dữ liệu cập nhật: ${formatReportValue(report.capturedAt, 'date')} · Xuất lúc: ${formatReportValue(new Date().toISOString(), 'date')}`, fontSize: 8, color: '#64748b', margin: [0, 0, 0, 14] },
      { table: { widths: report.metrics.map(() => '*'), body: [report.metrics.map(metric => ({ stack: [{ text: metric.label, fontSize: 9, color: '#475569' }, { text: formatReportValue(metric.value, metric.format), fontSize: 17, bold: true, color: '#065f46', margin: [0, 6, 0, 0] }], fillColor: '#ecfdf5', margin: [8, 10, 8, 10] }))] }, layout: 'noBorders' },
      { text: 'Phạm vi và cách tính', bold: true, margin: [0, 14, 0, 4] },
      { ul: report.notes, fontSize: 8.5, color: '#64748b', margin: [0, 0, 0, 8] },
      ...report.tables.flatMap(pdfTables),
    ],
  }
}
export async function reportPdfBlob(report: ReportDocument) {
  const [module, fonts] = await Promise.all([import('pdfmake/build/pdfmake.js'), import('pdfmake/build/vfs_fonts.js')])
  const pdfMake = module.default
  pdfMake.addVirtualFileSystem(fonts.default)
  return pdfMake.createPdf(pdfDefinition(report)).getBlob()
}
export async function exportReportPdf(report: ReportDocument) { download(await reportPdfBlob(report), filename(report, 'pdf')) }

export async function reportExcelBuffer(report: ReportDocument, template = false) {
  const { default: ExcelJS } = await import('exceljs')
  const workbook = new ExcelJS.Workbook()
  workbook.creator = 'CleanMaster'; workbook.created = new Date(); workbook.calcProperties.fullCalcOnLoad = true
  const sheet = workbook.addWorksheet('Tong quan', { views: [{ showGridLines: false }], pageSetup: { paperSize: 9, orientation: 'landscape', fitToPage: true, fitToWidth: 1, fitToHeight: 0, horizontalCentered: true } })
  sheet.columns = Array.from({ length: 8 }, () => ({ width: 18 }))
  const band = (row: number, value: string, size: number, fill: string, color = 'FFFFFFFF', height = 30) => {
    sheet.mergeCells(row, 1, row, 8); const cell = sheet.getCell(row, 1); cell.value = value; cell.font = { name: 'Calibri', size, bold: true, color: { argb: color } }; cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: fill } }; cell.alignment = { vertical: 'middle', wrapText: true }; sheet.getRow(row).height = height
  }
  band(1, '  CLEANMASTER / BÁO CÁO QUẢN TRỊ', 12, 'FF065F46')
  band(2, (template ? 'MẪU · ' : '') + report.title, 21, 'FFECFDF5', 'FF0F172A', 46)
  band(3, `${report.period} · ${report.scope}`, 12, 'FFFFFFFF', 'FF475569')
  band(4, `Dữ liệu: ${formatReportValue(report.capturedAt, 'date')} · Múi giờ: Việt Nam (UTC+7)`, 10, 'FFFFFFFF', 'FF64748B')
  let rowNumber = 6
  report.metrics.forEach(metric => {
    sheet.mergeCells(rowNumber, 1, rowNumber, 5); sheet.mergeCells(rowNumber, 6, rowNumber, 8)
    const label = sheet.getCell(rowNumber, 1), value = sheet.getCell(rowNumber, 6)
    label.value = metric.label; value.value = template ? '' : metric.value
    for (const cell of [label, value]) { cell.font = { name: 'Calibri', size: 12, bold: true, color: { argb: 'FF065F46' } }; cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF0FDF4' } }; cell.alignment = { vertical: 'middle', wrapText: true } }
    value.alignment = { vertical: 'middle', horizontal: 'right' }
    if (metric.format === 'money') value.numFmt = '#,##0" đ";[Red](#,##0" đ")'
    if (metric.format === 'percent') value.numFmt = '0.0"%"'
    sheet.getRow(rowNumber++).height = 32
  })
  rowNumber += 1; band(rowNumber++, 'PHẠM VI VÀ CÁCH ĐỌC', 11, 'FFF1F5F9', 'FF334155')
  const notes = template ? ['Biểu mẫu trống để nhập dữ liệu. Các ô tổng ở cuối bảng có công thức; không thay thế dữ liệu giao dịch trong hệ thống.', ...report.notes] : report.notes
  notes.forEach(note => { sheet.mergeCells(rowNumber, 1, rowNumber, 8); const cell = sheet.getCell(rowNumber, 1); cell.value = note; cell.font = { name: 'Calibri', size: 11, color: { argb: 'FF64748B' } }; cell.alignment = { vertical: 'middle', wrapText: true }; sheet.getRow(rowNumber++).height = Math.max(32, Math.ceil(note.length / 135) * 18) })
  sheet.pageSetup.printArea = `A1:H${rowNumber}`
  report.tables.forEach((table, tableIndex) => {
    const rows = template ? [] : table.rows
    const ws = workbook.addWorksheet(`${tableIndex + 1}. ${tableIndex === 0 ? 'Tong hop' : 'Chi tiet'}`, { views: [{ state: 'frozen', ySplit: 6, showGridLines: false }], pageSetup: { paperSize: 9, orientation: 'landscape', fitToPage: true, fitToWidth: 1, fitToHeight: 0, horizontalCentered: true }, headerFooter: { oddFooter: '&LCleanMaster - Bao cao&C&P / &N&R&D' } })
    ws.columns = table.columns.map(column => ({ width: column.width || 25 }))
    const lastColumn = table.columns.length
    for (const [rowIndex, value] of [[1, 'CLEANMASTER / ' + table.title], [2, `${report.period} · ${report.scope}`], [3, `Dữ liệu: ${formatReportValue(report.capturedAt, 'date')} · ${template ? 'BIỂU MẪU TRỐNG' : rows.length + ' bản ghi'}`]] as const) {
      ws.mergeCells(rowIndex, 1, rowIndex, lastColumn); const cell = ws.getCell(rowIndex, 1); cell.value = value; cell.font = { name: 'Calibri', size: rowIndex === 1 ? 16 : 11, bold: rowIndex === 1, color: { argb: rowIndex === 1 ? 'FFFFFFFF' : 'FF475569' } }; cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: rowIndex === 1 ? 'FF065F46' : 'FFF8FAFC' } }; cell.alignment = { vertical: 'middle', wrapText: true }; ws.getRow(rowIndex).height = rowIndex === 1 ? 35 : 28
    }
    ws.mergeCells(4, 1, 4, lastColumn); ws.getCell(4, 1).value = 'Đơn vị tiền: VND · Thời gian: UTC+7 · Lọc dữ liệu bằng các nút trên tiêu đề cột.'; ws.getCell(4, 1).font = { name: 'Calibri', size: 10, italic: true, color: { argb: 'FF64748B' } }; ws.getRow(4).height = 24
    const header = ws.getRow(6); header.values = table.columns.map(column => column.label); header.height = 34
    header.eachCell(cell => { cell.font = { name: 'Calibri', size: 11, bold: true, color: { argb: 'FFFFFFFF' } }; cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF047857' } }; cell.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true } })
    const outputRows = template ? Array.from({ length: 20 }, () => ({} as Record<string, CellValue>)) : rows
    outputRows.forEach((record, index) => {
      const row = ws.getRow(index + 7)
      table.columns.forEach((column, columnIndex) => {
        const cell = row.getCell(columnIndex + 1); const value = record[column.key]
        cell.value = value == null ? null : column.format === 'date' && value ? new Date(new Date(value).getTime() + 7 * 3600000) : value
        cell.font = { name: 'Calibri', size: 11, color: { argb: 'FF334155' } }; cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: index % 2 ? 'FFF0F7F4' : 'FFFFFFFF' } }; cell.alignment = { vertical: 'middle', wrapText: true, horizontal: ['money', 'number', 'percent'].includes(column.format || '') ? 'right' : 'left' }; cell.border = { bottom: { style: 'hair', color: { argb: 'FFE2E8F0' } } }
        if (column.format === 'money') cell.numFmt = '#,##0" đ";[Red](#,##0" đ")'
        if (column.format === 'number') cell.numFmt = column.key === 'rating' ? '0.00' : '#,##0'
        if (column.format === 'percent') cell.numFmt = '0.0"%"'
        if (column.format === 'date') cell.numFmt = 'dd/mm/yyyy hh:mm'
      })
      row.height = Math.min(100, Math.max(28, ...table.columns.map(column => Math.ceil(String(record[column.key] || '').length / ((column.width || 25) - 2)) * 16 + 8)))
    })
    const lastDataRow = 6 + outputRows.length
    ws.autoFilter = { from: { row: 6, column: 1 }, to: { row: Math.max(6, lastDataRow), column: lastColumn } }
    if (outputRows.length) {
      const totalRow = ws.getRow(lastDataRow + 1); totalRow.getCell(1).value = 'TỔNG'
      table.columns.forEach((column, index) => {
        const cell = totalRow.getCell(index + 1)
        if (column.format === 'money' || column.format === 'number' && column.key !== 'rating') {
          const letter = ws.getColumn(index + 1).letter
          cell.value = { formula: `SUM(${letter}7:${letter}${lastDataRow})`, result: rows.reduce((total, record) => total + Number(record[column.key] || 0), 0) }; cell.numFmt = column.format === 'money' ? '#,##0" đ";[Red](#,##0" đ")' : '#,##0'
        }
        cell.font = { name: 'Calibri', bold: true, color: { argb: 'FF065F46' } }; cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFD1FAE5' } }; cell.alignment = { vertical: 'middle', horizontal: index ? 'right' : 'left' }
      }); totalRow.height = 32
    }
    ws.pageSetup.printTitlesRow = '1:6'; ws.pageSetup.printArea = `A1:${ws.getColumn(lastColumn).letter}${lastDataRow + 1}`
  })
  return workbook.xlsx.writeBuffer()
}
export async function exportReportExcel(report: ReportDocument, template = false) {
  const buffer = await reportExcelBuffer(report, template)
  download(new Blob([new Uint8Array(buffer)], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }), filename(report, 'xlsx', template))
}
