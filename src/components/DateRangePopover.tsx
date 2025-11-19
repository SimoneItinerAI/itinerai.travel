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
  const [hoverDay, setHoverDay] = useState<number | null>(null)

  useEffect(() => {
    if (open) {
      setTimeout(() => closeBtnRef.current?.focus(), 0)
    }
  }, [open])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open, onClose])

  const daysInMonth = (y: number, m: number) => new Date(y, m + 1, 0).getDate()
  const firstWeekday = (y: number, m: number) => new Date(y, m, 1).getDay()
  const makeDate = (y: number, m: number, d: number) => new Date(y, m, d)
  const sameDay = (a: Date, b: Date) => a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate()
  const isBetween = (d: Date, a: Date, b: Date) => {
    const t = d.getTime(), ta = a.getTime(), tb = b.getTime()
    return t >= Math.min(ta, tb) && t <= Math.max(ta, tb)
  }

  const grid = useMemo(() => {
    const W = 360, H = 336
    const mL = 16, mT = 72
    const cols = 7, rows = 6
    const cellW = (W - mL * 2) / cols
    const cellH = (H - mT - 16) / rows
    const days = daysInMonth(viewYear, viewMonth)
    const offset = firstWeekday(viewYear, viewMonth)
    const cells: { x: number; y: number; w: number; h: number; day: number; date: Date }[] = []
    for (let i = 0; i < days; i++) {
      const idx = offset + i
      const r = Math.floor(idx / cols)
      const c = idx % cols
      const x = mL + c * cellW
      const y = mT + r * cellH
      cells.push({ x, y, w: cellW, h: cellH, day: i + 1, date: makeDate(viewYear, viewMonth, i + 1) })
    }
    return { W, H, mL, mT, cellW, cellH, cols, rows, days, cells }
  }, [viewYear, viewMonth])

  const onPrev = () => { const d = new Date(viewYear, viewMonth - 1, 1); setViewYear(d.getFullYear()); setViewMonth(d.getMonth()) }
  const onNext = () => { const d = new Date(viewYear, viewMonth + 1, 1); setViewYear(d.getFullYear()); setViewMonth(d.getMonth()) }

  const clickDay = (d: Date) => {
    if (!selStart) { setSelStart(d); setSelEnd(null); return }
    if (!selEnd) {
      if (d.getTime() < selStart.getTime()) { setSelEnd(selStart); setSelStart(d) }
      else { setSelEnd(d) }
      return
    }
    setSelStart(d); setSelEnd(null)
  }

  const applyRange = () => {
    if (!selStart || !selEnd) return
    const toISO = (dt: Date) => dt.toISOString().slice(0, 10)
    onSelectRange(toISO(selStart), toISO(selEnd))
    onClose()
  }

  const keyHandler = (e: React.KeyboardEvent<SVGSVGElement>) => {
    const f = focusRef.current
    if (f == null) { focusRef.current = 1; return }
    if (e.key === 'ArrowRight') { focusRef.current = Math.min(grid.days, f + 1) }
    else if (e.key === 'ArrowLeft') { focusRef.current = Math.max(1, f - 1) }
    else if (e.key === 'ArrowUp') { focusRef.current = Math.max(1, f - 7) }
    else if (e.key === 'ArrowDown') { focusRef.current = Math.min(grid.days, f + 7) }
    else if (e.key === 'Enter' || e.key === ' ') { const d = makeDate(viewYear, viewMonth, f); clickDay(d) }
    e.preventDefault()
  }

  const monthLabel = new Date(viewYear, viewMonth, 1).toLocaleDateString('it-IT', { month: 'long', year: 'numeric' })
  const startLabel = selStart ? selStart.toLocaleDateString('it-IT') : '—'
  const endLabel = selEnd ? selEnd.toLocaleDateString('it-IT') : '—'

  if (!open) return null

  return (
    <div role="dialog" aria-modal="true" aria-labelledby="calendar-title" className="fixed inset-0 z-50 flex items-center justify-center">
      <style>{`
        .cal-enter{opacity:0;transform:scale(.96)}
        .cal-enter-active{opacity:1;transform:scale(1);transition:opacity .18s ease,transform .18s ease}
        .cal-overlay{backdrop-filter: blur(4px);}
      `}</style>
      <div className="absolute inset-0 bg-slate-950/35 cal-overlay" onClick={onClose} />
      <div className="cal-enter cal-enter-active relative max-w-md w-full rounded-3xl border border-white/10 bg-slate-900/90 backdrop-blur-xl shadow-2xl">
        <button ref={closeBtnRef} onClick={onClose} aria-label="Chiudi calendario" className="absolute top-3 right-4 text-slate-300 hover:text-white px-3 py-1">×</button>
        <div className="p-6">
          <div className="flex justify-between gap-4 mb-3">
            <div className="bg-white/5 rounded-full px-3 py-1 text-sm text-slate-200">Partenza <span className="ml-1 font-semibold">{startLabel}</span></div>
            <div className="bg-white/5 rounded-full px-3 py-1 text-sm text-slate-200">Ritorno <span className="ml-1 font-semibold">{endLabel}</span></div>
          </div>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox={`0 0 ${grid.W} ${grid.H}`}
            width="100%"
            role="group"
            aria-label="Seleziona intervallo date"
            tabIndex={0}
            onKeyDown={keyHandler}
          >
            <defs>
              <linearGradient id="rangeGrad" x1="0" x2="1" y1="0" y2="0">
                <stop offset="0%" stopColor="#f97316" />
                <stop offset="100%" stopColor="#3b82f6" />
              </linearGradient>
            </defs>
            <rect x={0} y={0} width={grid.W} height={grid.H} rx={16} fill="rgba(255,255,255,.06)" stroke="rgba(255,255,255,.18)" />
            <text id="calendar-title" x={grid.W / 2} y={30} textAnchor="middle" fill="#e5e7eb" fontSize={16} fontWeight={600}>{monthLabel}</text>
            <g>
              <rect x={16} y={42} width={36} height={24} rx={8} fill="#f97316" opacity={0.9} cursor="pointer" onClick={onPrev} />
              <text x={34} y={60} textAnchor="middle" fill="#fff" fontSize={14}>◀</text>
              <rect x={grid.W - 52} y={42} width={36} height={24} rx={8} fill="#3b82f6" opacity={0.9} cursor="pointer" onClick={onNext} />
              <text x={grid.W - 34} y={60} textAnchor="middle" fill="#fff" fontSize={14}>▶</text>
            </g>
            <g>
              {['L', 'M', 'M', 'G', 'V', 'S', 'D'].map((l, i) => (
                <text key={`wd-${i}`} x={grid.mL + i * grid.cellW + grid.cellW / 2} y={grid.mT - 10} textAnchor="middle" fill="#cbd5e1" fontSize={12}>{l}</text>
              ))}
            </g>
            <g>
              {grid.cells.map((cell) => {
                const isStart = selStart ? sameDay(cell.date, selStart) : false
                const isEnd = selEnd ? sameDay(cell.date, selEnd) : false
                const inRange = selStart && selEnd ? isBetween(cell.date, selStart, selEnd) : false
                const baseFill = 'rgba(255,255,255,.08)'
                const rangeFill = 'url(#rangeGrad)'
                const startFill = '#3b82f6'
                const endFill = '#f97316'
                const fill = isStart ? startFill : isEnd ? endFill : inRange ? rangeFill : baseFill
                const stroke = isStart || isEnd ? '#fff' : 'rgba(255,255,255,.18)'
                const textColor = isStart || isEnd || inRange ? '#ffffff' : '#e5e7eb'
                return (
                  <g key={cell.day} onMouseEnter={() => setHoverDay(cell.day)} onMouseLeave={() => setHoverDay(null)}>
                    <rect x={cell.x} y={cell.y} width={cell.w} height={cell.h} rx={10} fill={fill} stroke={stroke} cursor="pointer" onClick={() => clickDay(cell.date)} />
                    {hoverDay === cell.day && !inRange && !isStart && !isEnd ? (
                      <rect x={cell.x} y={cell.y} width={cell.w} height={cell.h} rx={10} fill="rgba(255,255,255,.10)" />
                    ) : null}
                    <text x={cell.x + 8} y={cell.y + 22} fill={textColor} fontSize={14} fontWeight={600}>{cell.day}</text>
                  </g>
                )
              })}
            </g>
            <g>
              <text x={grid.mL} y={grid.H - 16} fill="#cbd5e1" fontSize={12}>{`Dal ${startLabel} al ${endLabel}`}</text>
            </g>
          </svg>
        </div>
        <div className="flex justify-between items-center px-6 pb-6 mt-2">
          <button className="text-sm text-slate-300 hover:text-white underline-offset-2 hover:underline" onClick={() => { setSelStart(null); setSelEnd(null) }}>Reset</button>
          <button className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-4 py-2 rounded-xl" onClick={applyRange} disabled={!selStart || !selEnd}>Applica</button>
        </div>
      </div>
    </div>
  )
}