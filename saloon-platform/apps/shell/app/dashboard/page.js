export default function DashboardOverview() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Dashboard</h1>
          <p className="text-sm text-slate-500 mt-1">Here is what's happening at your salon today.</p>
        </div>
        <div className="flex gap-2">
          {/* Quick Actions */}
          <button className="h-10 px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-md text-sm font-medium hover:bg-slate-50 transition-colors shadow-sm">
            Export Report
          </button>
          <button className="h-10 px-4 py-2 bg-slate-900 text-white rounded-md text-sm font-medium hover:bg-slate-800 transition-colors shadow-sm">
            + New Booking
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KPICard title="Total Revenue" value="$4,250.00" trend="+12.5%" isPositive={true} />
        <KPICard title="Appointments" value="42" trend="+4.2%" isPositive={true} />
        <KPICard title="New Customers" value="12" trend="-2.1%" isPositive={false} />
        <KPICard title="Utilization Rate" value="84%" trend="+1.2%" isPositive={true} />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Activity Feed / Upcoming */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm p-6">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Upcoming Appointments</h2>
          
          <div className="space-y-4">
            <AppointmentCard time="10:00 AM" customer="Sarah Jenkins" service="Balayage & Cut" staff="Emily R." />
            <AppointmentCard time="11:30 AM" customer="Michael Chen" service="Men's Haircut" staff="David T." />
            <AppointmentCard time="01:00 PM" customer="Jessica Alba" service="Full Highlights" staff="Emily R." />
          </div>
        </div>

        {/* Side Widget */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Staff Status</h2>
          <div className="space-y-4">
            <StaffStatus name="Emily R." status="Busy" />
            <StaffStatus name="David T." status="Available" />
            <StaffStatus name="Sarah L." status="Off Today" />
          </div>
        </div>
      </div>
    </div>
  );
}

function KPICard({ title, value, trend, isPositive }) {
  return (
    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col">
      <span className="text-sm font-medium text-slate-500 mb-2">{title}</span>
      <div className="flex items-baseline gap-2">
        <span className="text-3xl font-bold tracking-tight text-slate-900">{value}</span>
        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${isPositive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
          {trend}
        </span>
      </div>
    </div>
  );
}

function AppointmentCard({ time, customer, service, staff }) {
  return (
    <div className="flex items-center gap-4 p-4 rounded-lg border border-slate-100 bg-slate-50/50 hover:bg-slate-50 transition-colors cursor-pointer">
      <div className="flex flex-col items-center justify-center w-16 h-16 rounded-md bg-white border border-slate-200 shadow-sm flex-shrink-0">
        <span className="text-sm font-bold text-slate-900">{time.split(' ')[0]}</span>
        <span className="text-xs font-medium text-slate-500">{time.split(' ')[1]}</span>
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-slate-900 truncate">{customer}</p>
        <p className="text-sm text-slate-500 truncate">{service} • with {staff}</p>
      </div>
      <div>
         <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">Confirmed</span>
      </div>
    </div>
  );
}

function StaffStatus({ name, status }) {
  const statusColors = {
    'Busy': 'bg-amber-100 text-amber-700 ring-amber-600/20',
    'Available': 'bg-green-100 text-green-700 ring-green-600/20',
    'Off Today': 'bg-slate-100 text-slate-700 ring-slate-600/20'
  };

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="h-8 w-8 rounded-full bg-slate-200 flex items-center justify-center text-xs font-bold text-slate-600">
          {name.split(' ').map(n => n[0]).join('')}
        </div>
        <span className="text-sm font-medium text-slate-900">{name}</span>
      </div>
      <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${statusColors[status]}`}>
        {status}
      </span>
    </div>
  );
}
