"use client";

import { useQuery } from '@tanstack/react-query';
import { useBookingStore } from '../../store/useBookingStore';
import { getServices } from '@saloon/services';
import { Button } from '@saloon/ui';
import { Scissors } from 'lucide-react';

const ServiceSkeleton = () => (
  <div className="p-4 rounded-xl border-2 border-slate-200 animate-pulse">
    <div className="flex items-start gap-4">
      <div className="p-3 rounded-lg bg-slate-200 w-12 h-12"></div>
      <div className="flex-1 space-y-2">
        <div className="h-5 w-3/4 bg-slate-200 rounded"></div>
        <div className="h-4 w-full bg-slate-200 rounded"></div>
        <div className="h-4 w-1/2 bg-slate-200 rounded"></div>
      </div>
    </div>
  </div>
);

export function ServiceSelection() {
  const { selectedService, setService, nextStep } = useBookingStore();
  
  const { data: services, isLoading, error } = useQuery({
    queryKey: ['services'],
    queryFn: getServices,
  });

  return (
    <div className="flex flex-col h-full">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-900">Select a Service</h2>
        <p className="text-slate-500 mt-1">Choose from our premium offerings</p>
      </div>

      <div className="space-y-4 flex-1 overflow-y-auto pr-2">
        {isLoading && (
          <>
            <ServiceSkeleton />
            <ServiceSkeleton />
            <ServiceSkeleton />
          </>
        )}

        {error && (
          <div className="p-4 rounded-xl border-2 border-red-200 bg-red-50 text-red-700">
            <h3 className="font-semibold">Error Fetching Services</h3>
            <p className="text-sm">{error.message}</p>
          </div>
        )}

        {services && services.map((service) => {
          const isSelected = selectedService?.id === service.id;
          return (
            <div
              key={service.id}
              onClick={() => setService(service)}
              className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                isSelected ? 'border-primary bg-primary/5 shadow-md shadow-primary/10' : 'border-slate-200 hover:border-primary/50 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-start gap-4">
                <div className={`p-3 rounded-lg ${isSelected ? 'bg-primary text-white' : 'bg-slate-100 text-slate-600'}`}>
                  <Scissors className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <h3 className="font-semibold text-slate-900 text-lg">{service.name}</h3>
                    <span className="font-bold text-slate-900">${service.price}</span>
                  </div>
                  <p className="text-sm text-slate-500 mt-1">{service.description}</p>
                  <div className="mt-3 inline-flex items-center rounded-md bg-slate-100 px-2 py-1 text-xs font-medium text-slate-600">
                    {service.duration} min
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-8 flex justify-end pt-4 border-t border-slate-100">
        <Button onClick={nextStep} disabled={!selectedService || isLoading} size="lg">
          Continue to Staff
        </Button>
      </div>
    </div>
  );
}
