import { Button } from "@/components/atoms/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/atoms/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/atoms/tabs";
import { Activity, CreditCard, DollarSign, Download, Users } from "lucide-react";
import { formatCurrency } from "@/lib/formatters";
import { OverviewChart } from "@/modules/dashboard/components/overview-chart";
import { RecentSales } from "@/modules/dashboard/components/recent-sales";
import { dashboardService } from "@/modules/dashboard/services/dashboard-service";

export default async function DashboardPage() {
  const [{ productCount, activeProductCount }, overviewData, recentSales] = await Promise.all([
    dashboardService.getProductCounts(),
    dashboardService.getSalesOverview(),
    dashboardService.getRecentSales(),
  ]);

  return (
    // container utama dengan padding
    <div className="flex-1 space-y-4 p-4 pt-6">
      {/* HEADER + ACTIONS */}
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <div className="flex items-center space-x-2">
          {/* Simulasi Date Picker */}
          <Button variant="outline" className="hidden md:flex">
            Aug 20, 2025 - Sep 20, 2025
          </Button>
          <Button>
            <Download className="mr-2 h-4 w-4" />
            Download
          </Button>
        </div>
      </div>

      {/* TABS NAVIGATION */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="analytics" disabled>
            Analytics
          </TabsTrigger>
          <TabsTrigger value="reports" disabled>
            Reports
          </TabsTrigger>
          <TabsTrigger value="notifications" disabled>
            Notifications
          </TabsTrigger>
        </TabsList>

        {/* KONTEN TAB "OVERVIEW" */}
        <TabsContent value="overview" className="space-y-4">
          {/* BARIS 1: KPI CARDS (4 Kolom) */}
          <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
            {/* Card 1: Total Revenue (Dummy Data untuk contoh tampilan) */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatCurrency(45231000)}</div>
                <p className="text-xs text-muted-foreground">+20.1% from last month</p>
              </CardContent>
            </Card>

            {/* Card 2: Sales/Orders (Dummy) */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Sales</CardTitle>
                <CreditCard className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">+1,200</div>
                <p className="text-xs text-muted-foreground">+19% from last month</p>
              </CardContent>
            </Card>

            {/* Card 3: Total Products (Data Real dari Supabase) */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Products</CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{productCount || 0}</div>
                <p className="text-xs text-muted-foreground">{activeProductCount} Active Now</p>
              </CardContent>
            </Card>

            {/* Card 4: Active Users (Dummy) */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Now</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">+573</div>
                <p className="text-xs text-muted-foreground">+201 since last hour</p>
              </CardContent>
            </Card>
          </div>

          {/* BARIS 2: CHART & RECENT SALES (Grid 7 Kolom: 4 untuk Chart, 3 untuk Sales) */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            {/* Kolom Kiri: Chart */}
            <div className="col-span-4">
              {/* Kita pakai komponen chart yang sudah kita buat sebelumnya */}
              <OverviewChart data={overviewData} />
            </div>

            {/* Kolom Kanan: Recent Sales */}
            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>Recent Sales</CardTitle>
                <CardDescription>You made 265 sales this month.</CardDescription>
              </CardHeader>
              <CardContent>
                {/* Komponen Recent Sales yang baru dibuat */}
                <RecentSales items={recentSales} />
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
