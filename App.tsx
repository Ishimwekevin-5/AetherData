import React, { useMemo, useState } from 'react';
import {
  LayoutDashboard,
  Users,
  Truck,
  UserRound,
  Package,
  Clock3,
  CircleCheck,
  AlertTriangle,
  MapPinned,
  Phone,
  Route,
  Activity,
  TrendingUp,
} from 'lucide-react';

type PageKey = 'dashboard' | 'clients' | 'providers' | 'riders';

type DeliveryStatus = 'Delivered' | 'In Transit' | 'Pending' | 'Delayed';

interface DeliveryOrder {
  id: string;
  client: string;
  provider: string;
  rider: string;
  destination: string;
  eta: string;
  status: DeliveryStatus;
}

interface Client {
  id: string;
  name: string;
  location: string;
  totalOrders: number;
  activeOrders: number;
}

interface ServiceProvider {
  id: string;
  company: string;
  serviceType: string;
  rating: number;
  completedJobs: number;
}

interface Rider {
  id: string;
  name: string;
  zone: string;
  phone: string;
  deliveriesToday: number;
  status: 'Available' | 'On Delivery' | 'Offline';
}

const orders: DeliveryOrder[] = [
  { id: 'ORD-4021', client: 'Luna Mart', provider: 'SwiftShip Ltd', rider: 'Ibrahim Musa', destination: 'Lekki Phase 1', eta: '18 mins', status: 'In Transit' },
  { id: 'ORD-4022', client: 'Nora Pharmacy', provider: 'Prime Route', rider: 'Adaobi Eze', destination: 'Yaba', eta: 'Delivered', status: 'Delivered' },
  { id: 'ORD-4023', client: 'Green Basket', provider: 'SwiftShip Ltd', rider: 'Kola Ibrahim', destination: 'Ikeja GRA', eta: '35 mins', status: 'Pending' },
  { id: 'ORD-4024', client: 'Taste Town', provider: 'CityDrop', rider: 'Chinedu Paul', destination: 'Surulere', eta: '42 mins', status: 'Delayed' },
  { id: 'ORD-4025', client: 'Nova Boutique', provider: 'Prime Route', rider: 'Fatima Ali', destination: 'Victoria Island', eta: '26 mins', status: 'In Transit' },
];

const clients: Client[] = [
  { id: 'C-100', name: 'Luna Mart', location: 'Lekki', totalOrders: 245, activeOrders: 11 },
  { id: 'C-101', name: 'Nora Pharmacy', location: 'Yaba', totalOrders: 183, activeOrders: 5 },
  { id: 'C-102', name: 'Green Basket', location: 'Ikeja', totalOrders: 208, activeOrders: 7 },
  { id: 'C-103', name: 'Taste Town', location: 'Surulere', totalOrders: 120, activeOrders: 9 },
];

const providers: ServiceProvider[] = [
  { id: 'SP-20', company: 'SwiftShip Ltd', serviceType: 'Same-day Delivery', rating: 4.7, completedJobs: 5600 },
  { id: 'SP-21', company: 'Prime Route', serviceType: 'Express Delivery', rating: 4.5, completedJobs: 4320 },
  { id: 'SP-22', company: 'CityDrop', serviceType: 'Standard Delivery', rating: 4.2, completedJobs: 3910 },
];

const riders: Rider[] = [
  { id: 'R-01', name: 'Ibrahim Musa', zone: 'Lekki', phone: '+234-801-333-9911', deliveriesToday: 14, status: 'On Delivery' },
  { id: 'R-02', name: 'Adaobi Eze', zone: 'Yaba', phone: '+234-809-881-3344', deliveriesToday: 9, status: 'Available' },
  { id: 'R-03', name: 'Kola Ibrahim', zone: 'Ikeja', phone: '+234-817-444-2290', deliveriesToday: 7, status: 'Available' },
  { id: 'R-04', name: 'Fatima Ali', zone: 'Victoria Island', phone: '+234-806-122-8712', deliveriesToday: 11, status: 'On Delivery' },
  { id: 'R-05', name: 'Chinedu Paul', zone: 'Surulere', phone: '+234-818-320-0063', deliveriesToday: 3, status: 'Offline' },
];

const statusClasses: Record<DeliveryStatus, string> = {
  Delivered: 'bg-emerald-100 text-emerald-700',
  'In Transit': 'bg-blue-100 text-blue-700',
  Pending: 'bg-amber-100 text-amber-700',
  Delayed: 'bg-rose-100 text-rose-700',
};

const App: React.FC = () => {
  const [activePage, setActivePage] = useState<PageKey>('dashboard');

  const stats = useMemo(() => {
    const delivered = orders.filter((order) => order.status === 'Delivered').length;
    const inTransit = orders.filter((order) => order.status === 'In Transit').length;
    const delayed = orders.filter((order) => order.status === 'Delayed').length;

    return {
      totalOrders: orders.length,
      delivered,
      inTransit,
      delayed,
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 text-slate-100">
      <div className="mx-auto flex max-w-7xl gap-6 px-4 py-6 lg:px-8">
        <aside className="w-64 shrink-0 rounded-2xl border border-slate-700 bg-slate-900/80 p-4 shadow-xl">
          <div className="mb-8 flex items-center gap-3 px-2">
            <div className="rounded-xl bg-indigo-500 p-2 text-white">
              <Truck className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-white">Delivery Hub</h1>
              <p className="text-xs text-slate-400">Operations Control</p>
            </div>
          </div>

          <nav className="space-y-2">
            <SidebarButton icon={<LayoutDashboard className="h-4 w-4" />} label="Overall Dashboard" active={activePage === 'dashboard'} onClick={() => setActivePage('dashboard')} />
            <SidebarButton icon={<Users className="h-4 w-4" />} label="Clients" active={activePage === 'clients'} onClick={() => setActivePage('clients')} />
            <SidebarButton icon={<Package className="h-4 w-4" />} label="Service Providers" active={activePage === 'providers'} onClick={() => setActivePage('providers')} />
            <SidebarButton icon={<UserRound className="h-4 w-4" />} label="Riders" active={activePage === 'riders'} onClick={() => setActivePage('riders')} />
          </nav>

          <div className="mt-6 rounded-xl border border-slate-700 bg-slate-800 p-3 text-xs text-slate-300">
            <p className="font-semibold text-white">Live Network</p>
            <p className="mt-1">12 hubs online · 96% on-time</p>
          </div>
        </aside>

        <main className="min-w-0 flex-1 space-y-6">
          <section className="rounded-2xl border border-indigo-400/30 bg-gradient-to-r from-indigo-600 to-blue-600 p-6 shadow-lg">
            <h2 className="text-2xl font-bold text-white">Delivery Webapp</h2>
            <p className="mt-1 text-sm text-indigo-100">
              Real-time operations view for clients, service providers, and riders.
            </p>
          </section>

          {activePage === 'dashboard' && (
            <section className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                <StatCard icon={<Package className="h-5 w-5 text-indigo-200" />} label="Total Orders" value={stats.totalOrders} />
                <StatCard icon={<CircleCheck className="h-5 w-5 text-emerald-200" />} label="Delivered" value={stats.delivered} />
                <StatCard icon={<Clock3 className="h-5 w-5 text-blue-200" />} label="In Transit" value={stats.inTransit} />
                <StatCard icon={<AlertTriangle className="h-5 w-5 text-rose-200" />} label="Delayed" value={stats.delayed} />
              </div>

              <div className="grid gap-6 xl:grid-cols-3">
                <div className="rounded-2xl border border-slate-700 bg-slate-900/70 p-5 shadow-sm xl:col-span-2">
                  <div className="mb-4 flex items-center justify-between">
                    <h3 className="font-semibold text-white">Recent Delivery Orders</h3>
                    <span className="text-xs text-slate-400">Updated just now</span>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm text-slate-200">
                      <thead className="text-left text-xs uppercase text-slate-400">
                        <tr>
                          <th className="px-4 py-3">Order ID</th><th className="px-4 py-3">Client</th><th className="px-4 py-3">Provider</th><th className="px-4 py-3">Rider</th><th className="px-4 py-3">Destination</th><th className="px-4 py-3">ETA</th><th className="px-4 py-3">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {orders.map((order) => (
                          <tr key={order.id} className="border-t border-slate-800 text-slate-200">
                            <td className="px-4 py-3 font-medium">{order.id}</td><td className="px-4 py-3">{order.client}</td><td className="px-4 py-3">{order.provider}</td><td className="px-4 py-3">{order.rider}</td><td className="px-4 py-3">{order.destination}</td><td className="px-4 py-3">{order.eta}</td>
                            <td className="px-4 py-3"><span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${statusClasses[order.status]}`}>{order.status}</span></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="rounded-2xl border border-slate-700 bg-slate-900/70 p-5">
                    <h4 className="mb-3 font-semibold text-white">Route Health</h4>
                    <p className="flex items-center gap-2 text-slate-300"><Route className="h-4 w-4 text-blue-300" /> 18 active routes</p>
                    <p className="mt-2 flex items-center gap-2 text-slate-300"><TrendingUp className="h-4 w-4 text-emerald-300" /> +12% delivery speed</p>
                  </div>
                  <div className="rounded-2xl border border-slate-700 bg-slate-900/70 p-5">
                    <h4 className="mb-3 font-semibold text-white">Live Activity</h4>
                    <p className="flex items-center gap-2 text-slate-300"><Activity className="h-4 w-4 text-indigo-300" /> 6 riders picked new orders</p>
                    <p className="mt-2 text-xs text-slate-400">Last sync: 30 seconds ago</p>
                  </div>
                </div>
              </div>
            </section>
          )}

          {activePage === 'clients' && (
            <DataTable
              title="Clients"
              columns={['Client ID', 'Name', 'Location', 'Total Orders', 'Active Orders']}
              rows={clients.map((client) => [client.id, client.name, client.location, client.totalOrders.toString(), client.activeOrders.toString()])}
            />
          )}

          {activePage === 'providers' && (
            <DataTable
              title="Service Providers"
              columns={['Provider ID', 'Company', 'Service Type', 'Rating', 'Completed Jobs']}
              rows={providers.map((provider) => [provider.id, provider.company, provider.serviceType, provider.rating.toFixed(1), provider.completedJobs.toString()])}
            />
          )}

          {activePage === 'riders' && (
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {riders.map((rider) => (
                <article key={rider.id} className="rounded-2xl border border-slate-700 bg-slate-900/70 p-5 shadow-sm">
                  <div className="mb-4 flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-white">{rider.name}</h3>
                      <p className="text-xs text-slate-400">{rider.id}</p>
                    </div>
                    <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${rider.status === 'Available' ? 'bg-emerald-100 text-emerald-700' : rider.status === 'On Delivery' ? 'bg-blue-100 text-blue-700' : 'bg-slate-200 text-slate-700'}`}>
                      {rider.status}
                    </span>
                  </div>
                  <div className="space-y-2 text-sm text-slate-300">
                    <p className="flex items-center gap-2"><MapPinned className="h-4 w-4" /> {rider.zone}</p>
                    <p className="flex items-center gap-2"><Phone className="h-4 w-4" /> {rider.phone}</p>
                    <p className="text-xs font-semibold uppercase text-slate-500">Deliveries today: {rider.deliveriesToday}</p>
                  </div>
                </article>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

interface SidebarButtonProps {
  icon: React.ReactNode;
  label: string;
  active: boolean;
  onClick: () => void;
}

const SidebarButton: React.FC<SidebarButtonProps> = ({ icon, label, active, onClick }) => (
  <button
    onClick={onClick}
    className={`flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium transition-colors ${
      active ? 'bg-indigo-500/20 text-indigo-200' : 'text-slate-300 hover:bg-slate-800'
    }`}
  >
    {icon}
    {label}
  </button>
);

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: number;
}

const StatCard: React.FC<StatCardProps> = ({ icon, label, value }) => (
  <article className="rounded-2xl border border-slate-700 bg-slate-900/70 p-5 shadow-sm">
    <div className="mb-3 w-fit rounded-lg bg-slate-800 p-2">{icon}</div>
    <h3 className="text-sm text-slate-400">{label}</h3>
    <p className="mt-1 text-2xl font-bold text-white">{value}</p>
  </article>
);

interface DataTableProps {
  title: string;
  columns: string[];
  rows: string[][];
}

const DataTable: React.FC<DataTableProps> = ({ title, columns, rows }) => (
  <section className="rounded-2xl border border-slate-700 bg-slate-900/70 shadow-sm">
    <div className="border-b border-slate-700 p-4">
      <h3 className="font-semibold text-white">{title}</h3>
    </div>
    <div className="overflow-x-auto">
      <table className="w-full text-sm text-slate-200">
        <thead className="text-left text-xs uppercase text-slate-400">
          <tr>
            {columns.map((column) => (
              <th key={column} className="px-4 py-3">{column}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, rowIndex) => (
            <tr key={`${title}-row-${rowIndex}`} className="border-t border-slate-800">
              {row.map((value, cellIndex) => (
                <td key={`${title}-${rowIndex}-${cellIndex}`} className="px-4 py-3">{value}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </section>
);

export default App;
