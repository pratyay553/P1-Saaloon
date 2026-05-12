"use client";

import { useBookingStore } from '../../store/useBookingStore';
import { ServiceSelection } from './ServiceSelection';
import { StaffSelection } from './StaffSelection';
import { DateTimeSelection } from './DateTimeSelection';
import { BookingSummary } from './BookingSummary';
import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle2 } from 'lucide-react';

const steps = [
  { id: 1, name: 'Service' },
  { id: 2, name: 'Staff' },
  { id: 3, name: 'Time' },
  { id: 4, name: 'Summary' },
];

export function BookingWizard() {
  const step = useBookingStore((state) => state.step);

  return (
    <div className="flex flex-col md:flex-row min-h-[600px]">
      {/* Sidebar Progress */}
      <div className="w-full md:w-64 bg-slate-900 p-8 text-white hidden md:block">
        <h2 className="text-xl font-bold mb-8">Booking Progress</h2>
        <div className="space-y-6">
          {steps.map((s) => (
            <div key={s.id} className="flex items-center gap-4">
              <div className={`flex items-center justify-center w-8 h-8 rounded-full border-2 transition-colors ${step > s.id ? 'bg-primary border-primary' : step === s.id ? 'border-primary text-primary' : 'border-slate-700 text-slate-500'}`}>
                {step > s.id ? <CheckCircle2 className="w-5 h-5 text-white" /> : <span className="text-sm font-semibold">{s.id}</span>}
              </div>
              <span className={`font-medium ${step >= s.id ? 'text-white' : 'text-slate-500'}`}>{s.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Mobile Progress */}
      <div className="md:hidden bg-slate-900 p-4 text-white flex justify-between items-center">
         <span className="font-semibold">Step {step} of 4: {steps.find(s => s.id === step)?.name}</span>
         <div className="flex gap-1">
            {steps.map(s => (
               <div key={s.id} className={`h-2 w-8 rounded-full ${step >= s.id ? 'bg-primary' : 'bg-slate-700'}`} />
            ))}
         </div>
      </div>

      {/* Wizard Content */}
      <div className="flex-1 p-6 sm:p-10 bg-white relative overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="h-full"
          >
            {step === 1 && <ServiceSelection />}
            {step === 2 && <StaffSelection />}
            {step === 3 && <DateTimeSelection />}
            {step === 4 && <BookingSummary />}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
