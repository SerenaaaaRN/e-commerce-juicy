"use client";

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/atoms/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/atoms/chart";

export type SalesOverviewPoint = {
  name: string; // e.g. "Jan"
  total: number; // revenue
};

const chartConfig = {
  total: {
    label: "Revenue",
    color: "hsl(var(--primary))",
  },
};

interface OverviewChartProps {
  data: SalesOverviewPoint[];
}

export function OverviewChart({ data }: OverviewChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Overview</CardTitle>
      </CardHeader>
      <CardContent className="pl-2">
        <ChartContainer config={chartConfig} className="min-h-[300px] w-full">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart accessibilityLayer data={data}>
              <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis
                stroke="#888888"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `Rp${value}`}
              />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar dataKey="total" fill="var(--color-total)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
