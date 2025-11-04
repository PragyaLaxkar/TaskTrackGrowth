import CalendarHeatmap from "../CalendarHeatmap";
import { subDays, format } from "date-fns";

export default function CalendarHeatmapExample() {
  const mockData = Array.from({ length: 30 }, (_, i) => {
    const date = subDays(new Date(), 29 - i);
    const completedTasks = Math.floor(Math.random() * 10);
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
      <CalendarHeatmap data={mockData} />
    </div>
  );
}
