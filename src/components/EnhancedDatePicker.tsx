import { useEffect, useRef, useState } from 'react'
import { ChevronLeft, ChevronRight, X } from 'lucide-react'

interface DateRange {
  start: Date | null
  end: Date | null
}

interface EnhancedDatePickerProps {
  open: boolean
  start?: string
  end?: string
  minDate?: Date
  maxDate?: Date
  onClose: () => void
  onSelectRange: (startISO: string, endISO: string) => void
  locale?: string
}

export default function EnhancedDatePicker({
  open,
  start,
  end,
  minDate,
  maxDate,
  onClose,
  onSelectRange,
  locale = 'it-IT'
}: EnhancedDatePickerProps) {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const initialDate = start ? new Date(start) : today
  const [viewYear, setViewYear] = useState(initialDate.getFullYear())
  const [viewMonth, setViewMonth] = useState(initialDate.getMonth())
  const [selectedRange, setSelectedRange] = useState<DateRange>({
    start: start ? new Date(start) : null,
    end: end ? new Date(end) : null
  })
  const [hoveredDate, setHoveredDate] = useState<Date | null>(null)

  const closeBtnRef = useRef<HTMLButtonElement | null>(null)
  const calendarRef = useRef<HTMLDivElement | null>(null)

  const effectiveMinDate = minDate || today
  const effectiveMaxDate = maxDate || new Date(today.getFullYear() + 1, 11, 31)

  useEffect(() => {
    if (open) {
      setTimeout(() => closeBtnRef.current?.focus(), 0)
    }
  }, [open])

  useEffect(() => {
    if (!open) return
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [open, onClose])

  const daysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate()
  const firstWeekdaySundayBased = (year: number, month: number) => new Date(year, month, 1).getDay() // 0=Sun
  const makeDate = (year: number, month: number, day: number) => new Date(year, month, day)

  const sameDay = (a: Date, b: Date) => (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  )

  const isBefore = (a: Date, b: Date) => a.getTime() < b.getTime()
  const isAfter = (a: Date, b: Date) => a.getTime() > b.getTime()

  const isBetween = (date: Date, start: Date, end: Date) => {
    const t = date.getTime()
    const s = start.getTime()
    const e = end.getTime()
    return t >= Math.min(s, e) && t <= Math.max(s, e)
  }

  const isDateDisabled = (date: Date) => isBefore(date, effectiveMinDate) || isAfter(date, effectiveMaxDate)

  const formatDate = (date: Date | null) => {
    if (!date) return '—'
    return date.toLocaleDateString(locale, { day: '2-digit', month: 'short', year: 'numeric' }).replace(/\./g, '')
  }

  const getWeekdays = () => {
    return ['L', 'M', 'M', 'G', 'V', 'S', 'D']
  }

  const buildCalendarDays = () => {
    const dim = daysInMonth(viewYear, viewMonth)
    const first = firstWeekdaySundayBased(viewYear, viewMonth) // 0..6 Sun..Sat
    const offsetMondayBased = (first + 6) % 7 // 0..6 Mon..Sun
    const days: (Date | null)[] = []
    for (let i = 0; i < offsetMondayBased; i++) days.push(null)
    for (let d = 1; d <= dim; d++) days.push(makeDate(viewYear, viewMonth, d))
    return days
  }

  const calendarDays = buildCalendarDays()

  const handlePrevMonth = () => {
    setViewMonth((m) => {
      if (m === 0) {
        setViewYear((y) => y - 1)
        return 11
      }
      return m - 1
    })
  }

  const handleNextMonth = () => {
    setViewMonth((m) => {
      if (m === 11) {
        setViewYear((y) => y + 1)
        return 0
      }
      return m + 1
    })
  }

  const handleDateHover = (date: Date | null) => setHoveredDate(date)

  const handleDateClick = (date: Date) => {
    if (isDateDisabled(date)) return
    if (!selectedRange.start || (selectedRange.start && selectedRange.end)) {
      setSelectedRange({ start: date, end: null })
      return
    }
    setSelectedRange({ start: selectedRange.start, end: date })
  }

  // Test di funzionalità per verificare che le date siano cliccabili
  useEffect(() => {
    if (open) {
      console.log('📅 Calendario aperto - Test accessibilità date iniziato')
      
      // Test che verifica che tutti i pulsanti delle date siano accessibili
      setTimeout(() => {
        const dateButtons = calendarRef.current?.querySelectorAll('button[data-date]')
        if (dateButtons && dateButtons.length > 0) {
          console.log(`✅ Trovati ${dateButtons.length} pulsanti data accessibili`)
          
          // Verifica che i pulsanti non siano coperti da altri elementi
          dateButtons.forEach((button, index) => {
            const rect = button.getBoundingClientRect()
            const elementAtPoint = document.elementFromPoint(rect.left + rect.width/2, rect.top + rect.height/2)
            
            if (elementAtPoint === button || button.contains(elementAtPoint)) {
              console.log(`✅ Data ${index + 1}: accessibile`)
            } else {
              console.warn(`⚠️ Data ${index + 1}: potenzialmente bloccata da`, elementAtPoint)
            }
          })
        } else {
          console.warn('⚠️ Nessun pulsante data trovato')
        }
      }, 100)
      
      // Test di responsività
      const checkResponsiveness = () => {
        const width = window.innerWidth
        const height = window.innerHeight
        console.log(`📱 Dimensioni schermo: ${width}x${height}`)
        
        if (calendarRef.current) {
          const calendarRect = calendarRef.current.getBoundingClientRect()
          console.log(`📅 Dimensioni calendario: ${calendarRect.width}x${calendarRect.height}`)
          
          // Verifica che il calendario sia centrato
          const centerX = width / 2
          const centerY = height / 2
          const calendarCenterX = calendarRect.left + calendarRect.width / 2
          const calendarCenterY = calendarRect.top + calendarRect.height / 2
          
          const offsetX = Math.abs(calendarCenterX - centerX)
          const offsetY = Math.abs(calendarCenterY - centerY)
          
          if (offsetX < 10 && offsetY < 10) {
            console.log('✅ Calendario perfettamente centrato')
          } else {
            console.warn(`⚠️ Calendario leggermente decentrato: offset X=${offsetX}, Y=${offsetY}`)
          }
          
          // Verifica che il calendario non sia troppo grande
          if (calendarRect.width > width * 0.95) {
            console.warn('⚠️ Calendario troppo largo per lo schermo')
          }
          if (calendarRect.height > height * 0.95) {
            console.warn('⚠️ Calendario troppo alto per lo schermo')
          }
        }
      }
      
      // Esegui il test di responsività dopo un breve ritardo
      setTimeout(checkResponsiveness, 200)
      
      // Riesegui il test se la finestra viene ridimensionata
      window.addEventListener('resize', checkResponsiveness)
      
      return () => {
        window.removeEventListener('resize', checkResponsiveness)
      }
    }
  }, [open])

  const applyRange = () => {
    if (!selectedRange.start || !selectedRange.end) return
    const toISO = (d: Date) => d.toISOString().slice(0, 10)
    onSelectRange(toISO(selectedRange.start), toISO(selectedRange.end))
    onClose()
  }

  const clearSelection = () => setSelectedRange({ start: null, end: null })

  const monthLabel = new Date(viewYear, viewMonth, 1).toLocaleDateString(locale, { month: 'long', year: 'numeric' })

  const getDateStatus = (date: Date) => {
    const isSelectedStart = selectedRange.start && sameDay(date, selectedRange.start)
    const isSelectedEnd = selectedRange.end && sameDay(date, selectedRange.end)
    const isInRange = selectedRange.start && selectedRange.end && isBetween(date, selectedRange.start, selectedRange.end)
    const isHoveredInRange = selectedRange.start && !selectedRange.end && hoveredDate && isBetween(date, selectedRange.start, hoveredDate)
    return { isSelectedStart, isSelectedEnd, isInRange, isHoveredInRange, isDisabled: isDateDisabled(date) }
  }

  if (!open) return null

  return (
    <div role="dialog" aria-modal="true" aria-labelledby="calendar-title" className="relative w-full">
      <style>{`
        /* Previene lo scrolling del body quando il modale è aperto */
        body.modal-open {
          overflow: hidden;
        }
        
        /* Assicura che il modale sia sempre sopra tutti gli altri elementi */
        .modal-container {
          position: fixed !important;
          top: 50% !important;
          left: 50% !important;
          transform: translate(-50%, -50%) !important;
          z-index: 9999 !important;
          max-height: 90vh !important;
          max-width: 95vw !important;
          overflow-y: auto !important;
          /* Rimuovi qualsiasi effetto blur dal contenitore del calendario */
          backdrop-filter: none !important;
          filter: none !important;
          -webkit-backdrop-filter: none !important;
          -webkit-filter: none !important;
          /* Crea un nuovo contesto di stacking isolato */
          isolation: isolate !important;
          /* Garantisce nitidezza massima */
          will-change: transform !important;
          /* Rimuovi qualsiasi effetto di sfocatura ereditato */
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25) !important;
        }
        
        /* Responsive adjustments */
        @media (max-width: 768px) {
          .modal-container {
            max-width: 98vw !important;
            max-height: 95vh !important;
            margin: 0 1vw !important;
          }
        }
        
        /* Previene interazioni con elementi sottostanti */
        .modal-backdrop {
          position: fixed !important;
          top: 0 !important;
          left: 0 !important;
          width: 100vw !important;
          height: 100vh !important;
          z-index: 9998 !important;
          /* Il blur rimane solo sul backdrop, non influenza il calendario */
          backdrop-filter: blur(4px) !important;
          -webkit-backdrop-filter: blur(4px) !important;
        }
        
        /* Assicura che tutti gli elementi interni del calendario siano nitidi */
        .modal-container * {
          backdrop-filter: none !important;
          filter: none !important;
          -webkit-backdrop-filter: none !important;
          -webkit-filter: none !important;
          /* Garantisce che il testo sia sempre nitido */
          text-rendering: optimizeLegibility !important;
          -webkit-font-smoothing: antialiased !important;
          -moz-osx-font-smoothing: grayscale !important;
        }
        
        /* Stili specifici per i pulsanti delle date per garantire accessibilità */
        .modal-container button {
          position: relative !important;
          z-index: 10000 !important;
          cursor: pointer !important;
          user-select: none !important;
          -webkit-user-select: none !important;
          -moz-user-select: none !important;
          -ms-user-select: none !important;
          /* Garantisce che i pulsanti siano sempre sopra */
          transform: translateZ(0) !important;
          -webkit-transform: translateZ(0) !important;
        }
        
        /* Assicura che i pulsanti abbiano sempre un buon contrasto */
        .modal-container button:hover {
          transform: scale(1.05) translateZ(0) !important;
          z-index: 10001 !important;
        }
        
        /* Stili per garantire che il testo sia sempre leggibile */
        .modal-container {
          isolation: isolate !important;
          /* Migliora la leggibilità del testo */
          font-smooth: always !important;
          -webkit-font-smoothing: subpixel-antialiased !important;
        }
      `}</style>
      <div
        ref={calendarRef}
        className="modal-container relative w-full bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-2xl overflow-hidden"
      >
        <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-700">
          <h2 id="calendar-title" className="text-lg font-semibold text-slate-900 dark:text-white">Seleziona le date del viaggio</h2>
          <button
            ref={closeBtnRef}
            onClick={onClose}
            aria-label="Chiudi"
            className="p-2 rounded-lg text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white dark:bg-slate-800 rounded-lg p-3 border border-slate-200 dark:border-slate-700">
              <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">Data di partenza</div>
              <div className="font-semibold text-slate-900 dark:text-white">{formatDate(selectedRange.start)}</div>
            </div>
            <div className="bg-white dark:bg-slate-800 rounded-lg p-3 border border-slate-200 dark:border-slate-700">
              <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">Data di ritorno</div>
              <div className="font-semibold text-slate-900 dark:text-white">{formatDate(selectedRange.end)}</div>
            </div>
          </div>
        </div>

        <div className="p-4">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={handlePrevMonth}
              className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors"
              aria-label="Mese precedente"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <h3 className="text-base font-medium text-slate-900 dark:text-white">{monthLabel}</h3>
            <button
              onClick={handleNextMonth}
              className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors"
              aria-label="Mese successivo"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          <div className="grid grid-cols-7 gap-1 mb-2">
            {getWeekdays().map((w, i) => (
              <div key={i} className="text-center text-xs lg:text-sm font-medium text-slate-500 dark:text-slate-400 py-2 lg:py-3">
                {w}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1">
            {calendarDays.map((date, index) => {
              if (!date) return <div key={`empty-${index}`} className="h-10 lg:h-12" />
              const status = getDateStatus(date)
              const dayNumber = date.getDate()
              let buttonClass = "w-full h-10 lg:h-12 rounded-lg text-sm lg:text-base font-medium transition-all duration-200 "
              if (status.isDisabled) {
                buttonClass += "text-slate-400 dark:text-slate-600 cursor-not-allowed"
              } else if (status.isSelectedStart || status.isSelectedEnd) {
                buttonClass += "bg-blue-500 text-white hover:bg-blue-600 shadow-sm"
              } else if (status.isInRange || status.isHoveredInRange) {
                buttonClass += "bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900/50"
              } else {
                buttonClass += "text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700"
              }
              return (
                <button
                  key={date.toISOString()}
                  data-date={date.toISOString().slice(0, 10)}
                  onClick={() => handleDateClick(date)}
                  onMouseEnter={() => handleDateHover(date)}
                  onMouseLeave={() => handleDateHover(null)}
                  disabled={status.isDisabled}
                  className={buttonClass}
                  aria-label={`Seleziona ${date.toLocaleDateString(locale, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}`}
                  aria-disabled={status.isDisabled}
                >
                  {dayNumber}
                </button>
              )
            })}
          </div>
        </div>

        <div className="flex items-center justify-between p-4 border-t border-slate-200 dark:border-slate-700">
          <button
            onClick={clearSelection}
            className="text-sm text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition-colors py-2 px-3"
          >
            Pulisci selezione
          </button>
          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors"
            >
              Annulla
            </button>
            <button
              onClick={applyRange}
              disabled={!selectedRange.start || !selectedRange.end}
              className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-all duration-200"
            >
              Applica
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}