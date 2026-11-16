import { test } from 'node:test'
import assert from 'node:assert/strict'
import type { ReportData } from '../../../api/reports'
import { buildReport, monthAt, monthsFor, reportSnapshot } from './reportModel'

function fixture(): ReportData {
  return {
    capturedAt: '2026-11-03T03:00:00Z',
    finance: [
      { kind: 'REVENUE', id: 1, bookingId: 1, actorId: 2, amount: 100000, effectiveAt: '2025-12-31T17:00:00Z' },
      { kind: 'REVENUE', id: 2, bookingId: 999, actorId: 2, amount: 50000, effectiveAt: '2026-11-01T00:00:00Z' },
      { kind: 'PAYOUT', id: 1, actorId: 3, amount: 20000, effectiveAt: '2026-11-02T00:00:00Z' },
      { kind: 'REFUND', id: 1, bookingId: 1, actorId: 2, amount: 10000, effectiveAt: '2026-11-02T00:00:00Z' },
      { kind: 'FEE', id: 1, bookingId: 1, actorId: 3, amount: 20000, staffAmount: 80000, effectiveAt: '2026-11-02T00:00:00Z' },
    ].map(record => ({ bookingId: null, method: 'CASH', reference: '', description: '', status: 'PAID', ...record })),
    bookings: [{ id: 1, bookingCode: 'BK-1', serviceId: 10, createdAt: '2026-01-02T00:00:00Z', startsAt: '2026-01-03T00:00:00Z', status: 'COMPLETED', service: { name: 'Dọn nhà' }, address: { ward: 'Phường A', recipientName: 'Khách thực tế' }, assignments: [{ staffId: 3, status: 'COMPLETED' }], totalAmount: 100000, paymentStatus: 'PAID' }],
    staff: [{ id: '3', fullName: 'Nhân viên hoạt động', phone: '0901000003', rank: 'STANDARD', status: 'ACTIVE', averageRating: 4.5 }, { id: '4', fullName: 'Đã khóa', status: 'LOCKED' }],
    customers: [{ id: '2', fullName: 'Khách hàng thật', phone: '0901000002' }],
    catalog: { services: [{ id: '10', categoryId: '20', name: 'Dọn nhà' }], categories: [{ id: '20', group: 'CLEANING' }], packages: [], addOns: [] },
  } as unknown as ReportData
}
test('Vietnam timezone year/month boundaries and Q4 are applied consistently', () => {
  assert.deepEqual(monthAt('2025-12-31T17:00:00Z'), { year: 2026, month: 1 })
  assert.deepEqual(monthAt('2026-12-31T17:00:00Z'), { year: 2027, month: 1 })
  assert.deepEqual(monthsFor('q4'), [10, 11, 12])
  assert.equal(reportSnapshot(fixture(), 2026, 'q4').totalKind('REVENUE'), 50000)
})
test('unmatched bookings retain their money and service percentages reconcile to 100', () => {
  const source = fixture(), original = JSON.stringify(source), snapshot = reportSnapshot(source, 2026, 'year')
  assert.equal(snapshot.serviceGroups.reduce((sum, group) => sum + group.amount, 0), 150000)
  assert.ok(Math.abs(snapshot.serviceGroups.reduce((sum, group) => sum + group.value, 0) - 100) < 0.0001)
  assert.ok(snapshot.serviceGroups.some(group => group.group === 'UNMATCHED'))
  assert.equal(JSON.stringify(source), original)
})
test('cashflow deducts payout/refund but does not double-count internal platform fees', () => {
  const report = buildReport(fixture(), 2026, 'year', { type: 'cashflow' })
  assert.equal(report.metrics[3].value, 120000)
  assert.equal(report.tables[1].rows.length, 4)
  assert.equal(report.tables[0].rows.reduce((sum, row) => sum + Number(row.net), 0), 120000)
})
test('drilldown limits the selected scope and staff account snapshot remains current', () => {
  assert.equal(buildReport(fixture(), 2026, 'year', { type: 'cashflow', month: 11 }).metrics[0].value, 50000)
  const service = buildReport(fixture(), 2026, 'year', { type: 'services', group: 'CLEANING' })
  assert.equal(service.tables[1].rows.length, 1)
  const district = buildReport(fixture(), 2026, 'year', { type: 'districts', district: 'Phường A' })
  assert.equal(district.tables[1].rows[0].customer, 'Khách thực tế')
  const staff = buildReport(fixture(), 2026, 'q4', { type: 'staff' })
  assert.equal(staff.tables[0].rows.length, 1)
  assert.equal(staff.tables[0].rows[0].name, 'Nhân viên hoạt động')
  assert.equal(staff.tables[0].rows[0].income, 80000)
})

test('arbitrary month selection filters data and labels exported reports for the selected year', () => {
  assert.deepEqual(monthsFor('m1'), [1])
  assert.deepEqual(monthsFor('m12'), [12])
  const january = buildReport(fixture(), 2026, 'm1', { type: 'revenue' })
  assert.equal(january.period, 'Tháng 1/2026')
  assert.equal(january.metrics[0].value, 100000)
  assert.equal(january.tables[0].rows.length, 1)
  assert.equal(january.tables[1].rows.length, 1)
  assert.equal(buildReport(fixture(), 2026, 'm11', { type: 'revenue' }).metrics[0].value, 50000)
  assert.equal(buildReport(fixture(), 2026, 'm12', { type: 'revenue' }).metrics[0].value, 0)
  assert.equal(buildReport(fixture(), 2025, 'm1', { type: 'revenue' }).metrics[0].value, 0)
})
