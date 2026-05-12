"use client";

import { useBookingStore } from '../../store/useBookingStore';
import { Button } from '@saloon/ui';
import { User, Star } from 'lucide-react';

const mockStaff = [
  { id: 'st1', name: 'Emily Rose', role: 'Senior Stylist', rating: '4.9', reviews: 124 },
  { id: 'st2', name: 'David Thompson', role: 'Color Specialist', rating: '5.0', reviews: 89 },
  { id: 'st3', name: 'Anyone Available', role: 'First Available', rating: '-', reviews: 0, isAny: true },
];

export function StaffSelection() {
  const { selectedStaff, setStaff, nextStep, prevStep } = useBookingStore();

  return (
    <div className="flex flex-col h-full">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-900">Select a Professional</h2>
        <p className="text-slate-500 mt-1">Choose who you'd like to book with</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 flex-1 overflow-y-auto pr-2">
        {mockStaff.map((staff) => {
          const isSelected = selectedStaff?.id === staff.id;
          return (
            <div
              key={staff.id}
              onClick={() => setStaff(staff)}
              className={`relative p-5 rounded-xl border-2 cursor-pointer transition-all flex flex-col items-center text-center ${
                isSelected ? 'border-primary bg-primary/5 shadow-md shadow-primary/10' : 'border-slate-200 hover:border-primary/50 hover:bg-slate-50'
              }`}
            >
              <div className={`w-20 h-20 rounded-full flex items-center justify-center mb-4 ${staff.isAny ? 'bg-slate-100 text-slate-400' : 'bg-slate-200 text-slate-600'}`}>
                <User className="w-10 h-10" />
              </div>
              <h3 className="font-semibold text-slate-900 text-lg">{staff.name}</h3>
              <p className="text-sm text-slate-500 mb-3">{staff.role}</p>
              
              {!staff.isAny && (
                <div className="flex items-center gap-1 text-sm font-medium text-slate-700 bg-amber-50 px-2 py-1 rounded-full text-amber-700">
                  <Star className="w-4 h-4 fill-current" />
                  {staff.rating} <span className="text-amber-700/60 font-normal">({staff.reviews})</span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-8 flex justify-between pt-4 border-t border-slate-100">
        <Button onClick={prevStep} variant="ghost" size="lg">Back</Button>
        <Button onClick={nextStep} disabled={!selectedStaff} size="lg">Continue to Time</Button>
      </div>
    </div>
  );
}
