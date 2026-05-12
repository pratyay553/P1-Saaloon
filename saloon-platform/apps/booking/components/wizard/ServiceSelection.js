"use client";

import { useBookingStore } from '../../store/useBookingStore';
import { Button } from '@saloon/ui';
import { Scissors, Sparkles, Droplets } from 'lucide-react';

const mockServices = [
  { id: 's1', name: 'Women\'s Haircut', duration: '60 min', price: '$80', icon: Scissors, description: 'Includes wash, cut, and signature blowout.' },
  { id: 's2', name: 'Balayage & Color', duration: '180 min', price: '$220', icon: Sparkles, description: 'Hand-painted highlights for a natural, sun-kissed look.' },
  { id: 's3', name: 'Deep Conditioning', duration: '45 min', price: '$45', icon: Droplets, description: 'Intensive moisture treatment for dry or damaged hair.' },
];

export function ServiceSelection() {
  const { selectedService, setService, nextStep } = useBookingStore();

  return (
    <div className="flex flex-col h-full">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-900">Select a Service</h2>
        <p className="text-slate-500 mt-1">Choose from our premium offerings</p>
      </div>

      <div className="space-y-4 flex-1 overflow-y-auto pr-2">
        {mockServices.map((service) => {
          const isSelected = selectedService?.id === service.id;
          const Icon = service.icon;
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
                  <Icon className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <h3 className="font-semibold text-slate-900 text-lg">{service.name}</h3>
                    <span className="font-bold text-slate-900">{service.price}</span>
                  </div>
                  <p className="text-sm text-slate-500 mt-1">{service.description}</p>
                  <div className="mt-3 inline-flex items-center rounded-md bg-slate-100 px-2 py-1 text-xs font-medium text-slate-600">
                    {service.duration}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-8 flex justify-end pt-4 border-t border-slate-100">
        <Button onClick={nextStep} disabled={!selectedService} size="lg">
          Continue to Staff
        </Button>
      </div>
    </div>
  );
}
