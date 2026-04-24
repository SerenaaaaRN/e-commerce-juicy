import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Spinner } from "@/components/ui/spinner"
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "@/components/ui/dialog"
import { formatPrice, formatDate } from "@/lib/utils/format"
import { HugeiconsIcon } from "@hugeicons/react"
import { CheckmarkCircle01Icon, Cancel01Icon } from "@hugeicons/core-free-icons"
import { cn } from "@/lib/utils"
import { useConfirm } from "@/hooks/useConfirm"
import { useCustomers } from "@/features/admin/hooks/useCustomers"
import { useDataTableFilter } from "@/features/admin/hooks/useDataTableFilter"
import { PageHeader } from "@/features/admin/components/PageHeader"
import { EmptyState } from "@/features/admin/components/DataEmpty"
import { DefferedContainer } from "@/features/admin/components/DefferedContainer"
import { FullPageSpinner } from "@/features/admin/components/FullPageSpinner"
import { SearchInput } from "@/features/admin/components/SearchInput"

export const CustomersPage = () => {
  const {
    clients, loading, isPending,
    detailsOpen, setDetailsOpen, activeClient, clientHistory,
    handleViewClientDetails, handleToggleClientStatus,
  } = useCustomers()

  const { confirm: confirmAction, dialog: confirmDialog } = useConfirm()

  const { search, setSearch, filteredData: filtered, isStale } =
    useDataTableFilter(clients, (c, s) =>
      c.full_name.toLowerCase().includes(s) || c.email.toLowerCase().includes(s) || !!c.phone?.includes(s)
    )

  if (loading) return <FullPageSpinner label="Loading Customer Directory..." />

  return (
    <div className="flex flex-col gap-8 text-left">
      <PageHeader title="Customers CRM" description="Browse customer profile details, toggle checkout access credentials, and monitor lifecycle sales averages." />

      <div className="flex flex-col items-center gap-4 rounded-lg border border-border/60 bg-card p-4 shadow-sm sm:flex-row">
        <SearchInput containerClassName="w-full sm:max-w-md" placeholder="Search full name, email address, phone..." value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>

      <DefferedContainer isStale={isStale} className="rounded-lg border border-border/60 bg-card shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="px-6 py-4">Client</TableHead>
              <TableHead className="px-6 py-4">Phone Number</TableHead>
              <TableHead className="px-6 py-4">Registration</TableHead>
              <TableHead className="px-6 py-4">Lifecycle Orders</TableHead>
              <TableHead className="px-6 py-4">Lifecycle Spent</TableHead>
              <TableHead className="px-6 py-4">Account Health</TableHead>
              <TableHead className="px-6 py-4 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 ? (
              <EmptyState message="No customers found matching your search term." />
            ) : filtered.map((client) => (
              <TableRow key={client.id}>
                <TableCell className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="flex size-9 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary uppercase">{client.full_name.substring(0, 2)}</div>
                    <div>
                      <div className="font-semibold text-foreground">{client.full_name}</div>
                      <div className="text-[11px] text-muted-foreground">{client.email}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="px-6 py-4 font-mono text-xs text-foreground">{client.phone || "-"}</TableCell>
                <TableCell className="px-6 py-4 text-xs text-muted-foreground">{formatDate(client.created_at)}</TableCell>
                <TableCell className="px-6 py-4 font-semibold text-foreground">{client.order_count} unit(s)</TableCell>
                <TableCell className="px-6 py-4 font-bold text-foreground">{formatPrice(client.total_spent)}</TableCell>
                <TableCell className="px-6 py-4">
                  <Badge variant={(client.is_active ?? true) ? "default" : "destructive"}>{(client.is_active ?? true) ? "Active Health" : "Suspended"}</Badge>
                </TableCell>
                <TableCell className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Button variant="outline" size="sm" onClick={() => handleViewClientDetails(client)}>CRM Log</Button>
                    <Button variant="ghost" size="icon" disabled={isPending} onClick={() => handleToggleClientStatus(client, confirmAction)} className={cn("size-8 rounded-full border hover:bg-muted", (client.is_active ?? true) ? "text-destructive hover:bg-destructive/10" : "text-primary hover:bg-primary/10")}>
                      {(client.is_active ?? true) ? <HugeiconsIcon icon={Cancel01Icon} className="size-4" /> : <HugeiconsIcon icon={CheckmarkCircle01Icon} className="size-4" />}
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </DefferedContainer>

      <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
        <DialogContent className="max-h-[90vh] max-w-3xl sm:max-w-3xl overflow-y-auto border bg-card">
          <DialogHeader>
            <DialogTitle className="font-heading text-lg font-bold">Client CRM File: {activeClient?.full_name}</DialogTitle>
            <DialogDescription className="text-xs">Check historically placed orders, lifecycle totals spent, and account status modifications.</DialogDescription>
          </DialogHeader>

          {isPending ? (
            <div className="flex h-64 w-full items-center justify-center"><Spinner className="size-8 text-primary" /></div>
          ) : !activeClient ? (
            <div className="rounded-lg border border-dashed bg-muted/20 py-12 text-center text-xs text-muted-foreground">Failed to load detailed client credentials files.</div>
          ) : (
            <div className="flex flex-col gap-6 py-4 text-left">
              <div className="grid gap-4 rounded-lg border bg-muted/15 p-4 text-xs sm:grid-cols-3">
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] font-bold tracking-wider text-muted-foreground uppercase">Email Address</span>
                  <span className="font-semibold text-foreground">{activeClient.email}</span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] font-bold tracking-wider text-muted-foreground uppercase">Mobile Contact</span>
                  <span className="font-semibold text-foreground">{activeClient.phone || "Unassigned"}</span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] font-bold tracking-wider text-muted-foreground uppercase">Account Health</span>
                  <div><Badge variant={(activeClient.is_active ?? true) ? "default" : "destructive"}>{(activeClient.is_active ?? true) ? "Active Access" : "Suspended"}</Badge></div>
                </div>
              </div>

              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold tracking-wider text-muted-foreground uppercase">Placed Order History</h3>
                  <div className="text-xs font-bold text-foreground">Total Spent: <span className="text-primary">{formatPrice(activeClient.total_spent)}</span></div>
                </div>
                <div className="flex flex-col gap-3">
                  {clientHistory.length === 0 ? (
                    <div className="rounded-lg border border-dashed bg-muted/20 py-12 text-center text-xs text-muted-foreground">No order lifecycle invoices captured under this account.</div>
                  ) : clientHistory.map((ord) => (
                    <div key={ord.id} className="flex items-center justify-between rounded-lg border bg-card p-3 text-xs transition-colors hover:border-primary">
                      <div className="flex flex-col items-start gap-1">
                        <span className="font-mono font-bold text-foreground">{ord.order_number}</span>
                        <span className="mt-0.5 text-[10px] text-muted-foreground">{formatDate(ord.created_at)}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="text-right font-bold text-foreground">{formatPrice(ord.total)}</div>
                        <Badge variant={ord.status === "delivered" ? "default" : "secondary"}>{ord.status}</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          <DialogFooter className="border-t border-border pt-4">
            <DialogClose asChild><Button type="button">Close CRM Log</Button></DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {confirmDialog}
    </div>
  )
}

export default CustomersPage
