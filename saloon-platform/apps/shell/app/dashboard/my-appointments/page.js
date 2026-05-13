"use client";

import { useQuery } from '@tanstack/react-query';
import { getMyAppointments } from '@saloon/services';
import { format } from 'date-fns';
import { CalendarIcon, Clock, User, Tag, Info } from 'lucide-react';

const AppointmentCardSkeleton = () => (
  <div className="flex items-center gap-4 p-4 rounded-lg border border-slate-100 bg-slate-50/50 animate-pulse">
    <div className="flex flex-col items-center justify-center w-16 h-16 rounded-md bg-slate-200 flex-shrink-0"></div>
    <div className="flex-1 min-w-0 space-y-2">
      <div className="h-5 bg-slate-200 rounded w-3/4"></div>
      <div className="h-4 bg-slate-200 rounded w-1/2"></div>
    </div>
    <div className="h-6 w-20 bg-slate-200 rounded-full"></div>
  </div>
);

export default function MyAppointmentsPage() {
  const { data: appointments, isLoading, error } = useQuery({
    queryKey: ['myAppointments'],
    queryFn: getMyAppointments,
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case 'SCHEDULED':
        return <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">Scheduled</span>;
      case 'COMPLETED':
        return <span className="inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">Completed</span>;
      case 'CANCELLED':
        return <span className="inline-flex items-center rounded-md bg-red-50 px-2 py-1 text-xs font-medium text-red-700 ring-1 ring-inset ring-red-600/20">Cancelled</span>;
      case 'NO_SHOW':
        return <span className="inline-flex items-center rounded-md bg-yellow-50 px-2 py-1 text-xs font-medium text-yellow-700 ring-1 ring-inset ring-yellow-600/20">No Show</span>;
      default:
        return <span className="inline-flex items-center rounded-md bg-gray-50 px-2 py-1 text-xs font-medium text-gray-700 ring-1 ring-inset ring-gray-600/20">{status}</span>;
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">My Appointments</h1>
          <p className="text-lg text-slate-500 mt-1">View your upcoming and past bookings.</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-lg shadow-slate-200/40 p-6">
        {isLoading && (
          <div className="space-y-4">
            <AppointmentCardSkeleton />
            <AppointmentCardSkeleton />
            <AppointmentCardSkeleton />
          </div>
        )}

        {error && (
          <div className="p-4 rounded-xl border-2 border-red-200 bg-red-50 text-red-700 text-center">
            <h3 className="font-semibold">Error Loading Appointments</h3>
            <p className="text-sm">{error.message}</p>
          </div>
        )}

        {!isLoading && !error && (!appointments || appointments.length === 0) && (
          <div className="p-8 text-center text-slate-500">
            <Info className="w-12 h-12 mx-auto mb-4 text-slate-400" />
            <h3 className="text-xl font-semibold">No Appointments Found</h3>
            <p className="mt-2">It looks like you haven't booked any appointments yet.</p>
            <p className="mt-1">Start by booking a new service!</p>
          </div>
        )}

        {!isLoading && !error && appointments && appointments.length > 0 && (
          <div className="space-y-4">
            {appointments.map((appointment) => (
              <div key={appointment.id} className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 rounded-lg border border-slate-100 bg-slate-50/50 hover:bg-slate-100 transition-colors cursor-pointer">
                <div className="flex flex-col items-center justify-center w-20 h-20 rounded-md bg-white border border-slate-200 shadow-sm flex-shrink-0">
                  <span className="text-sm font-bold text-slate-900">{format(new Date(appointment.appointmentDateTime), 'MMM dd')}</span>
                  <span className="text-xs font-medium text-slate-500">{format(new Date(appointment.appointmentDateTime), 'yyyy')}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-lg font-semibold text-slate-900 truncate">{appointment.serviceName}</p>
                  <div className="flex items-center text-sm text-slate-600 mt-1 gap-2">
                    <User className="w-4 h-4" />
                    <span>{appointment.staffName}</span>
                    <Clock className="w-4 h-4 ml-4" />
                    <span>{format(new Date(appointment.appointmentDateTime), 'hh:mm a')}</span>
                  </div>
                  <div className="flex items-center text-sm text-slate-600 mt-1 gap-2">
                    <Tag className="w-4 h-4" />
                    <span>${appointment.servicePrice} • {appointment.serviceDuration} min</span>
                  </div>
                </div>
                <div className="flex-shrink-0">
                  {getStatusBadge(appointment.status)}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
