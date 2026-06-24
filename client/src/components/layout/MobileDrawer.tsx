import { Cancel01Icon, SearchIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { AnimatePresence, motion } from "motion/react"
import { Link, useLocation } from "react-router-dom"

import { Input } from "@/components/ui/input"
import ROUTES from "@/constants/paths"
import { cn } from "@/lib/utils"
import type { Category } from "@/types"

type MobileDrawerProps = {
  isOpen: boolean
  onClose: () => void
  query: string
  onQueryChange: (val: string) => void
  categories: Category[]
  navLinks: readonly { to: string; label: string }[]
}

const ICON_STROKE = 1.5

export const MobileDrawer = ({ isOpen, onClose, query, onQueryChange, categories, navLinks }: MobileDrawerProps) => {
  const location = useLocation()

  return (
    <AnimatePresence>
      {isOpen ? (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
            onClick={onClose}
          />

          {/* Drawer Panel - Menggunakan Flex Column agar konten bisa scroll */}
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-y-0 left-0 z-50 flex w-[85%] max-w-[320px] flex-col border-r border-border bg-background shadow-xl lg:hidden"
          >
            {/* Header drawer */}
            <div className="flex h-16 shrink-0 items-center justify-between border-b border-border px-6">
              <span className="font-serif text-lg font-bold tracking-[0.2em] uppercase">Menu</span>
              <button onClick={onClose} className="-mr-2 p-2 text-muted-foreground hover:text-foreground">
                <HugeiconsIcon icon={Cancel01Icon} className="h-6 w-6" strokeWidth={ICON_STROKE} />
              </button>
            </div>

            {/* Scrollable content area */}
            <div className="flex-1 overflow-y-auto overscroll-contain pb-10">
              {/* Searchbar mobile */}
              <div className="border-b border-border bg-muted/20 p-6">
                <div className="relative w-full">
                  <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground">
                    <HugeiconsIcon icon={SearchIcon} className="size-4" />
                  </span>
                  <Input
                    type="text"
                    placeholder="Search silhouettes..."
                    value={query}
                    onChange={(e) => onQueryChange(e.target.value)}
                    className="h-10 w-full rounded-md border border-input bg-background px-9 text-sm focus:ring-1 focus:ring-primary focus:outline-none"
                  />
                </div>
              </div>

              {/* Navigation Links */}
              <nav className="flex flex-col gap-1 px-4 py-6">
                {navLinks
                  .filter((link) => link.to === ROUTES.heritage)
                  .map((link) => (
                    <Link
                      key={link.to}
                      to={link.to}
                      onClick={onClose}
                      className={cn(
                        "px-4 py-3 text-sm font-medium tracking-wide uppercase transition-all",
                        location.pathname === link.to
                          ? "bg-primary/10 text-primary"
                          : "text-foreground/70 hover:bg-muted hover:text-foreground"
                      )}
                    >
                      {link.label}
                    </Link>
                  ))}
              </nav>

              {/* Categories Section */}
              <div className="border-t border-border px-4 py-6">
                <p className="mb-4 px-4 text-xs font-semibold tracking-[0.15em] text-muted-foreground uppercase">
                  Categories
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {categories.map((cat) => (
                    <Link
                      key={cat.id}
                      to={`/category/${cat.slug}`}
                      onClick={onClose}
                      className="rounded-md border border-transparent px-4 py-2.5 text-sm text-foreground/80 transition-colors hover:border-border hover:bg-muted hover:text-foreground"
                    >
                      {cat.name}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </>
      ) : null}
    </AnimatePresence>
  )
}
