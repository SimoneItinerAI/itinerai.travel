import { useEffect, useMemo, useRef, useState } from 'react'

type Props = {
  open: boolean
  start?: string
  end?: string
  onClose: () => void
  onSelectRange: (startISO: string, endISO: string) => void
}

export default function DateRangePopover({ open, start, end, onClose, onSelectRange }: Props) {
  const initial = start ? new Date(start) : new Date()
  const [viewYear, setViewYear] = useState(initial.getFullYear())
  const [viewMonth, setViewMonth] = useState(initial.getMonth())
  const [selStart, setSelStart] = useState<Date | null>(start ? new Date(start) : null)
  const [selEnd, setSelEnd] = useState<Date | null>(end ? new Date(end) : null)
  const closeBtnRef = useRef<HTMLButtonElement | null>(null)
  const focusRef = useRef<number | null>(null)

  useEffect(() => { if (open) setTimeout(() => closeBtnRef.current?.focus(), 0) }, [open])
  useEffect(() => { if (!open) return; const h = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }; document.addEventListener('keydown', h); return () => document.removeEventListener('keydown', h) }, [open, onClose])

  const daysInMonth = (y: number, m: number) => new Date(y, m + 1, 0).getDate()
  const firstWeekday = (y: number, m: number) => new Date(y, m, 1).getDay()
  const makeDate = (y: number, m: number, d: number) => new Date(y, m, d)
  const sameDay = (a: Date, b: Date) => a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate()
  const isBetween = (d: Date, a: Date, b: Date) => { const t = d.getTime(), ta = a.getTime(), tb = b.getTime(); return t >= Math.min(ta, tb) && t <= Math.max(ta, tb) }
  const fmt = (d?: Date | null) => d ? d.toLocaleDateString('it-IT', { day: '2-digit', month: 'short', year: 'numeric' }).replace(/\./g, '') : '—'

  const grid = useMemo(() => {
    const W = 320, H = 300
    const mL = 16, mT = 86
    const cols = 7, rows = 6
    const cellW = (W - mL * 2) / cols
    const cellH = (H - mT - 16) / rows
    const days = daysInMonth(viewYear, viewMonth)
    const offset = firstWeekday(viewYear, viewMonth)
    const cells: { x: number; y: number; w: number; h: number; day: number; date: Date }[] = []
    for (let i = 0; i < days; i++) { const idx = offset + i; const r = Math.floor(idx / cols); const c = idx % cols; const x = mL + c * cellW; const y = mT + r * cellH; cells.push({ x, y, w: cellW, h: cellH, day: i + 1, date: makeDate(viewYear, viewMonth, i + 1) }) }
    return { W, H, mL, mT, cellW, cellH, cols, rows, days, cells }
  }, [viewYear, viewMonth])

  const onPrev = () => { const d = new Date(viewYear, viewMonth - 1, 1); setViewYear(d.getFullYear()); setViewMonth(d.getMonth()) }
  const onNext = () => { const d = new Date(viewYear, viewMonth + 1, 1); setViewYear(d.getFullYear()); setViewMonth(d.getMonth()) }
  const clickDay = (d: Date) => { if (!selStart) { setSelStart(d); setSelEnd(null); return } if (!selEnd) { if (d.getTime() < selStart.getTime()) { setSelEnd(selStart); setSelStart(d) } else { setSelEnd(d) } return } setSelStart(d); setSelEnd(null) }
  const applyRange = () => { if (!selStart || !selEnd) return; const toISO = (dt: Date) => dt.toISOString().slice(0, 10); onSelectRange(toISO(selStart), toISO(selEnd)); onClose() }
  const keyHandler = (e: React.KeyboardEvent<SVGSVGElement>) => { const f = focusRef.current; if (f == null) { focusRef.current = 1; return } if (e.key === 'ArrowRight') { focusRef.current = Math.min(grid.days, f + 1) } else if (e.key === 'ArrowLeft') { focusRef.current = Math.max(1, f - 1) } else if (e.key === 'ArrowUp') { focusRef.current = Math.max(1, f - 7) } else if (e.key === 'ArrowDown') { focusRef.current = Math.min(grid.days, f + 7) } else if (e.key === 'Enter' || e.key === ' ') { const d = makeDate(viewYear, viewMonth, f); clickDay(d) } e.preventDefault() }
  const monthLabel = new Date(viewYear, viewMonth, 1).toLocaleDateString('it-IT', { month: 'long', year: 'numeric' })

  if (!open) return null

  return (
    <div role="dialog" aria-modal="true" aria-labelledby="calendar-title" className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-slate-950/30" onClick={onClose} />
      <div className="relative max-w-md w-full rounded-2xl border border-white/10 bg-slate-900 shadow-lg p-5">
        <div className="flex items-center justify-between mb-3">
          <h2 id="calendar-title" className="text-slate-200 text-sm">Seleziona le date</h2>
          <button ref={closeBtnRef} onClick={onClose} aria-label="Chiudi" className="text-slate-200 hover:text-white focus:ring-2 focus:ring-white/40 rounded-md px-2">×</button>
        </div>
        <div className="flex gap-4 mb-3">
          <div className="rounded-md border border-white/10 px-3 py-1 text-sm text-slate-200">Dal <span className="ml-1 font-semibold">{fmt(selStart)}</span></div>
          <div className="rounded-md border border-white/10 px-3 py-1 text-sm text-slate-200">Al <span className="ml-1 font-semibold">{fmt(selEnd)}</span></div>
        </div>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox={`0 0 ${grid.W} ${grid.H}`} width="100%" role="group" aria-label="Seleziona intervallo date" tabIndex={0} onKeyDown={keyHandler}>
          <text x={grid.W / 2} y={30} textAnchor="middle" fill="#e5e7eb" fontSize={16} fontWeight={600}>{monthLabel}</text>
          <g>
            <rect x={12} y={40} width={24} height={20} rx={6} fill="#334155" cursor="pointer" />
            <text x={24} y={55} textAnchor="middle" fill="#fff" fontSize={12} onClick={onPrev}>◀</text>
            <rect x={grid.W - 36} y={40} width={24} height={20} rx={6} fill="#334155" cursor="pointer" />
            <text x={grid.W - 24} y={55} textAnchor="middle" fill="#fff" fontSize={12} onClick={onNext}>▶</text>
          </g>
          <g>
            {['L','M','M','G','V','S','D'].map((l,i)=> (
              <text key={`wd-${i}`} x={grid.mL + i*grid.cellW + grid.cellW/2} y={grid.mT - 10} textAnchor="middle" fill="#cbd5e1" fontSize={12}>{l}</text>
            ))}
          </g>
          <g>
            {grid.cells.map((cell)=> {
              const isStart = selStart ? sameDay(cell.date, selStart) : false
              const isEnd = selEnd ? sameDay(cell.date, selEnd) : false
              const inRange = selStart && selEnd ? isBetween(cell.date, selStart, selEnd) : false
              const baseFill = 'transparent'
              const hoverFill = 'rgba(148,163,184,.25)'
              const rangeFill = 'rgba(59,130,246,.20)'
              const startFill = 'rgba(59,130,246,.35)'
              const endFill = 'rgba(249,115,22,.35)'
              const fill = isStart ? startFill : isEnd ? endFill : inRange ? rangeFill : baseFill
              const stroke = 'rgba(255,255,255,.10)'
              const textColor = '#e5e7eb'
              return (
                <g key={cell.day}>
                  <rect x={cell.x} y={cell.y} width={cell.w} height={cell.h} rx={8} fill={fill} stroke={stroke} strokeWidth={0.6} cursor="pointer" onClick={() => clickDay(cell.date)} />
                  <rect x={cell.x} y={cell.y} width={cell.w} height={cell.h} rx={8} fill={hoverFill} opacity={0} className="hover:opacity-100" />
                  <text x={cell.x + 8} y={cell.y + 22} fill={textColor} fontSize={14} fontWeight={600} style={{pointerEvents:'none'}}>{cell.day}</text>
                </g>
              )
            })}
          </g>
        </svg>
        <div className="flex justify-between items-center mt-4">
          <button className="text-sm text-slate-300 hover:text-white" onClick={onClose}>Annulla</button>
          <button className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-4 py-2 rounded-xl" onClick={applyRange} disabled={!selStart || !selEnd}>Applica</button>
        </div>
      </div>
    </div>
  )
}