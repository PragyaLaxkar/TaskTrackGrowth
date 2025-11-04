import { subDays, format } from "date-fns";
import { useQuery } from "@tanstack/react-query";
import ProgressChart from "@/components/ProgressChart";
import CalendarHeatmap from "@/components/CalendarHeatmap";
import StatCard from "@/components/StatCard";
import { ScrollArea } from "@/components/ui/scroll-area";
import { TrendingUp, Target, Award, Zap } from "lucide-react";
import type { DailyStats } from "@shared/schema";

export default function Progress() {
  const startDate = format(subDays(new Date(), 29), "yyyy-MM-dd");
  const endDate = format(new Date(), "yyyy-MM-dd");
  
  const chartStartDate = format(subDays(new Date(), 13), "yyyy-MM-dd");

  const { data: allStats = [], isLoading: isLoadingAll } = useQuery<DailyStats[]>({
    queryKey: ["/api/stats/range", startDate, endDate],
    queryFn: () => fetch(`/api/stats/range/${startDate}/${endDate}`).then(res => res.json()),
  });

  const { data: chartStats = [], isLoading: isLoadingChart } = useQuery<DailyStats[]>({
    queryKey: ["/api/stats/range", chartStartDate, endDate],
    queryFn: () => fetch(`/api/stats/range/${chartStartDate}/${endDate}`).then(res => res.json()),
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
          <div className="grid gap-6 md:grid-cols-4">
            <StatCard
              title="Total Completed"
              value={totalCompleted}
              description="Last 30 days"
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
              description="Last 30 days"
              icon={TrendingUp}
            />
            <StatCard
              title="Active Days"
              value={allStats.filter(s => s.totalTasks > 0).length}
              description="With tasks"
              icon={Target}
            />
          </div>

          <ProgressChart data={chartData} title="Last 14 Days" />

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
