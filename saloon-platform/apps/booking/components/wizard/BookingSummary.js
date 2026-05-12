"use client";

import { useBookingStore } from '../../store/useBookingStore';
import { Button } from '@saloon/ui';
import { format } from 'date-fns';
import { CalendarIcon, Clock, MapPin, User, CheckCircle2 } from 'lucide-react';
import { useState } from 'react';
import { motion } from 'framer-motion';

export function BookingSummary() {
  const { selectedService, selectedStaff, selectedDate, selectedTime, prevStep, resetBooking } = useBookingStore();
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleConfirm = () => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setIsConfirmed(true);
    }, 1500);
  };

  if (isConfirmed) {
    return (
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="flex flex-col items-center justify-center h-full text-center py-10"
      >
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
          <CheckCircle2 className="w-10 h-10 text-green-600" />
        </div>
        <h2 className="text-3xl font-bold text-slate-900 mb-2">Booking Confirmed!</h2>
        <p className="text-slate-500 mb-8 max-w-md">
          Your appointment for <span className="font-semibold text-slate-900">{selectedService?.name}</span> on <span className="font-semibold text-slate-900">{format(selectedDate, 'MMM do')} at {selectedTime}</span> has been confirmed. We've sent you an email with the details.
        </p>
        <Button onClick={resetBooking} size="lg">Book Another Appointment</Button>
      </motion.div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-900">Review & Confirm</h2>
        <p className="text-slate-500 mt-1">Please check your appointment details</p>
      </div>

      <div className="flex-1 overflow-y-auto pr-2">
        <div className="bg-slate-50 rounded-2xl border border-slate-200 p-6 space-y-6">
          
          <div className="flex justify-between items-start border-b border-slate-200 pb-6">
            <div>
              <h3 className="text-xl font-bold text-slate-900">{selectedService?.name}</h3>
              <p className="text-slate-500 mt-1">{selectedService?.duration}</p>
            </div>
            <span className="text-xl font-bold text-slate-900">{selectedService?.price}</span>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-3 text-slate-700">
              <CalendarIcon className="w-5 h-5 text-primary" />
              <span className="font-medium">{selectedDate ? format(selectedDate, 'EEEE, MMMM do, yyyy') : ''}</span>
            </div>
            
            <div className="flex items-center gap-3 text-slate-700">
              <Clock className="w-5 h-5 text-primary" />
              <span className="font-medium">{selectedTime}</span>
            </div>

            <div className="flex items-center gap-3 text-slate-700">
              <User className="w-5 h-5 text-primary" />
              <span className="font-medium">with {selectedStaff?.name}</span>
            </div>

            <div className="flex items-center gap-3 text-slate-700">
              <MapPin className="w-5 h-5 text-primary" />
              <span className="font-medium">SAloon Downtown Flagship</span>
            </div>
          </div>
        </div>
        
        <div className="mt-6 text-sm text-slate-500 text-center px-4">
          By confirming, you agree to our cancellation policy. Cancellations made less than 24 hours in advance may be subject to a fee.
        </div>
      </div>

      <div className="mt-8 flex justify-between pt-4 border-t border-slate-100">
        <Button onClick={prevStep} variant="ghost" size="lg" disabled={isLoading}>Back</Button>
        <Button onClick={handleConfirm} size="lg" isLoading={isLoading}>Confirm Booking</Button>
      </div>
    </div>
  );
}
