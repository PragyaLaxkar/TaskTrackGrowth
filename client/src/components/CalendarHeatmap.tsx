import { Card } from "@/components/ui/card";
import { format, subDays, startOfWeek, addDays, isSameDay, parseISO } from "date-fns";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface HeatmapData {
  date: string;
  completionRate: number;
  completedTasks: number;
  totalTasks: number;
}

interface CalendarHeatmapProps {
  data: HeatmapData[];
  title?: string;
}

export default function CalendarHeatmap({ data, title = "Last 30 Days" }: CalendarHeatmapProps) {
  const getColorIntensity = (rate: number) => {
    if (rate === 0) return "bg-muted";
    if (rate < 30) return "bg-chart-4/30";
    if (rate < 60) return "bg-chart-4/50";
    if (rate < 90) return "bg-chart-2/70";
    return "bg-chart-2";
  };

  const days = Array.from({ length: 30 }, (_, i) => {
    const date = subDays(new Date(), 29 - i);
    const dayData = data.find((d) => isSameDay(parseISO(d.date), date));
    return {
      date,
      ...dayData,
      completionRate: dayData?.completionRate ?? 0,
    };
  });

  return (
    <Card className="p-6" data-testid="card-calendar-heatmap">
      <h3 className="text-xl font-semibold mb-6" data-testid="text-heatmap-title">{title}</h3>
      <TooltipProvider>
        <div className="grid grid-cols-10 gap-2">
          {days.map((day, index) => (
            <Tooltip key={index}>
              <TooltipTrigger asChild>
                <div
                  className={`w-full aspect-square rounded-sm ${getColorIntensity(day.completionRate)} transition-all hover:ring-2 hover:ring-primary cursor-pointer`}
                  data-testid={`heatmap-day-${index}`}
                />
              </TooltipTrigger>
              <TooltipContent>
                <div className="text-xs">
                  <p className="font-medium">{format(day.date, "MMM d, yyyy")}</p>
                  <p>{day.completionRate}% complete</p>
                  {day.totalTasks !== undefined && (
                    <p>
                      {day.completedTasks}/{day.totalTasks} tasks
                    </p>
                  )}
                </div>
              </TooltipContent>
            </Tooltip>
          ))}
        </div>
      </TooltipProvider>
    </Card>
  );
}
