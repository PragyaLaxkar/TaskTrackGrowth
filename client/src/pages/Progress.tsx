import { subDays, subMonths, format } from "date-fns";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import ProgressChart from "@/components/ProgressChart";
import CalendarHeatmap from "@/components/CalendarHeatmap";
import StatCard from "@/components/StatCard";
import { ScrollArea } from "@/components/ui/scroll-area";
import { TrendingUp, Target, Award, Zap, Calendar as CalendarIcon } from "lucide-react";
import type { DailyStats } from "@shared/schema";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import type { DateRange } from "react-day-picker";

export default function Progress() {
  const [preset, setPreset] = useState<string>("30d");
  const [range, setRange] = useState<DateRange | undefined>({
    from: subDays(new Date(), 29),
    to: new Date(),
  });

  const computed = useMemo(() => {
    const to = range?.to ?? range?.from ?? new Date();
    if (preset === "custom") {
      const from = range?.from ?? to;
      return { from, to };
    }
    if (preset === "15d") return { from: subDays(to, 14), to };
    if (preset === "30d") return { from: subDays(to, 29), to };
    if (preset === "2mo") return { from: subMonths(to, 2), to };
    if (preset === "1yr") return { from: subMonths(to, 12), to };
    return { from: subDays(to, 29), to };
  }, [preset, range]);

  const startDate = format(computed.from, "yyyy-MM-dd");
  const endDate = format(computed.to, "yyyy-MM-dd");

  const { data: allStats = [], isLoading: isLoadingAll } = useQuery<DailyStats[]>({
    queryKey: ["/api/stats/range", startDate, endDate],
    queryFn: () => fetch(`/api/stats/range/${startDate}/${endDate}`).then(res => res.json()),
  });

  const { data: chartStats = [], isLoading: isLoadingChart } = useQuery<DailyStats[]>({
    queryKey: ["/api/stats/range", startDate, endDate, "chart"],
    queryFn: () => fetch(`/api/stats/range/${startDate}/${endDate}`).then(res => res.json()),
  });

  const chartData = chartStats.map(stat => ({
    date: stat.date,
    completionRate: stat.completionRate,
    totalTasks: stat.totalTasks,
    completedTasks: stat.completedTasks,
  }));

  const heatmapData = allStats.map(stat => ({
    date: stat.date,
    completionRate: stat.completionRate,
    totalTasks: stat.totalTasks,
    completedTasks: stat.completedTasks,
  }));

  const totalCompleted = allStats.reduce((sum, stat) => sum + stat.completedTasks, 0);
  const avgCompletionRate = allStats.length > 0
    ? Math.round(allStats.reduce((sum, stat) => sum + stat.completionRate, 0) / allStats.length)
    : 0;
  const perfectDays = allStats.filter(stat => stat.completionRate === 100).length;

  if (isLoadingAll || isLoadingChart) {
    return (
      <div className="h-full flex items-center justify-center">
        <p className="text-muted-foreground">Loading progress data...</p>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <div className="border-b bg-background p-6">
        <h1 className="text-3xl font-bold" data-testid="text-page-title">
          Progress & Stats
        </h1>
        <p className="text-muted-foreground mt-1" data-testid="text-page-subtitle">
          Track your growth and stay motivated
        </p>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-6 space-y-8">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-3">
              <Select value={preset} onValueChange={setPreset}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="15d">Last 15 days</SelectItem>
                  <SelectItem value="30d">Last 30 days</SelectItem>
                  <SelectItem value="2mo">Last 2 months</SelectItem>
                  <SelectItem value="1yr">Last 1 year</SelectItem>
                  <SelectItem value="custom">Custom…</SelectItem>
                </SelectContent>
              </Select>

              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="justify-start w-[260px]">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {computed.from && computed.to
                      ? `${format(computed.from, "LLL d, yyyy")} - ${format(computed.to, "LLL d, yyyy")}`
                      : "Pick a date range"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="p-0" align="start">
                  <Calendar
                    mode="range"
                    numberOfMonths={2}
                    selected={range}
                    onSelect={setRange}
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
          <div className="grid gap-6 md:grid-cols-4">
            <StatCard
              title="Total Completed"
              value={totalCompleted}
              description="Selected range"
              icon={Award}
            />
            <StatCard
              title="Perfect Days"
              value={perfectDays}
              description="100% completion"
              icon={Zap}
            />
            <StatCard
              title="Average Rate"
              value={`${avgCompletionRate}%`}
              description="Selected range"
              icon={TrendingUp}
            />
            <StatCard
              title="Active Days"
              value={allStats.filter(s => s.totalTasks > 0).length}
              description="With tasks"
              icon={Target}
            />
          </div>

          <ProgressChart data={chartData} title="Completion over time" />

          <CalendarHeatmap data={heatmapData} />

          <div className="grid gap-6 md:grid-cols-2">
            <div className="p-6 border rounded-lg bg-card" data-testid="card-insights">
              <h3 className="text-lg font-semibold mb-4">Insights</h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-chart-2 mt-1.5" />
                  <p className="text-muted-foreground">
                    You've completed{" "}
                    <span className="text-foreground font-medium">{totalCompleted} tasks</span> in
                    the last 30 days
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-chart-1 mt-1.5" />
                  <p className="text-muted-foreground">
                    Average completion rate of{" "}
                    <span className="text-foreground font-medium">{avgCompletionRate}%</span>
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-chart-4 mt-1.5" />
                  <p className="text-muted-foreground">
                    You've had{" "}
                    <span className="text-foreground font-medium">{perfectDays} perfect days</span> this
                    month
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6 border rounded-lg bg-card" data-testid="card-milestones">
              <h3 className="text-lg font-semibold mb-4">Keep Going!</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-full bg-chart-2/20 flex items-center justify-center">
                    <Award className="h-6 w-6 text-chart-2" />
                  </div>
                  <div>
                    <p className="font-medium">Stay Consistent</p>
                    <p className="text-sm text-muted-foreground">
                      Build daily habits that last
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-full bg-chart-1/20 flex items-center justify-center">
                    <Target className="h-6 w-6 text-chart-1" />
                  </div>
                  <div>
                    <p className="font-medium">Track Progress</p>
                    <p className="text-sm text-muted-foreground">
                      Every completed task counts
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}
