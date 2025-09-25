type StatCardProps = {
  title: string;
  value: string;
  note: string;
  noteColor: string;
};

function StatCard({ title, value, note, noteColor }: StatCardProps) {
  return (
    <div className="bg-white p-4 rounded shadow">
      <p className="text-sm text-gray-500">{title}</p>
      <p className="text-2xl font-bold text-gray-800">{value}</p>
      <p className={`text-xs ${noteColor}`}>{note}</p>
    </div>
  );
}

export default StatCard;
