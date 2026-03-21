import { useState } from "react";
import { DollarSign, ShoppingCart, Users, AlertTriangle } from "lucide-react";

type Stat = {
  label: string;
  value: string;
  sub: string;
  icon: typeof DollarSign;
};

type MonthlyData = {
  month: string;
  orders: number;
  revenue: number;
};
const stats: Stat[] = [
  { label: "Total Revenue", value: "Rp 675.000.000", sub: "+Rp 82.500.000 this month", icon: DollarSign },
  { label: "Total Orders", value: "540", sub: "12 pending, 8 processing", icon: ShoppingCart },
  { label: "Active Customers", value: "320", sub: "+28 registered this month", icon: Users },
  { label: "Out of Stock", value: "3 Products", sub: "Requires immediate reorder", icon: AlertTriangle },
];

const chartData: MonthlyData[] = [
  { month: "Jan", orders: 72, revenue: 90000000 },
  { month: "Feb", orders: 85, revenue: 106250000 },
  { month: "Mar", orders: 98, revenue: 122500000 },
  { month: "Apr", orders: 110, revenue: 137500000 },
  { month: "May", orders: 130, revenue: 162500000 },
  { month: "Jun", orders: 145, revenue: 181250000 },
];

const svgWidth = 700;
const svgHeight = 280;
const padding = 40;

const chartWidth = svgWidth - padding * 2;
const chartHeight = svgHeight - padding * 2;

const maxOrders = 160;
const maxRevenue = 200000000;

const getBarX = (idx: number) => padding + idx * (chartWidth / (chartData.length - 1 + 0.8));
const getBarY = (orders: number) => padding + chartHeight - (orders / maxOrders) * chartHeight;
const getLineX = (idx: number) => padding + idx * (chartWidth / (chartData.length - 1));
const getLineY = (rev: number) => padding + chartHeight - (rev / maxRevenue) * chartHeight;

const linePath = chartData
  .map((d, i) => `${i === 0 ? "M" : "L"} ${getLineX(i)} ${getLineY(d.revenue)}`)
  .join(" ");

const formatRupiah = (val: number) => {
  return `Rp ${(val / 1000000).toFixed(1)}M`;
};

const DashboardPage = () => {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  return (
    <div className="space-y-8 font-dm-sans text-soil">
      <div>
        <h2 className="font-playfair text-2xl font-bold tracking-wider">Dashboard Overview</h2>
        <p className="text-xs text-dust tracking-wide mt-1">Real-time boutique metrics and performance indicators.</p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          const isWarning = stat.label === "Out of Stock" && stat.value !== "0";

          return (
            <div
              key={stat.label}
              className="border border-sand/40 bg-cream p-6 rounded-[2px] shadow-xs flex flex-col justify-between"
            >
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-semibold tracking-wider text-dust uppercase">
                  {stat.label}
                </span>
                <Icon className={`size-4 ${isWarning ? "text-terracotta" : "text-soil/70"}`} />
              </div>
              <div className="mt-4">
                <span className="text-xl font-bold tracking-tight">{stat.value}</span>
                <p className={`text-[10px] tracking-wide mt-1 ${isWarning ? "text-terracotta font-medium" : "text-dust/80"}`}>
                  {stat.sub}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="border border-sand/40 bg-cream p-6 rounded-[2px] shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-sand/30 pb-4 mb-6">
          <div>
            <h3 className="text-sm font-bold tracking-wider uppercase">Sales & Orders analytics</h3>
            <p className="text-[10px] text-dust tracking-wide mt-0.5">Line maps revenue progress while bars detail monthly orders.</p>
          </div>
          <div className="flex items-center gap-6 text-[10px] font-semibold tracking-widest uppercase">
            <div className="flex items-center gap-2">
              <div className="h-2 w-4 bg-sand rounded-xs" />
              <span>Orders</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-0.5 w-4 bg-terracotta" />
              <span>Revenue</span>
            </div>
          </div>
        </div>

        <div className="relative overflow-x-auto">
          <div className="min-w-[650px] relative">
            <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="w-full h-auto">
              <g className="text-[10px] fill-dust/50">
                {[0, 0.25, 0.5, 0.75, 1].map((ratio) => {
                  const y = padding + ratio * chartHeight;
                  const orderVal = Math.round(maxOrders * (1 - ratio));
                  const revVal = maxRevenue * (1 - ratio);
                  
                  return (
                    <g key={ratio}>
                      <line
                        x1={padding}
                        y1={y}
                        x2={svgWidth - padding}
                        y2={y}
                        stroke="#c9b99a"
                        strokeOpacity={0.15}
                        strokeWidth={1}
                      />
                      <text x={padding - 10} y={y + 4} textAnchor="end">
                        {orderVal}
                      </text>
                      <text x={svgWidth - padding + 10} y={y + 4} textAnchor="start">
                        {formatRupiah(revVal)}
                      </text>
                    </g>
                  );
                })}
              </g>

              {chartData.map((d, i) => {
                const x = getBarX(i);
                const y = getBarY(d.orders);
                const barWidth = 24;
                const isHovered = hoveredIdx === i;

                return (
                  <rect
                    key={d.month}
                    x={x - barWidth / 2}
                    y={y}
                    width={barWidth}
                    height={padding + chartHeight - y}
                    fill={isHovered ? "#b5633a" : "#c9b99a"}
                    fillOpacity={isHovered ? 0.35 : 0.45}
                    onMouseEnter={() => setHoveredIdx(i)}
                    onMouseLeave={() => setHoveredIdx(null)}
                    className="transition-all duration-300 cursor-pointer"
                  />
                );
              })}

              <path
                d={linePath}
                fill="none"
                stroke="#b5633a"
                strokeWidth={2.5}
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {chartData.map((d, i) => {
                const x = getLineX(i);
                const y = getLineY(d.revenue);
                const isHovered = hoveredIdx === i;

                return (
                  <circle
                    key={i}
                    cx={x}
                    cy={y}
                    r={isHovered ? 5.5 : 4}
                    fill="#faf7f2"
                    stroke="#b5633a"
                    strokeWidth={2.5}
                    onMouseEnter={() => setHoveredIdx(i)}
                    onMouseLeave={() => setHoveredIdx(null)}
                    className="transition-all duration-300 cursor-pointer"
                  />
                );
              })}

              <g className="text-[10px] font-semibold tracking-wider fill-soil uppercase">
                {chartData.map((d, i) => (
                  <text
                    key={d.month}
                    x={getLineX(i)}
                    y={svgHeight - 12}
                    textAnchor="middle"
                  >
                    {d.month}
                  </text>
                ))}
              </g>
            </svg>

            {hoveredIdx !== null && (
              <div
                className="absolute z-10 border border-sand/40 bg-chalk p-3 text-[11px] font-semibold tracking-wide text-soil rounded-xs shadow-md"
                style={{
                  left: `${getLineX(hoveredIdx) + 12}px`,
                  top: `${getLineY(chartData[hoveredIdx].revenue) - 30}px`,
                }}
              >
                <div className="font-bold text-terracotta border-b border-sand/20 pb-1 mb-1">
                  {chartData[hoveredIdx].month} Report
                </div>
                <div>Revenue: <span className="font-bold text-soil">Rp {chartData[hoveredIdx].revenue.toLocaleString("id-ID")}</span></div>
                <div className="mt-0.5">Orders: <span className="font-bold text-soil">{chartData[hoveredIdx].orders} packages</span></div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
