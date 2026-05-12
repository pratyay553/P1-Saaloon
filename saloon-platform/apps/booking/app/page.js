import { BookingWizard } from '../components/wizard/BookingWizard';

export default function BookingPage() {
  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
            Book an Appointment
          </h1>
          <p className="mt-4 text-lg text-slate-500">
            Select a service, choose your preferred staff member, and find a time that works for you.
          </p>
        </div>
        
        <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/40 border border-slate-200 overflow-hidden">
          <BookingWizard />
        </div>
      </div>
    </div>
  );
}
