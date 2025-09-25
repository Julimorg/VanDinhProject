import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';

const data = [
  { name: '08 AM', tickets: 50 },
  { name: '10 AM', tickets: 80 },
  { name: '12 PM', tickets: 100 },
  { name: '14 PM', tickets: 70 },
  { name: '16 PM', tickets: 120 },
  { name: '18 PM', tickets: 150 },
  { name: '20 PM', tickets: 200 },
  { name: '22 PM', tickets: 180 },
];

function Chart() {
  return (
    <div className="col-span-2 bg-white p-4 rounded shadow">
      <h2 className="text-lg font-semibold mb-2">Bán vé hàng giờ</h2>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="tickets" fill="#3b82f6" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default Chart;
