import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Empty, EmptyHeader, EmptyTitle, EmptyDescription, EmptyContent } from "@/components/ui/empty"

export const LoginPage = () => {
  return (
    <div className="container mx-auto flex min-h-[60vh] max-w-7xl items-center justify-center px-4 py-16">
      <Empty className="border-none max-w-lg bg-transparent">
        
        <EmptyHeader>
          <EmptyTitle className="font-['Space_Grotesk'] text-3xl font-semibold tracking-wider text-foreground uppercase">
            Customer Login
          </EmptyTitle>
          <EmptyDescription className="text-sm text-muted-foreground uppercase tracking-widest max-w-md mt-4 leading-relaxed">
            Access your personal Juicy account and order history.
          </EmptyDescription>
        </EmptyHeader>
        
        <EmptyContent className="mt-6">
          <Button asChild className="font-medium uppercase tracking-widest text-xs px-6 py-5 h-auto transition-transform hover:scale-[1.02]">
            <Link to="/">Return to Atelier</Link>
          </Button>
        </EmptyContent>
        
      </Empty>
    </div>
  )
}

export default LoginPage
