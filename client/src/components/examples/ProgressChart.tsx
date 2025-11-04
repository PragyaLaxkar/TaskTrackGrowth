import ProgressChart from "../ProgressChart";
import { subDays, format } from "date-fns";

export default function ProgressChartExample() {
  const mockData = Array.from({ length: 14 }, (_, i) => {
    const date = subDays(new Date(), 13 - i);
    const completedTasks = Math.floor(Math.random() * 8) + 2;
    const totalTasks = 10;
    return {
      date: format(date, "yyyy-MM-dd"),
      completionRate: Math.round((completedTasks / totalTasks) * 100),
      totalTasks,
      completedTasks,
    };
  });

  return (
    <div className="p-6">
      <ProgressChart data={mockData} />
    </div>
  );
}
