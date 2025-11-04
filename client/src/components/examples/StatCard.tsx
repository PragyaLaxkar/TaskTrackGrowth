import StatCard from "../StatCard";
import { CheckCircle2, Flame, TrendingUp } from "lucide-react";

export default function StatCardExample() {
  return (
    <div className="grid gap-6 md:grid-cols-3 p-6">
      <StatCard
        title="Completed Today"
        value="8/10"
        description="80% completion rate"
        icon={CheckCircle2}
      />
      <StatCard
        title="Current Streak"
        value="7 days"
        description="Keep it going!"
        icon={Flame}
      />
      <StatCard
        title="This Week"
        value="85%"
        description="Average completion"
        icon={TrendingUp}
      />
    </div>
  );
}
