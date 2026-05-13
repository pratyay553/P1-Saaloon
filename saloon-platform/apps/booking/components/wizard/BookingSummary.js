"use client";

import { useBookingStore } from '../../store/useBookingStore';
import { Button } from '@saloon/ui';
import { format, parseISO } from 'date-fns';
import { CalendarIcon, Clock, MapPin, User, CheckCircle2 } from 'lucide-react';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { useMutation } from '@tanstack/react-query';
import { createAppointment } from '@saloon/services';

export function BookingSummary() {
  const { selectedService, selectedStaff, selectedDate, selectedTime, prevStep, resetBooking } = useBookingStore();
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [bookingError, setBookingError] = useState(null);

  const bookingMutation = useMutation({
    mutationFn: createAppointment,
    onSuccess: () => {
      setIsConfirmed(true);
      setBookingError(null);
    },
    onError: (error) => {
      setBookingError(error.response?.data?.message || 'Failed to book appointment. Please try again.');
      console.error("Booking error:", error);
    },
  });

  const handleConfirm = () => {
    if (!selectedService || !selectedStaff || !selectedDate || !selectedTime) {
      setBookingError("Please complete all booking selections.");
      return;
    }

    // Combine date and time into a single ISO string for the backend
    const dateTimeString = `${format(selectedDate, 'yyyy-MM-dd')}T${selectedTime.split(' ')[0]}:00`;
    const appointmentDateTime = parseISO(dateTimeString);

    const bookingRequest = {
      serviceId: selectedService.id,
      staffId: selectedStaff.id === 'any' ? null : selectedStaff.id,
      appointmentDateTime: appointmentDateTime.toISOString(),
    };

    bookingMutation.mutate(bookingRequest);
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
        {bookingError && (
          <div className="p-3 text-sm text-red-600 bg-red-50 rounded-lg border border-red-100 mb-4">
            {bookingError}
          </div>
        )}
        <div className="bg-slate-50 rounded-2xl border border-slate-200 p-6 space-y-6">
          
          <div className="flex justify-between items-start border-b border-slate-200 pb-6">
            <div>
              <h3 className="text-xl font-bold text-slate-900">{selectedService?.name}</h3>
              <p className="text-slate-500 mt-1">{selectedService?.duration} min</p>
            </div>
            <span className="text-xl font-bold text-slate-900">${selectedService?.price}</span>
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
        <Button onClick={prevStep} variant="ghost" size="lg" disabled={bookingMutation.isPending}>Back</Button>
        <Button onClick={handleConfirm} size="lg" isLoading={bookingMutation.isPending}>Confirm Booking</Button>
      </div>
    </div>
  );
}
