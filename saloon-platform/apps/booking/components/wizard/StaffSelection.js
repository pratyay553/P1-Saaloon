"use client";

import { useQuery } from '@tanstack/react-query';
import { useBookingStore } from '../../store/useBookingStore';
import { getStaff } from '@saloon/services';
import { Button } from '@saloon/ui';
import { User, Star } from 'lucide-react';

const StaffSkeleton = () => (
  <div className="relative p-5 rounded-xl border-2 border-slate-200 animate-pulse flex flex-col items-center text-center">
    <div className="w-20 h-20 rounded-full bg-slate-200 mb-4"></div>
    <div className="h-5 w-3/4 bg-slate-200 rounded mb-2"></div>
    <div className="h-4 w-1/2 bg-slate-200 rounded"></div>
  </div>
);

export function StaffSelection() {
  const { selectedStaff, setStaff, nextStep, prevStep } = useBookingStore();

  const { data: staffList, isLoading, error } = useQuery({
    queryKey: ['staff'],
    queryFn: getStaff,
  });

  // Add a "Anyone Available" option to the fetched staff list
  const staffWithOptions = staffList ? [...staffList, { id: 'any', name: 'Anyone Available', role: 'First Available', isAny: true }] : [];

  return (
    <div className="flex flex-col h-full">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-900">Select a Professional</h2>
        <p className="text-slate-500 mt-1">Choose who you'd like to book with</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 flex-1 overflow-y-auto pr-2">
        {isLoading && (
          <>
            <StaffSkeleton />
            <StaffSkeleton />
            <StaffSkeleton />
          </>
        )}

        {error && (
          <div className="p-4 rounded-xl border-2 border-red-200 bg-red-50 text-red-700 col-span-full">
            <h3 className="font-semibold">Error Fetching Staff</h3>
            <p className="text-sm">{error.message}</p>
          </div>
        )}

        {staffWithOptions.map((staff) => {
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
                  {/* Assuming staff has a rating field from backend */}
                  {staff.rating || 'N/A'} <span className="text-amber-700/60 font-normal">({staff.reviews || 0})</span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-8 flex justify-between pt-4 border-t border-slate-100">
        <Button onClick={prevStep} variant="ghost" size="lg">Back</Button>
        <Button onClick={nextStep} disabled={!selectedStaff || isLoading} size="lg">Continue to Time</Button>
      </div>
    </div>
  );
}
