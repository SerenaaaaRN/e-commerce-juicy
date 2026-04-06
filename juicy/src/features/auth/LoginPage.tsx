import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Empty, EmptyHeader, EmptyTitle, EmptyDescription, EmptyContent } from "@/components/ui/empty"

export const LoginPage = () => {
  return (
    <div className="container mx-auto flex min-h-[60vh] max-w-7xl items-center justify-center px-4 py-16">
      <Empty className="border-none max-w-lg bg-transparent">
        
        <EmptyHeader>
          <EmptyTitle className="text-3xl font-bold tracking-tight">
            Customer Login
          </EmptyTitle>
          <EmptyDescription className="text-sm text-muted-foreground mt-2">
            Access your personal Juicy account and order history.
          </EmptyDescription>
        </EmptyHeader>
        
        <EmptyContent className="mt-6">
          <Button asChild size="lg">
            <Link to="/">Return to Atelier</Link>
          </Button>
        </EmptyContent>
        
      </Empty>
    </div>
  )
}

export default LoginPage
