import { Skeleton } from "@/components/atoms/skeleton";
import { Card, CardContent, CardHeader } from "@/components/atoms/card";

/**
 * Halaman loading otomatis untuk Dashboard Products.
 * Memberikan feedback visual instan saat data sedang diambil.
 */
export default function ProductsLoading() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Skeleton className="h-8 w-[150px]" />
        <Skeleton className="h-8 w-[100px]" />
      </div>
      <Card>
        <CardHeader>
          <Skeleton className="h-5 w-[200px]" />
          <Skeleton className="h-4 w-[300px]" />
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
