import { Navigate, Link } from "react-router-dom"
import { useCustomerAuthStore } from "@/stores/customerAuthStore"
import { EditProfileForm } from "./components/EditProfileForm"
import { ChangePasswordForm } from "./components/ChangePasswordForm"
import { AddressList } from "./components/AddressList"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { Card, CardContent } from "@/components/ui/card"

export const ProfilePage = () => {
  const { isAuthenticated, customer } = useCustomerAuthStore()

  // Guest route guard
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return (
    <div className="bg-background py-12">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumbs */}
        <div className="flex items-center gap-2 text-xs text-muted-foreground mb-8 text-left uppercase tracking-widest font-semibold">
          <Link to="/" className="hover:text-foreground">Home</Link>
          <span>/</span>
          <span className="text-foreground">Profile Account</span>
        </div>

        {/* Page Title Header */}
        <div className="text-left flex flex-col gap-2">
          <span className="text-xs font-semibold tracking-wider text-primary uppercase">
            Atelier Customer Center
          </span>
          <h1 className="text-4xl font-bold tracking-tight text-foreground font-heading">
            My Account
          </h1>
          <p className="text-sm text-muted-foreground max-w-md leading-relaxed font-sans">
            Manage your personal contact card, secure account credentials, and shipping addresses.
          </p>
        </div>

        <Separator className="my-8" />

        {/* Tabbed Layout split grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Main account tabs */}
          <div className="lg:col-span-8 w-full">
            <Tabs defaultValue="info" className="w-full">
              
              <TabsList className="grid w-full grid-cols-3 mb-8">
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
          <div className="lg:col-span-4 w-full text-left">
            <Card className="border border-border/80 shadow-md bg-muted/10">
              <CardContent className="p-6 flex flex-col gap-4">
                
                <div className="flex flex-col gap-0.5">
                  <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">
                    Welcome back
                  </span>
                  <h3 className="text-lg font-bold text-foreground truncate max-w-[200px]">
                    {customer?.full_name}
                  </h3>
                  <span className="text-xs text-muted-foreground font-mono truncate">
                    {customer?.email}
                  </span>
                </div>

                <Separator />

                <div className="flex flex-col gap-2 text-xs">
                  <div className="flex justify-between font-sans">
                    <span className="text-muted-foreground font-medium">Joined Juicy:</span>
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
