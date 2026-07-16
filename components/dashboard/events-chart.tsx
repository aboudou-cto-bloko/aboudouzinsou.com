"use client";

import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

const chartConfig = {
  count: {
    label: "Événements",
    color: "var(--color-primary)",
  },
} satisfies ChartConfig;

export function EventsChart({ data }: { data: { day: string; count: number }[] }) {
  return (
    <ChartContainer config={chartConfig} className="aspect-auto h-[240px] w-full">
      <AreaChart data={data} margin={{ left: 0, right: 12, top: 12 }}>
        <defs>
          <linearGradient id="fillCount" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="var(--color-primary)" stopOpacity={0.35} />
            <stop offset="95%" stopColor="var(--color-primary)" stopOpacity={0.02} />
          </linearGradient>
        </defs>
        <CartesianGrid vertical={false} stroke="var(--border)" />
        <XAxis
          dataKey="day"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          minTickGap={24}
          tickFormatter={(value: string) =>
            new Date(value).toLocaleDateString("fr-FR", { day: "2-digit", month: "short" })
          }
        />
        <ChartTooltip
          content={
            <ChartTooltipContent
              labelFormatter={(value) =>
                new Date(value).toLocaleDateString("fr-FR", {
                  day: "2-digit",
                  month: "long",
                })
              }
            />
          }
        />
        <Area
          dataKey="count"
          type="monotone"
          fill="url(#fillCount)"
          stroke="var(--color-primary)"
          strokeWidth={2}
        />
      </AreaChart>
    </ChartContainer>
  );
}
