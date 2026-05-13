"use client";

import { useQuery } from '@tanstack/react-query';
import { useBookingStore } from '../../store/useBookingStore';
import { getAvailability } from '@saloon/services';
import { Button } from '@saloon/ui';
import { format, addDays, formatISO } from 'date-fns';
import { Calendar as CalendarIcon, Clock } from 'lucide-react';
import { useState, useEffect } from 'react';

const TimeSlotSkeleton = () => (
  <div className="h-10 bg-slate-200 rounded-lg animate-pulse"></div>
);

export function DateTimeSelection() {
  const { selectedService, selectedStaff, selectedDate, setDate, selectedTime, setTime, nextStep, prevStep } = useBookingStore();
  
  // Generate next 7 days
  const next7Days = Array.from({ length: 7 }).map((_, i) => addDays(new Date(), i));
  
  // Ensure selectedDate is always a valid Date object for the query
  useEffect(() => {
    if (!selectedDate) {
      setDate(next7Days[0]); // Default to today if no date is selected
    }
  }, [selectedDate, setDate, next7Days]);

  const requestData = {
    serviceId: selectedService?.id,
    staffId: selectedStaff?.id === 'any' ? null : selectedStaff?.id, // Send null for "Anyone Available"
    date: selectedDate ? format(selectedDate, 'yyyy-MM-dd') : null,
  };

  const { data: availability, isLoading, error } = useQuery({
    queryKey: ['availability', requestData],
    queryFn: () => getAvailability(requestData),
    enabled: !!selectedService && !!selectedStaff && !!selectedDate, // Only fetch if all prerequisites are met
  });

  const availableSlots = availability?.availableSlots || [];

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
            
            {isLoading && (
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                <TimeSlotSkeleton /><TimeSlotSkeleton /><TimeSlotSkeleton /><TimeSlotSkeleton />
              </div>
            )}

            {error && (
              <div className="p-4 rounded-xl border-2 border-red-200 bg-red-50 text-red-700">
                <h3 className="font-semibold">Error Fetching Slots</h3>
                <p className="text-sm">{error.message}</p>
              </div>
            )}

            {!isLoading && !error && availableSlots.length === 0 && (
              <div className="p-4 rounded-xl border-2 border-slate-200 bg-slate-50 text-slate-700 text-center">
                <p className="font-medium">No slots available for this day.</p>
                <p className="text-sm">Please choose another date or staff member.</p>
              </div>
            )}

            {!isLoading && !error && availableSlots.length > 0 && (
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                {availableSlots.map((time) => {
                  const formattedTime = format(new Date().setHours(time.split(':')[0], time.split(':')[1]), 'hh:mm a');
                  const isSelected = selectedTime === formattedTime;
                  return (
                    <div
                      key={time}
                      onClick={() => setTime(formattedTime)}
                      className={`py-3 text-center rounded-lg border-2 cursor-pointer font-medium transition-all text-sm ${
                        isSelected ? 'border-primary bg-primary/10 text-primary shadow-sm' : 'border-slate-200 text-slate-700 hover:border-primary/50 hover:bg-slate-50'
                      }`}
                    >
                      {formattedTime}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>

      <div className="mt-8 flex justify-between pt-4 border-t border-slate-100">
        <Button onClick={prevStep} variant="ghost" size="lg">Back</Button>
        <Button onClick={nextStep} disabled={!selectedDate || !selectedTime || isLoading} size="lg">Review Booking</Button>
      </div>
    </div>
  );
}
