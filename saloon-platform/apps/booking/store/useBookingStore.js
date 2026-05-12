import { create } from 'zustand';

export const useBookingStore = create((set) => ({
  step: 1,
  selectedService: null,
  selectedStaff: null,
  selectedDate: null,
  selectedTime: null,
  
  setStep: (step) => set({ step }),
  nextStep: () => set((state) => ({ step: state.step + 1 })),
  prevStep: () => set((state) => ({ step: Math.max(1, state.step - 1) })),
  
  setService: (service) => set({ selectedService: service }),
  setStaff: (staff) => set({ selectedStaff: staff }),
  setDate: (date) => set({ selectedDate: date }),
  setTime: (time) => set({ selectedTime: time }),
  
  resetBooking: () => set({
    step: 1,
    selectedService: null,
    selectedStaff: null,
    selectedDate: null,
    selectedTime: null,
  })
}));
