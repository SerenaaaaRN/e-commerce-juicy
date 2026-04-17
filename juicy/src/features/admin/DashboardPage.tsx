import { useEffect, useState } from "react"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  adminApi,
  type AnalyticsOverview,
  type AnalyticsChartItem,
} from "@/lib/api/admin"
import { formatPrice } from "@/lib/utils/format"
import { Spinner } from "@/components/ui/spinner"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  ShoppingBag01Icon,
  UserIcon,
  DeliveryTruck02Icon,
  Dollar01Icon,
} from "@hugeicons/core-free-icons"
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  AreaChart,
  Area,
} from "recharts"

const fallbackOverview: AnalyticsOverview = {
  orders: { total: 184, pending: 8, processing: 14, this_month: 42 },
  revenue: { total: 245900000, this_month: 56200000 },
  customers: { total: 89, new_this_month: 12 },
  products: { total: 14, out_of_stock: 2 },
}

const fallbackChart: AnalyticsChartItem[] = [
  { month: "Jan", order_count: 24, revenue: 32000000 },
  { month: "Feb", order_count: 28, revenue: 38000000 },
  { month: "Mar", order_count: 35, revenue: 47000000 },
  { month: "Apr", order_count: 42, revenue: 56000000 },
  { month: "May", order_count: 55, revenue: 72000000 },
  { month: "Jun", order_count: 42, revenue: 56200000 },
]

export const DashboardPage = () => {
  const [overview, setOverview] = useState<AnalyticsOverview | null>(null)
  const [chartData, setChartData] = useState<AnalyticsChartItem[]>([])
  const [loading, setLoading] = useState(true)
  const [usingFallback, setUsingFallback] = useState(false)

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true)
        const [overviewRes, chartRes] = await Promise.all([
          adminApi.getAnalyticsOverview(),
          adminApi.getAnalyticsOrdersChart(),
        ])

        if (overviewRes.success && overviewRes.data) {
          setOverview(overviewRes.data)
        } else {
          setOverview(fallbackOverview)
          setUsingFallback(true)
        }

        if (chartRes.success && chartRes.data) {
          setChartData(chartRes.data)
        } else {
          setChartData(fallbackChart)
          setUsingFallback(true)
        }
      } catch {
        setOverview(fallbackOverview)
        setChartData(fallbackChart)
        setUsingFallback(true)
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  if (loading) {
    return (
      <div className="flex h-[70vh] w-full items-center justify-center">
        <div className="flex flex-col items-center gap-4 text-center">
          <Spinner className="size-8 text-primary" />
          <p className="text-xs font-medium tracking-wider text-muted-foreground uppercase">
            Fetching Analytics & Charts...
          </p>
        </div>
      </div>
    )
  }

  const currentOverview = overview || fallbackOverview
  const currentChart = chartData.length > 0 ? chartData : fallbackChart

  return (
    <div className="flex flex-col gap-8 text-left">
      {/* Header section */}
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="font-heading text-3xl font-extrabold tracking-tight text-foreground">
            Overview
          </h1>
          <p className="text-xs text-muted-foreground">
            Realtime shop metrics, monthly revenue trends, and operations health
            tracker.
          </p>
        </div>
        {usingFallback && (
          <Badge
            variant="outline"
            className="self-start text-xs font-semibold tracking-wider uppercase"
          >
            Offline Demo Mode - Showing Editorial Mock Data
          </Badge>
        )}
      </div>

      {/* Grid of stats cards */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {/* Total Revenue */}
        <Card className="border border-border/60 shadow-sm transition-shadow hover:shadow-md">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-bold tracking-wider text-muted-foreground uppercase">
              Total Revenue
            </CardTitle>
            <div className="rounded bg-primary/10 p-2 text-primary">
              <HugeiconsIcon icon={Dollar01Icon} className="size-4" />
            </div>
          </CardHeader>
          <CardContent className="pt-2">
            <div className="text-2xl font-extrabold tracking-tight text-foreground">
              {formatPrice(currentOverview.revenue.total)}
            </div>
            <p className="mt-1 text-[10px] text-muted-foreground">
              <span className="font-bold text-primary">
                {formatPrice(currentOverview.revenue.this_month)}
              </span>{" "}
              this month
            </p>
          </CardContent>
        </Card>

        {/* Total Orders */}
        <Card className="border border-border/60 shadow-sm transition-shadow hover:shadow-md">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-bold tracking-wider text-muted-foreground uppercase">
              Fulfillment Orders
            </CardTitle>
            <div className="rounded bg-primary/10 p-2 text-primary">
              <HugeiconsIcon icon={DeliveryTruck02Icon} className="size-4" />
            </div>
          </CardHeader>
          <CardContent className="pt-2">
            <div className="text-2xl font-extrabold tracking-tight text-foreground">
              {currentOverview.orders.total}
            </div>
            <p className="mt-1 text-[10px] text-muted-foreground">
              <span className="font-semibold text-foreground">
                {currentOverview.orders.pending} pending
              </span>{" "}
              • {currentOverview.orders.processing} processing
            </p>
          </CardContent>
        </Card>

        {/* Active Customers */}
        <Card className="border border-border/60 shadow-sm transition-shadow hover:shadow-md">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-bold tracking-wider text-muted-foreground uppercase">
              Total Customers
            </CardTitle>
            <div className="rounded bg-primary/10 p-2 text-primary">
              <HugeiconsIcon icon={UserIcon} className="size-4" />
            </div>
          </CardHeader>
          <CardContent className="pt-2">
            <div className="text-2xl font-extrabold tracking-tight text-foreground">
              {currentOverview.customers.total}
            </div>
            <p className="mt-1 text-[10px] text-muted-foreground">
              <span className="font-bold text-primary">
                +{currentOverview.customers.new_this_month}
              </span>{" "}
              brand new signups
            </p>
          </CardContent>
        </Card>

        {/* Out of Stock Products */}
        <Card className="border border-border/60 shadow-sm transition-shadow hover:shadow-md">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-bold tracking-wider text-muted-foreground uppercase">
              Product Stocks
            </CardTitle>
            <div className="rounded bg-primary/10 p-2 text-primary">
              <HugeiconsIcon icon={ShoppingBag01Icon} className="size-4" />
            </div>
          </CardHeader>
          <CardContent className="pt-2">
            <div className="text-2xl font-extrabold tracking-tight text-foreground">
              {currentOverview.products.total}
            </div>
            <p className="mt-1 text-[10px] text-muted-foreground">
              {currentOverview.products.out_of_stock > 0 ? (
                <span className="font-bold text-destructive">
                  {currentOverview.products.out_of_stock} variant(s)
                  out-of-stock
                </span>
              ) : (
                <Badge variant="default">All products in-stock</Badge>
              )}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Grid of chart graphs */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Revenue chart */}
        <Card className="border border-border/60 shadow-sm">
          <CardHeader className="pb-4">
            <CardTitle className="text-sm font-bold tracking-wider text-foreground uppercase">
              Monthly Revenue Performance
            </CardTitle>
            <CardDescription className="text-xs">
              Revenue figures in IDR grouped per calendar month.
            </CardDescription>
          </CardHeader>
          <CardContent className="h-80 min-h-80 pl-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={currentChart}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="hsl(var(--border))"
                />
                <XAxis
                  dataKey="month"
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={10}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(v) => `${(v / 1000000).toFixed(0)}M`}
                />
                <Tooltip
                  formatter={(value: unknown) => [
                    formatPrice(Number(value)),
                    "Revenue",
                  ]}
                  contentStyle={{
                    backgroundColor: "hsl(var(--background))",
                    borderColor: "hsl(var(--border))",
                    borderRadius: "0.25rem",
                  }}
                  labelStyle={{ fontSize: "11px", fontWeight: "bold" }}
                />
                <Bar
                  dataKey="revenue"
                  fill="hsl(var(--primary))"
                  radius={[4, 4, 0, 0]}
                  maxBarSize={45}
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Orders timeline chart */}
        <Card className="border border-border/60 shadow-sm">
          <CardHeader className="pb-4">
            <CardTitle className="text-sm font-bold tracking-wider text-foreground uppercase">
              Fulfillment Orders Volume
            </CardTitle>
            <CardDescription className="text-xs">
              Timeline displaying count of orders placed per month.
            </CardDescription>
          </CardHeader>
          <CardContent className="h-80 min-h-80 pl-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={currentChart}>
                <defs>
                  <linearGradient id="orderGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset="5%"
                      stopColor="hsl(var(--primary))"
                      stopOpacity={0.2}
                    />
                    <stop
                      offset="95%"
                      stopColor="hsl(var(--primary))"
                      stopOpacity={0.0}
                    />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="hsl(var(--border))"
                />
                <XAxis
                  dataKey="month"
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={10}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip
                  formatter={(value) => [
                    value,
                    "Orders Count",
                  ]}
                  contentStyle={{
                    backgroundColor: "hsl(var(--background))",
                    borderColor: "hsl(var(--border))",
                    borderRadius: "0.25rem",
                  }}
                  labelStyle={{ fontSize: "11px", fontWeight: "bold" }}
                />
                <Area
                  type="monotone"
                  dataKey="order_count"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#orderGrad)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default DashboardPage
