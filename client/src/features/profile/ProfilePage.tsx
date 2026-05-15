import { Navigate } from "react-router-dom"
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
  const { isAuthenticated, customer } = useCustomerAuthStore()

  // Guest route guard
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return (
    <div className="bg-background py-12">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Breadcrumb className="mb-8 text-left text-xs font-bold uppercase">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator>/</BreadcrumbSeparator>
            <BreadcrumbPage className="font-bold text-primary">Profile Account</BreadcrumbPage>
          </BreadcrumbList>
        </Breadcrumb>

        {/* Page Title Header */}
        <header className="flex flex-col gap-2 text-left">
          <span className="text-xs font-semibold tracking-wider text-primary uppercase">Atelier Customer Center</span>
          <h1 className="font-heading text-4xl font-bold tracking-tight text-foreground">My Account</h1>
          <p className="max-w-md font-sans text-sm leading-relaxed text-muted-foreground">
            Manage your personal contact card, secure account credentials, and shipping addresses.
          </p>
        </header>

        <Separator className="my-8" />

        {/* Tabbed Layout split grid */}
        <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-12">
          {/* Main account tabs */}
          <div className="w-full lg:col-span-8">
            <Tabs defaultValue="info" className="w-full">
              <TabsList className="mb-8 grid w-full grid-cols-3">
                <TabsTrigger value="info" className="cursor-pointer">
                  Personal Details
                </TabsTrigger>
                <TabsTrigger value="security" className="cursor-pointer">
                  Security Settings
                </TabsTrigger>
                <TabsTrigger value="addresses" className="cursor-pointer">
                  Saved Destinations
                </TabsTrigger>
              </TabsList>

              {/* Edit info tab content */}
              <TabsContent value="info">
                <Card className="border border-border/80 shadow-md">
                  <CardContent className="p-6">
                    <EditProfileForm />
                  </CardContent>
                </Card>
              </TabsContent>

              {/* password security tab content */}
              <TabsContent value="security">
                <Card className="border border-border/80 shadow-md">
                  <CardContent className="p-6">
                    <ChangePasswordForm />
                  </CardContent>
                </Card>
              </TabsContent>

              {/* address list tab content */}
              <TabsContent value="addresses">
                <Card className="border border-border/80 shadow-md">
                  <CardContent className="p-6">
                    <AddressList />
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Quick welcome stats card sidebar */}
          <div className="w-full text-left lg:col-span-4">
            <Card className="border border-border/80 bg-muted/10 shadow-md">
              <CardContent className="flex flex-col gap-4 p-6">
                <div className="flex flex-col gap-0.5">
                  <span className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                    Welcome back
                  </span>
                  <h3 className="max-w-50 truncate text-lg font-bold text-foreground">{customer?.full_name}</h3>
                  <span className="truncate font-mono text-xs text-muted-foreground">{customer?.email}</span>
                </div>

                <Separator />

                <div className="flex flex-col gap-2 text-xs">
                  <div className="flex justify-between font-sans">
                    <span className="font-medium text-muted-foreground">Joined Juicy:</span>
                    <span className="font-semibold text-foreground">
                      {customer?.created_at ? new Date(customer.created_at).toLocaleDateString() : "Recently"}
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
