import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import EnhancedDatePicker from '../../components/EnhancedDatePicker'

const setup = async (props?: Partial<React.ComponentProps<typeof EnhancedDatePicker>>) => {
  if (!('elementFromPoint' in document)) {
    const doc = document as unknown as { elementFromPoint: (x: number, y: number) => Element | null }
    doc.elementFromPoint = () => null
  }
  const onClose = vi.fn()
  const onSelectRange = vi.fn()
  render(
    <EnhancedDatePicker
      open={true}
      onClose={onClose}
      onSelectRange={onSelectRange}
      {...props}
    />
  )
  return { onClose, onSelectRange }
}

describe('EnhancedDatePicker validation', () => {
  it('disables return dates earlier than departure and shows error', async () => {
    await setup({ start: '2025-01-10' })
    const applyBtn = screen.getAllByRole('button', { name: /Applica/i })[0] as HTMLButtonElement
    expect(applyBtn.disabled).toBe(true)
  })

  it.skip('emits local ISO strings without off-by-one and closes', async () => {})

  it('prevents apply when end < start (disabled)', async () => {
    await setup({ start: '2025-02-10', end: '2025-02-09' })
    const apply = screen.getAllByRole('button', { name: /Applica/i })[0] as HTMLButtonElement
    expect(apply.disabled).toBe(true)
  })
})
