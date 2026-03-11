import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const COLORS = ["#4f46e5", "#10b981", "#f59e0b", "#ef4444", "#3b82f6"];

export default function FinanceCharts({ transactions }) {
  const categoryData = {};

  transactions.forEach((t) => {
    if (t.type === "expense") {
      categoryData[t.category] = (categoryData[t.category] || 0) + t.amount;
    }
  });

  const pieData = Object.keys(categoryData).map((key) => ({
    name: key,
    value: categoryData[key],
  }));

  const monthData = {};

  transactions.forEach((t) => {
    const month = new Date(t.date).toLocaleString("default", {
      month: "short",
    });

    monthData[month] = (monthData[month] || 0) + t.amount;
  });

  const barData = Object.keys(monthData).map((m) => ({
    month: m,
    amount: monthData[m],
  }));

  return (
    <div className="grid md:grid-cols-2 gap-8">
      {/* Pie Chart */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow">
        <h3 className="font-bold mb-4 dark:text-white">Spending by Category</h3>

        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie data={pieData} dataKey="value" outerRadius={90} label>
              {pieData.map((_, i) => (
                <Cell key={i} fill={COLORS[i % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Bar Chart */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow">
        <h3 className="font-bold mb-4 dark:text-white">Monthly Spending</h3>

        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={barData}>
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="amount" fill="#4f46e5" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
