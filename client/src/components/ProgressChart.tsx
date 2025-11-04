import { Card } from "@/components/ui/card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts";
import { format, parseISO } from "date-fns";

interface ChartData {
  date: string;
  completionRate: number;
  totalTasks: number;
  completedTasks: number;
}

interface ProgressChartProps {
  data: ChartData[];
  title?: string;
}

export default function ProgressChart({ data, title = "Daily Progress" }: ProgressChartProps) {
  return (
    <Card className="p-6" data-testid="card-progress-chart">
      <h3 className="text-xl font-semibold mb-6" data-testid="text-chart-title">{title}</h3>
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={data}>
          <defs>
            <linearGradient id="colorRate" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
              <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
          <XAxis
            dataKey="date"
            stroke="hsl(var(--muted-foreground))"
            fontSize={12}
            tickFormatter={(value) => format(parseISO(value), "MMM d")}
          />
          <YAxis
            stroke="hsl(var(--muted-foreground))"
            fontSize={12}
            tickFormatter={(value) => `${value}%`}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "hsl(var(--popover))",
              border: "1px solid hsl(var(--border))",
              borderRadius: "0.375rem",
            }}
            labelFormatter={(value) => format(parseISO(value as string), "MMM d, yyyy")}
            formatter={(value: number, name: string) => {
              if (name === "completionRate") return [`${value}%`, "Completion Rate"];
              return [value, name];
            }}
          />
          <Area
            type="monotone"
            dataKey="completionRate"
            stroke="hsl(var(--primary))"
            strokeWidth={2}
            fill="url(#colorRate)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </Card>
  );
}
