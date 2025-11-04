import { subDays, format } from "date-fns";
import ProgressChart from "@/components/ProgressChart";
import CalendarHeatmap from "@/components/CalendarHeatmap";
import StatCard from "@/components/StatCard";
import { ScrollArea } from "@/components/ui/scroll-area";
import { TrendingUp, Target, Award, Zap } from "lucide-react";

export default function Progress() {
  //todo: remove mock functionality
  const mockChartData = Array.from({ length: 14 }, (_, i) => {
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

  //todo: remove mock functionality
  const mockHeatmapData = Array.from({ length: 30 }, (_, i) => {
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
              value="156"
              description="All time"
              icon={Award}
            />
            <StatCard
              title="Longest Streak"
              value="14 days"
              description="Your best"
              icon={Zap}
            />
            <StatCard
              title="Average Rate"
              value="82%"
              description="Last 30 days"
              icon={TrendingUp}
            />
            <StatCard
              title="Perfect Days"
              value="12"
              description="This month"
              icon={Target}
            />
          </div>

          <ProgressChart data={mockChartData} title="Last 14 Days" />

          <CalendarHeatmap data={mockHeatmapData} />

          <div className="grid gap-6 md:grid-cols-2">
            <div className="p-6 border rounded-lg bg-card" data-testid="card-insights">
              <h3 className="text-lg font-semibold mb-4">Insights</h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-chart-2 mt-1.5" />
                  <p className="text-muted-foreground">
                    You're most consistent on <span className="text-foreground font-medium">Mondays</span>
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-chart-1 mt-1.5" />
                  <p className="text-muted-foreground">
                    Your completion rate improved by{" "}
                    <span className="text-foreground font-medium">15%</span> this week
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-chart-4 mt-1.5" />
                  <p className="text-muted-foreground">
                    Keep going! You're <span className="text-foreground font-medium">2 days</span> away from
                    your longest streak
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6 border rounded-lg bg-card" data-testid="card-milestones">
              <h3 className="text-lg font-semibold mb-4">Milestones</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-full bg-chart-2/20 flex items-center justify-center">
                    <Award className="h-6 w-6 text-chart-2" />
                  </div>
                  <div>
                    <p className="font-medium">7-Day Streak</p>
                    <p className="text-sm text-muted-foreground">Achieved 3 times</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-full bg-chart-1/20 flex items-center justify-center">
                    <Target className="h-6 w-6 text-chart-1" />
                  </div>
                  <div>
                    <p className="font-medium">100% Week</p>
                    <p className="text-sm text-muted-foreground">Achieved 2 times</p>
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
