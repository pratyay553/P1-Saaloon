"use client";

import { useBookingStore } from '../../store/useBookingStore';
import { Button } from '@saloon/ui';
import { format, addDays, formatISO } from 'date-fns';
import { Calendar as CalendarIcon, Clock } from 'lucide-react';
import { useState } from 'react';

export function DateTimeSelection() {
  const { selectedDate, setDate, selectedTime, setTime, nextStep, prevStep } = useBookingStore();
  
  // Generate next 7 days
  const next7Days = Array.from({ length: 7 }).map((_, i) => addDays(new Date(), i));
  
  // Mock time slots
  const timeSlots = ['09:00 AM', '09:30 AM', '10:00 AM', '11:00 AM', '01:00 PM', '02:30 PM', '04:00 PM'];

  return (
    <div className="flex flex-col h-full">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-900">Select Date & Time</h2>
        <p className="text-slate-500 mt-1">When would you like to come in?</p>
      </div>

      <div className="flex-1 overflow-y-auto pr-2 space-y-8">
        {/* Date Selection */}
        <div>
          <div className="flex items-center gap-2 mb-4 text-slate-900 font-semibold">
            <CalendarIcon className="w-5 h-5 text-primary" />
            <h3>Choose a Day</h3>
          </div>
          <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide">
            {next7Days.map((date) => {
              const isSelected = selectedDate && formatISO(selectedDate, { representation: 'date' }) === formatISO(date, { representation: 'date' });
              return (
                <div
                  key={date.toISOString()}
                  onClick={() => { setDate(date); setTime(null); }}
                  className={`flex-shrink-0 flex flex-col items-center justify-center w-16 h-20 rounded-xl border-2 cursor-pointer transition-all ${
                    isSelected ? 'border-primary bg-primary text-white shadow-md shadow-primary/20' : 'border-slate-200 hover:border-primary/50 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <span className={`text-xs uppercase font-medium ${isSelected ? 'text-primary-100' : 'text-slate-500'}`}>
                    {format(date, 'EEE')}
                  </span>
                  <span className="text-xl font-bold mt-1">
                    {format(date, 'd')}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Time Selection */}
        {selectedDate && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
            <div className="flex items-center gap-2 mb-4 text-slate-900 font-semibold">
              <Clock className="w-5 h-5 text-primary" />
              <h3>Available Times for {format(selectedDate, 'MMM do')}</h3>
            </div>
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
              {timeSlots.map((time) => {
                const isSelected = selectedTime === time;
                return (
                  <div
                    key={time}
                    onClick={() => setTime(time)}
                    className={`py-3 text-center rounded-lg border-2 cursor-pointer font-medium transition-all text-sm ${
                      isSelected ? 'border-primary bg-primary/10 text-primary shadow-sm' : 'border-slate-200 text-slate-700 hover:border-primary/50 hover:bg-slate-50'
                    }`}
                  >
                    {time}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      <div className="mt-8 flex justify-between pt-4 border-t border-slate-100">
        <Button onClick={prevStep} variant="ghost" size="lg">Back</Button>
        <Button onClick={nextStep} disabled={!selectedDate || !selectedTime} size="lg">Review Booking</Button>
      </div>
    </div>
  );
}
