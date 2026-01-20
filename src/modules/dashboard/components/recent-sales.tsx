import { Avatar, AvatarFallback, AvatarImage } from "@/components/atoms/avatar";
import { formatCurrency } from "@/lib/formatters";

export type RecentSaleItem = {
  id: string;
  createdAt: string | null;
  totalPrice: number;
  customerName: string | null;
  customerEmail: string | null;
};

interface RecentSalesProps {
  items: RecentSaleItem[];
}

export function RecentSales({ items }: RecentSalesProps) {
  if (items.length === 0) {
    return <div className="text-sm text-muted-foreground">Belum ada order.</div>;
  }

  return (
    <div className="space-y-8">
      {items.map((item) => {
        const name = item.customerName || "Customer";
        const email = item.customerEmail || item.id.slice(0, 8);
        const initials = name
          .split(" ")
          .filter(Boolean)
          .slice(0, 2)
          .map((w) => w[0]?.toUpperCase())
          .join("");

        return (
          <div key={item.id} className="flex items-center">
            <Avatar className="h-9 w-9">
              <AvatarImage src="" alt={name} />
              <AvatarFallback>{initials || "CU"}</AvatarFallback>
            </Avatar>
            <div className="ml-4 space-y-1">
              <p className="text-sm font-medium leading-none">{name}</p>
              <p className="text-sm text-muted-foreground">{email}</p>
            </div>
            <div className="ml-auto font-medium">+{formatCurrency(item.totalPrice)}</div>
          </div>
        );
      })}
    </div>
  );
}
