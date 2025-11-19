import { useState, useEffect } from 'react'
import { Calendar } from 'lucide-react'

interface TravelDateSelectorProps {
  onOpenChange?: (isOpen: boolean) => void
  startDate?: string
  endDate?: string
}

export default function TravelDateSelector({ 
  onOpenChange,
  startDate: externalStartDate,
  endDate: externalEndDate
}: TravelDateSelectorProps) {
  const [localStartDate, setLocalStartDate] = useState<string>(externalStartDate || '')
  const [localEndDate, setLocalEndDate] = useState<string>(externalEndDate || '')
  
  // Sync with external date changes
  useEffect(() => {
    if (externalStartDate !== undefined) {
      setLocalStartDate(externalStartDate)
    }
    if (externalEndDate !== undefined) {
      setLocalEndDate(externalEndDate)
    }
  }, [externalStartDate, externalEndDate])

  // Handle open/close changes
  const handleOpenChange = (open: boolean) => {
    onOpenChange?.(open)
  }

  // Format date for display
  const formatDateDisplay = (dateString: string): string => {
    if (!dateString) return ''
    const date = new Date(dateString)
    return date.toLocaleDateString('it-IT', {
      day: '2-digit',
      month: 'short'
    }).replace(/\./g, '')
  }

  // Funzione per formattare il testo del soggiorno con gestione singolare/plurale
  const getStayDurationText = (): string => {
    if (localStartDate && localEndDate) {
      const actualDays = calculateDays(localStartDate, localEndDate)
      if (actualDays === 1) {
        return "1 giorno"
      } else {
        return `${actualDays} giorni`
      }
    }
    return 'Durata del soggiorno'
  }

  // Calculate days between two dates
  const calculateDays = (startDate: string, endDate: string): number => {
    const start = new Date(startDate)
    const end = new Date(endDate)
    const timeDiff = Math.abs(end.getTime() - start.getTime())
    const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24)) + 1
    return daysDiff
  }

  return (
    <>
      <div className="relative flex items-center justify-center bg-white/12 border border-white/20 rounded-full px-2 md:px-3 py-2 md:py-2.5 shadow-[0_0_16px_rgba(255,138,61,.14)] backdrop-blur-md w-full">
        <div className="flex items-center justify-center bg-transparent border-0 rounded-full px-0 py-0 shadow-none backdrop-blur-none w-full">
          {/* Calendar icon */}
          <Calendar className="w-4 h-4 md:w-5 md:h-5 text-slate-300" />

          {/* Single horizontal line layout with date range and duration */}
          <span
            onClick={() => handleOpenChange(true)}
            role="button"
            aria-label="Seleziona date del viaggio"
            className="flex items-center justify-center bg-transparent rounded-full px-3 md:px-4 py-1 md:py-1.5 text-white focus:outline-none text-sm md:text-base text-center cursor-pointer hover:bg-white/5 transition-colors duration-200"
            style={{color: '#e5e7eb'}}
          >
            {localStartDate && localEndDate ? (
              <span className="flex items-center space-x-2">
                <span className="text-xs opacity-75">
                  {formatDateDisplay(localStartDate)} - {formatDateDisplay(localEndDate)}
                </span>
                <span className="text-xs text-slate-300">•</span>
                <span className="text-xs">{getStayDurationText()}</span>
              </span>
            ) : (
              <span className="opacity-75">Durata del soggiorno</span>
            )}
          </span>
        </div>
      </div>

      {/* Enhanced Date Picker Modal - Ora gestito globalmente */}
      {/* Il rendering del date picker è stato spostato in App.tsx */}
    </>
  )
}