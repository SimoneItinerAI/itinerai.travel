import { describe, it, expect } from 'vitest'
import { dateToLocalISO, parseLocalISOString } from '../../components/EnhancedDatePicker'

describe('date utils', () => {
  it('converts Date to local ISO without timezone shift', () => {
    const d = new Date(2025, 0, 10) // 10 Jan 2025 local
    expect(dateToLocalISO(d)).toBe('2025-01-10')
  })

  it('parses local ISO to Date at local midnight', () => {
    const d = parseLocalISOString('2025-01-10')!
    expect(d.getFullYear()).toBe(2025)
    expect(d.getMonth()).toBe(0)
    expect(d.getDate()).toBe(10)
  })
})

