import { Navigate } from "react-router-dom"
import { ROUTES } from "@/constants/routes"
import { useCustomerAuthStore } from "@/stores/customerAuthStore"
import { EditProfileForm } from "./components/EditProfileForm"
import { ChangePasswordForm } from "./components/ChangePasswordForm"
import { AddressList } from "./components/AddressList"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { Card, CardContent } from "@/components/ui/card"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

export const ProfilePage = () => {
  const isAuthenticated = useCustomerAuthStore((s) => s.isAuthenticated)
  const customer = useCustomerAuthStore((s) => s.customer)

  if (!isAuthenticated) return <Navigate to={ROUTES.login} replace />

  return (
    <div className="bg-background">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 my-32 md:my-42">
        <Breadcrumb className="mb-4 text-[10px] tracking-wider uppercase sm:text-xs">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href={ROUTES.home}>Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator>/</BreadcrumbSeparator>
            <BreadcrumbPage className="text-primary">Profile Account</BreadcrumbPage>
          </BreadcrumbList>
        </Breadcrumb>

        <header className="mb-8 flex flex-col gap-2 text-left sm:mb-10">
          <span className="text-[10px] tracking-widest text-primary uppercase">Atelier Customer Center</span>
          <h1 className="font-heading text-2xl tracking-tight text-foreground sm:text-4xl">My Account</h1>
          <p className="max-w-md font-sans text-sm leading-relaxed text-muted-foreground">
            Manage your personal contact card, secure account credentials, and shipping addresses.
          </p>
        </header>

        <Separator className="mb-8" />

        {/* Grid Responsif: Sidebar pindah ke bawah di mobile */}
        <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-12">
          <div className="w-full lg:col-span-8">
            <Tabs defaultValue="info" className="w-full">
              {/* Tambahkan overflow-x-auto agar tab tidak turun baris di HP */}
              <TabsList className="mb-6 w-full justify-start overflow-x-auto sm:mb-8 [&::-webkit-scrollbar]:hidden">
                <TabsTrigger value="info" className="cursor-pointer px-4 whitespace-nowrap">
                  Personal Details
                </TabsTrigger>
                <TabsTrigger value="security" className="cursor-pointer px-4 whitespace-nowrap">
                  Security Settings
                </TabsTrigger>
                <TabsTrigger value="addresses" className="cursor-pointer px-4 whitespace-nowrap">
                  Saved Destinations
                </TabsTrigger>
              </TabsList>

              {/* Padding card disesuaikan: p-4 di mobile, p-6 di desktop */}
              <TabsContent value="info" className="mt-0">
                <Card className="border-border/80 shadow-sm">
                  <CardContent className="p-4 sm:p-6">
                    <EditProfileForm />
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="security" className="mt-0">
                <Card className="border-border/80 shadow-sm">
                  <CardContent className="p-4 sm:p-6">
                    <ChangePasswordForm />
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="addresses" className="mt-0">
                <Card className="border-border/80 shadow-sm">
                  <CardContent className="p-4 sm:p-6">
                    <AddressList />
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar: Lebar penuh di mobile, 4 kolom di desktop */}
          <div className="w-full lg:col-span-4">
            <Card className="border-border/80 bg-muted/10 shadow-sm">
              <CardContent className="flex flex-col gap-4 p-4 sm:p-6">
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                    Welcome back
                  </span>
                  <h3 className="truncate text-lg font-bold text-foreground">{customer?.full_name}</h3>
                  <span className="truncate font-mono text-xs text-muted-foreground">{customer?.email}</span>
                </div>
                <Separator />
                <div className="flex flex-col gap-2 text-xs">
                  <div className="flex justify-between font-sans">
                    <span className="font-medium text-muted-foreground">Joined Juicy:</span>
                    <span className="font-semibold text-foreground">
                      {customer?.created_at
                        ? new Date(customer.created_at).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })
                        : "Recently"}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProfilePage
