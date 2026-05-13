export default function BookingsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold tracking-tight text-slate-900">Bookings Overview</h1>
      <p className="text-slate-500">This page will contain an overview of all bookings.</p>
      <p className="text-sm text-slate-400">
        To access the booking wizard, please navigate to the standalone booking application.
      </p>
      <a 
        href="http://localhost:3002" 
        target="_blank" 
        rel="noopener noreferrer" 
        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
      >
        Go to Booking App (Standalone)
      </a>
    </div>
  );
}
