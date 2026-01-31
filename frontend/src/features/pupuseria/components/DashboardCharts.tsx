import { useState, useEffect } from 'react';
import { BarChart, Bar, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { DollarSign, TrendingUp, TrendingDown, Calendar } from 'lucide-react';
import type { Order } from '../../../types/pupuseria';
import { format, startOfWeek, startOfMonth, endOfMonth, eachDayOfInterval, subMonths } from 'date-fns';

export function DashboardCharts() {
  const [, setOrders] = useState<Order[]>([]);
  const [salesToday, setSalesToday] = useState(0);
  const [salesThisMonth, setSalesThisMonth] = useState(0);
  const [salesLastMonth, setSalesLastMonth] = useState(0);
  const [weeklyData, setWeeklyData] = useState<any[]>([]);
  const [monthlyData, setMonthlyData] = useState<any[]>([]);

  useEffect(() => {
    const loadOrders = () => {
      const stored = localStorage.getItem('pupuseria-orders');
      if (stored) {
        const parsed = JSON.parse(stored);
        const ordersWithDates = parsed.map((o: any) => ({
          ...o,
          timestamp: new Date(o.timestamp),
        }));
        setOrders(ordersWithDates);
        calculateMetrics(ordersWithDates);
      }
    };

    loadOrders();
    const interval = setInterval(loadOrders, 5000);
    return () => clearInterval(interval);
  }, []);

  const calculateMetrics = (allOrders: Order[]) => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const thisMonthStart = startOfMonth(now);
    const thisMonthEnd = endOfMonth(now);
    const lastMonthStart = startOfMonth(subMonths(now, 1));
    const lastMonthEnd = endOfMonth(subMonths(now, 1));

    // Sales today
    const todaySales = allOrders
      .filter(o => o.timestamp >= today && o.status === 'listo')
      .reduce((sum, o) => sum + o.total, 0);
    setSalesToday(todaySales);

    // Sales this month
    const thisMonthSales = allOrders
      .filter(o => o.timestamp >= thisMonthStart && o.timestamp <= thisMonthEnd && o.status === 'listo')
      .reduce((sum, o) => sum + o.total, 0);
    setSalesThisMonth(thisMonthSales);

    // Sales last month
    const lastMonthSales = allOrders
      .filter(o => o.timestamp >= lastMonthStart && o.timestamp <= lastMonthEnd && o.status === 'listo')
      .reduce((sum, o) => sum + o.total, 0);
    setSalesLastMonth(lastMonthSales);

    // Weekly data (last 7 days)
    const weekStart = startOfWeek(now, { weekStartsOn: 1 });
    const weekDays = eachDayOfInterval({ start: weekStart, end: now });
    const weekly = weekDays.map(day => {
      const dayStart = new Date(day.getFullYear(), day.getMonth(), day.getDate());
      const dayEnd = new Date(day.getFullYear(), day.getMonth(), day.getDate(), 23, 59, 59);
      const daySales = allOrders
        .filter(o => o.timestamp >= dayStart && o.timestamp <= dayEnd && o.status === 'listo')
        .reduce((sum, o) => sum + o.total, 0);
      return {
        day: format(day, 'EEE', { weekStartsOn: 1 }),
        ventas: daySales,
      };
    });
    setWeeklyData(weekly);

    // Monthly data (last 30 days)
    const monthDays = eachDayOfInterval({ start: subMonths(now, 1), end: now });
    const daily = monthDays.reduce((acc, day) => {
      const dayKey = format(day, 'MMM dd');
      const dayStart = new Date(day.getFullYear(), day.getMonth(), day.getDate());
      const dayEnd = new Date(day.getFullYear(), day.getMonth(), day.getDate(), 23, 59, 59);
      const daySales = allOrders
        .filter(o => o.timestamp >= dayStart && o.timestamp <= dayEnd && o.status === 'listo')
        .reduce((sum, o) => sum + o.total, 0);
      
      const existing = acc.find((a: any) => a.fecha === dayKey);
      if (existing) {
        existing.ventas += daySales;
      } else {
        acc.push({ fecha: dayKey, ventas: daySales });
      }
      return acc;
    }, [] as any[]);
    setMonthlyData(daily);
  };

  const percentChange = salesLastMonth > 0
    ? ((salesThisMonth - salesLastMonth) / salesLastMonth) * 100
    : 0;

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card-elevated">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-pupuseria-chicharron">
              Ventas Hoy
            </h3>
            <DollarSign className="w-6 h-6 text-pupuseria-maiz" />
          </div>
          <p className="text-3xl font-extrabold text-pupuseria-maiz">
            ${salesToday.toFixed(2)}
          </p>
        </div>

        <div className="card-elevated">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-pupuseria-chicharron">
              Ventas Este Mes
            </h3>
            <Calendar className="w-6 h-6 text-pupuseria-curtido" />
          </div>
          <p className="text-3xl font-extrabold text-pupuseria-curtido">
            ${salesThisMonth.toFixed(2)}
          </p>
        </div>

        <div className="card-elevated">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-pupuseria-chicharron">
              vs Mes Anterior
            </h3>
            {percentChange >= 0 ? (
              <TrendingUp className="w-6 h-6 text-pupuseria-curtido" />
            ) : (
              <TrendingDown className="w-6 h-6 text-pupuseria-salsa" />
            )}
          </div>
          <p className={`text-3xl font-extrabold ${percentChange >= 0 ? 'text-pupuseria-curtido' : 'text-pupuseria-salsa'}`}>
            {percentChange >= 0 ? '+' : ''}{percentChange.toFixed(1)}%
          </p>
        </div>
      </div>

      {/* Weekly Bar Chart */}
      <div className="card-elevated">
        <h2 className="text-2xl font-bold text-pupuseria-chicharron mb-6">
          Ventas Semanales
        </h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={weeklyData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E6DED6" />
            <XAxis dataKey="day" stroke="#7A4A2E" />
            <YAxis stroke="#7A4A2E" />
            <Tooltip
              contentStyle={{
                backgroundColor: '#FFF8EE',
                border: '1px solid #E6DED6',
                borderRadius: '8px',
              }}
            />
            <Bar dataKey="ventas" fill="#F4C430" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Monthly Area Chart */}
      <div className="card-elevated">
        <h2 className="text-2xl font-bold text-pupuseria-chicharron mb-6">
          Ventas Mensuales
        </h2>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={monthlyData}>
            <defs>
              <linearGradient id="colorVentas" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#F4C430" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#F4C430" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#E6DED6" />
            <XAxis dataKey="fecha" stroke="#7A4A2E" />
            <YAxis stroke="#7A4A2E" />
            <Tooltip
              contentStyle={{
                backgroundColor: '#FFF8EE',
                border: '1px solid #E6DED6',
                borderRadius: '8px',
              }}
            />
            <Area
              type="monotone"
              dataKey="ventas"
              stroke="#F4C430"
              fillOpacity={1}
              fill="url(#colorVentas)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
