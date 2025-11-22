'use client'

import { useState } from 'react'
import { Clock, Plus, Trash2 } from 'lucide-react'
import { WorkingHours } from '@/types'

interface WorkingHoursInputProps {
  value: WorkingHours
  onChange: (hours: WorkingHours) => void
}

const WEEKDAYS = [
  { key: 'mon', label: 'Montag' },
  { key: 'tue', label: 'Dienstag' },
  { key: 'wed', label: 'Mittwoch' },
  { key: 'thu', label: 'Donnerstag' },
  { key: 'fri', label: 'Freitag' },
  { key: 'sat', label: 'Samstag' },
  { key: 'sun', label: 'Sonntag' }
] as const

// Generating time options - there's probably a better way but this works
const HOUR_OPTIONS = [
  '00:00', '01:00', '02:00', '03:00', '04:00', '05:00', 
  '06:00', '07:00', '08:00', '09:00', '10:00', '11:00',
  '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', 
  '18:00', '19:00', '20:00', '21:00', '22:00', '23:00'
]

// Type helper for when we're not dealing with '24/7' string
type WorkingHoursObj = Exclude<WorkingHours, '24/7'>

export default function WorkingHoursInput({ value, onChange }: WorkingHoursInputProps) {
  const [currentlyExpandedDay, setCurrentlyExpandedDay] = useState<string | null>(null)

  // Internal conversion - handle the '24/7' case vs object case
  const hoursAsObject: WorkingHoursObj = value === '24/7' 
    ? { mon: '24/7', tue: '24/7', wed: '24/7', thu: '24/7', fri: '24/7', sat: '24/7', sun: '24/7' }
    : value

  const toggle24HoursForDay = (dayKey: keyof WorkingHoursObj) => {
    let updatedHours: WorkingHours
    
    if (hoursAsObject[dayKey] === '24/7') {
      // Change from 24/7 to normal hours - let's use 8-17 as default
      const updated = { ...hoursAsObject }
      updated[dayKey] = ["08:00", "17:00"]
      updatedHours = updated
    } else {
      // Change to 24/7 mode
      const updated = { ...hoursAsObject }
      updated[dayKey] = '24/7'
      updatedHours = updated
    }
    
    onChange(updatedHours)
  }

  const addNewTimeSlot = (dayKey: keyof WorkingHoursObj) => {
    const existingSlots = Array.isArray(hoursAsObject[dayKey]) ? hoursAsObject[dayKey] as string[] : []
    
    let newSlots: string[]
    
    // Figure out what the new time slot should be
    if (existingSlots.length >= 2) {
      // We already have time slots - add another one after the last
      const lastEndTime = existingSlots[existingSlots.length - 1]
      const nextStartTime = addHoursToTime(lastEndTime, 1) // Start 1 hour later
      const nextEndTime = addHoursToTime(nextStartTime, 8) // 8-hour shift seems reasonable
      
      newSlots = [...existingSlots, nextStartTime, nextEndTime]
    } else {
      // First time slot - using standard business hours
      newSlots = ["08:00", "17:00"]
    }
    
    const updatedHours: WorkingHours = {
      ...hoursAsObject,
      [dayKey]: newSlots
    }
    
    onChange(updatedHours)
  }

const deleteTimeSlot = (dayKey: keyof WorkingHoursObj, slotIndex: number) => {
  const existingSlots = Array.isArray(hoursAsObject[dayKey]) ? hoursAsObject[dayKey] as string[] : []
  
  if (existingSlots.length <= 2) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { [dayKey]: deletedDay, ...remainingDays } = hoursAsObject
    onChange(remainingDays)
  } else {
    const modifiedSlots = [...existingSlots]
    modifiedSlots.splice(slotIndex * 2, 2)
    
    const updatedHours: WorkingHours = {
      ...hoursAsObject,
      [dayKey]: modifiedSlots
    }
    
    onChange(updatedHours)
  }
}

  const changeTimeSlot = (dayKey: keyof WorkingHoursObj, slotIndex: number, timePosition: number, newTimeValue: string) => {
    const existingSlots = Array.isArray(hoursAsObject[dayKey]) ? hoursAsObject[dayKey] as string[] : []
    
    const modifiedSlots = [...existingSlots]
    const targetIndex = slotIndex * 2 + timePosition
    
    // Basic validation - start time should be before end time
    if (timePosition === 0 && slotIndex * 2 + 1 < modifiedSlots.length) {
      const correspondingEndTime = modifiedSlots[slotIndex * 2 + 1]
      if (newTimeValue >= correspondingEndTime) return // Don't allow invalid times
    } else if (timePosition === 1 && slotIndex * 2 < modifiedSlots.length) {
      const correspondingStartTime = modifiedSlots[slotIndex * 2]
      if (newTimeValue <= correspondingStartTime) return // Don't allow invalid times
    }
    
    modifiedSlots[targetIndex] = newTimeValue
    
    const updatedHours: WorkingHours = {
      ...hoursAsObject,
      [dayKey]: modifiedSlots
    }
    
    onChange(updatedHours)
  }

  // Helper function to add hours to a time string
  const addHoursToTime = (timeString: string, hoursToAdd: number): string => {
    const [hourPart] = timeString.split(':')
    let newHour = parseInt(hourPart) + hoursToAdd
    if (newHour >= 24) newHour -= 24
    if (newHour < 0) newHour += 24
    
    return `${newHour.toString().padStart(2, '0')}:00`
  }

  const parseTimeSlotsForDay = (dayKey: keyof WorkingHoursObj) => {
    const daySchedule = hoursAsObject[dayKey]
    if (daySchedule === '24/7') return []
    if (!Array.isArray(daySchedule)) return []
    
    const timePairs = []
    for (let i = 0; i < daySchedule.length; i += 2) {
      if (daySchedule[i] && daySchedule[i + 1]) {
        timePairs.push({
          startTime: daySchedule[i],
          endTime: daySchedule[i + 1]
        })
      }
    }
    return timePairs
  }

const toggleDayEnabled = (dayKey: keyof WorkingHoursObj, isEnabled: boolean) => {
  if (isEnabled) {
    const updatedHours: WorkingHours = {
      ...hoursAsObject,
      [dayKey]: ["08:00", "17:00"]
    }
    onChange(updatedHours)
  } else {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { [dayKey]: removedDay, ...remainingDays } = hoursAsObject
    onChange(remainingDays)
  }
}

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 mb-6">
        <Clock className="w-5 h-5 text-yellow-600" />
        <span className="font-semibold text-gray-900 text-lg">Öffnungszeiten konfigurieren</span>
      </div>

      <div className="space-y-2">
        {WEEKDAYS.map((dayInfo) => {
          const daySchedule = hoursAsObject[dayInfo.key]
          const isAlwaysOpen = daySchedule === '24/7'
          const scheduledSlots = parseTimeSlotsForDay(dayInfo.key)
          const isDayExpanded = currentlyExpandedDay === dayInfo.key
          const isDayActive = dayInfo.key in hoursAsObject

          return (
            <div key={dayInfo.key} className="border-2 border-gray-300 rounded-xl overflow-hidden shadow-sm">
              {/* Main day header with controls */}
              <div 
                className="flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 cursor-pointer transition-all duration-200"
                onClick={() => setCurrentlyExpandedDay(isDayExpanded ? null : dayInfo.key)}
              >
                <div className="flex items-center gap-4">
                  <input
                    type="checkbox"
                    checked={isDayActive}
                    onChange={(e) => toggleDayEnabled(dayInfo.key, e.target.checked)}
                    className="w-4 h-4 text-yellow-500 border-gray-300 rounded focus:ring-yellow-500 focus:ring-2"
                    onClick={(e) => e.stopPropagation()}
                  />
                  <span className="font-medium text-gray-900 text-base">{dayInfo.label}</span>
                </div>

                <div className="flex items-center gap-4">
                  {isDayActive && (
                    <>
                      {/* 24/7 toggle */}
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          id={`always-open-${dayInfo.key}`}
                          checked={isAlwaysOpen}
                          onChange={(e) => {
                            e.stopPropagation()
                            toggle24HoursForDay(dayInfo.key)
                          }}
                          className="w-4 h-4 text-green-500 border-gray-300 rounded focus:ring-green-500"
                        />
                        <label 
                          htmlFor={`always-open-${dayInfo.key}`}
                          className="text-sm text-gray-700 cursor-pointer select-none"
                          onClick={(e) => e.stopPropagation()}
                        >
                          Durchgehend geöffnet
                        </label>
                      </div>
                      
                      {/* Show current time slots summary */}
                      {!isAlwaysOpen && scheduledSlots.length > 0 && (
                        <div className="text-sm text-gray-600 flex gap-2">
                          {scheduledSlots.map((slot, index) => (
                            <span key={index} className="bg-yellow-100 px-3 py-1 rounded-full text-xs font-medium">
                              {slot.startTime} - {slot.endTime}
                            </span>
                          ))}
                        </div>
                      )}
                      
                      {/* 24/7 indicator */}
                      {isAlwaysOpen && (
                        <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold">
                          Rund um die Uhr
                        </span>
                      )}
                    </>
                  )}
                  
                  {/* Expand/collapse arrow */}
                  <div className={`transform transition-transform duration-300 ${isDayExpanded ? 'rotate-180' : ''}`}>
                    <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Detailed time slot editor (shown when expanded) */}
              {isDayExpanded && isDayActive && !isAlwaysOpen && (
                <div className="p-4 bg-white border-t border-gray-200">
                  <div className="space-y-3">
                    {scheduledSlots.map((timeSlot, slotNumber) => (
                      <div key={slotNumber} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                        <div className="flex items-center gap-3 flex-1">
                          {/* Start time dropdown */}
                          <select
                            value={timeSlot.startTime}
                            onChange={(e) => changeTimeSlot(dayInfo.key, slotNumber, 0, e.target.value)}
                            className="px-3 py-2 border border-gray-300 rounded-lg focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/20 text-sm"
                          >
                            {HOUR_OPTIONS.map(hourOption => (
                              <option key={hourOption} value={hourOption}>{hourOption}</option>
                            ))}
                          </select>
                          
                          <span className="text-gray-500 font-medium">–</span>
                          
                          {/* End time dropdown */}
                          <select
                            value={timeSlot.endTime}
                            onChange={(e) => changeTimeSlot(dayInfo.key, slotNumber, 1, e.target.value)}
                            className="px-3 py-2 border border-gray-300 rounded-lg focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/20 text-sm"
                          >
                            {HOUR_OPTIONS.map(hourOption => (
                              <option key={hourOption} value={hourOption}>{hourOption}</option>
                            ))}
                          </select>
                        </div>
                        
                        {/* Delete button for this time slot */}
                        <button
                          type="button"
                          onClick={() => deleteTimeSlot(dayInfo.key, slotNumber)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
                          title="Zeitspanne löschen"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                    
                    {/* Add new time slot button */}
                    <button
                      type="button"
                      onClick={() => addNewTimeSlot(dayInfo.key)}
                      className="flex items-center gap-2 px-4 py-3 text-yellow-600 hover:bg-yellow-50 rounded-lg transition-colors duration-200 border-2 border-dashed border-yellow-300 w-full justify-center"
                    >
                      <Plus className="w-4 h-4" />
                      Zusätzliche Öffnungszeit hinzufügen
                    </button>
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Preset buttons for common schedules */}
      <div className="pt-6 border-t border-gray-200 mt-6">
        <p className="text-sm font-medium text-gray-700 mb-4">Vorgefertigte Zeitpläne:</p>
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => onChange({
              mon: ["08:00", "17:00"],
              tue: ["08:00", "17:00"],
              wed: ["08:00", "17:00"],
              thu: ["08:00", "17:00"],
              fri: ["08:00", "17:00"],
              sat: ["09:00", "14:00"],
              sun: ["10:00", "13:00"]
            })}
            className="px-4 py-2 text-sm bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors duration-200 font-medium"
          >
            Normale Geschäftszeiten
          </button>
          
          <button
            type="button"
            onClick={() => onChange('24/7')}
            className="px-4 py-2 text-sm bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors duration-200 font-medium"
          >
            Durchgehend geöffnet
          </button>
          
          <button
            type="button"
            onClick={() => onChange({})}
            className="px-4 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-200 font-medium"
          >
            Alle zurücksetzen
          </button>
        </div>
      </div>
    </div>
  )
}