import { useEffect, useState } from "react";
import { Search, Eye, X, CreditCard, Box, Truck, CheckCircle } from "lucide-react";
import { toast } from "sonner";
import { adminApi, withFallback } from "@/lib/api";
import type { AdminOrderSummary, OrderDetail as ApiOrderDetail } from "@/lib/api/types";

type OrderItem = {
  product_name: string;
  variant_size: string;
  variant_color: string;
  image_url: string;
  quantity: number;
  unit_price: number;
};

type Order = {
  id: string;
  order_number: string;
  customer_name: string;
  customer_email: string;
  phone: string;
  status: "pending" | "confirmed" | "processing" | "shipped" | "delivered";
  payment_status: "paid" | "unpaid";
  subtotal: number;
  shipping_fee: number;
  total: number;
  shipped_at: string | null;
  delivered_at: string | null;
  address: {
    recipient_name: string;
    phone: string;
    address_line: string;
    city: string;
    province: string;
    postal_code: string;
  };
  items: OrderItem[];
  notes?: string;
  payment_method: string;
  created_at: string;
};

const MOCK_ORDERS: Order[] = [
  {
    id: "ord-1",
    order_number: "JUICY-20260520-X8F2B9",
    customer_name: "Jane Doe",
    customer_email: "jane@example.com",
    phone: "+62812345678",
    status: "shipped",
    payment_status: "paid",
    subtotal: 2500000,
    shipping_fee: 25000,
    total: 2525000,
    shipped_at: "2026-05-22T09:15:00Z",
    delivered_at: null,
    address: {
      recipient_name: "Jane Doe",
      phone: "+62812345678",
      address_line: "Jl. Sudirman No. 24, Apartment 8A",
      city: "Jakarta Selatan",
      province: "DKI Jakarta",
      postal_code: "12190",
    },
    items: [
      {
        product_name: "La Robe Bahia",
        variant_size: "S",
        variant_color: "Ivory",
        image_url: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=300&q=80",
        quantity: 2,
        unit_price: 1250000,
      },
    ],
    notes: "Leave with receptionist",
    payment_method: "Credit Card",
    created_at: "2026-05-20T08:15:22Z",
  },
  {
    id: "ord-2",
    order_number: "JUICY-20260524-K2J9W1",
    customer_name: "Camille R.",
    customer_email: "camille@example.com",
    phone: "+62877665544",
    status: "pending",
    payment_status: "unpaid",
    subtotal: 1100000,
    shipping_fee: 25000,
    total: 1125000,
    shipped_at: null,
    delivered_at: null,
    address: {
      recipient_name: "Camille R.",
      phone: "+62877665544",
      address_line: "Jl. Sunset Road No. 88",
      city: "Kuta",
      province: "Bali",
      postal_code: "80361",
    },
    items: [
      {
        product_name: "Le Pantalon Sauge",
        variant_size: "M",
        variant_color: "Sand",
        image_url: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?auto=format&fit=crop&w=300&q=80",
        quantity: 1,
        unit_price: 1100000,
      },
    ],
    payment_method: "Bank Transfer",
    created_at: "2026-05-24T14:30:10Z",
  },
  {
    id: "ord-3",
    order_number: "JUICY-20260525-M3L7V2",
    customer_name: "Isabella G.",
    customer_email: "isabella@example.com",
    phone: "+62899887766",
    status: "delivered",
    payment_status: "paid",
    subtotal: 2100000,
    shipping_fee: 0,
    total: 2100000,
    shipped_at: "2026-05-25T10:00:00Z",
    delivered_at: "2026-05-25T11:45:00Z",
    address: {
      recipient_name: "Isabella G.",
      phone: "+62899887766",
      address_line: "Jl. Menteng Raya No. 4A",
      city: "Jakarta Pusat",
      province: "DKI Jakarta",
      postal_code: "10310",
    },
    items: [
      {
        product_name: "Le Chiquito Bag",
        variant_size: "S",
        variant_color: "Terracotta",
        image_url: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=300&q=80",
        quantity: 1,
        unit_price: 2100000,
      },
    ],
    payment_method: "COD",
    created_at: "2026-05-25T08:00:00Z",
  },
];

const mapApiDetailToOrder = (d: ApiOrderDetail): Order => ({
  id: d.id,
  order_number: d.order_number,
  customer_name: "",
  customer_email: "",
  phone: d.address?.phone || "",
  status: d.status as Order["status"],
  payment_status: d.payment_status as Order["payment_status"],
  subtotal: d.subtotal,
  shipping_fee: d.shipping_fee,
  total: d.total,
  shipped_at: d.shipped_at,
  delivered_at: d.delivered_at,
  address: d.address || { recipient_name: "", phone: "", address_line: "", city: "", province: "", postal_code: "" },
  items: (d.items || []).map((i) => ({
    product_name: i.product_name,
    variant_size: i.variant_size,
    variant_color: i.variant_color,
    image_url: i.image_url || "",
    quantity: i.quantity,
    unit_price: i.unit_price,
  })),
  payment_method: "",
  created_at: d.created_at,
});

const mapApiSummaryToOrder = (s: AdminOrderSummary): Order => ({
  id: s.id,
  order_number: s.order_number,
  customer_name: s.customer_name,
  customer_email: s.customer_email,
  phone: "",
  status: s.status as Order["status"],
  payment_status: s.payment_status as Order["payment_status"],
  subtotal: 0,
  shipping_fee: 0,
  total: s.total,
  shipped_at: null,
  delivered_at: null,
  address: { recipient_name: "", phone: "", address_line: "", city: "", province: "", postal_code: "" },
  items: [],
  payment_method: "",
  created_at: s.created_at,
});

const OrdersPage = () => {
  const [orders, setOrders] = useState<Order[]>(MOCK_ORDERS);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [detailOrder, setDetailOrder] = useState<Order | null>(null);

  useEffect(() => {
    const fetch = async () => {
      try {
        const result = await withFallback(
          () => adminApi.listAdminOrders(),
          () => ({ orders: [], meta: { total: 0, page: 1, per_page: 10 } }),
        );
        if (result.orders.length > 0) {
          setOrders(result.orders.map(mapApiSummaryToOrder));
        }
      } catch {}
    };
    fetch();
  }, []);

  const handleUpdateStatus = async (orderId: string, nextStatus: Order["status"]) => {
    await withFallback(
      () => adminApi.updateOrderStatus(orderId, nextStatus),
      () => {},
    );
    const updated = orders.map((ord) => {
      if (ord.id === orderId) {
        return {
          ...ord,
          status: nextStatus,
          shipped_at: nextStatus === "shipped" || nextStatus === "delivered" ? new Date().toISOString() : ord.shipped_at,
          delivered_at: nextStatus === "delivered" ? new Date().toISOString() : ord.delivered_at,
          payment_status: nextStatus === "delivered" ? ("paid" as const) : ord.payment_status,
        };
      }
      return ord;
    });
    setOrders(updated);
    if (detailOrder && detailOrder.id === orderId) {
      const match = updated.find((o) => o.id === orderId);
      if (match) setDetailOrder(match);
    }
    toast.success(`Order status updated to ${nextStatus.toUpperCase()}.`);
  };

  const handleUpdatePayment = async (orderId: string, nextPayment: Order["payment_status"]) => {
    await withFallback(
      () => adminApi.updateOrderPayment(orderId, nextPayment),
      () => {},
    );
    const updated = orders.map((ord) => {
      if (ord.id === orderId) {
        return { ...ord, payment_status: nextPayment };
      }
      return ord;
    });
    setOrders(updated);
    if (detailOrder && detailOrder.id === orderId) {
      const match = updated.find((o) => o.id === orderId);
      if (match) setDetailOrder(match);
    }
    toast.success(`Payment status marked as ${nextPayment.toUpperCase()}.`);
  };

  const handleViewDetail = async (orderId: string) => {
    const local = orders.find((o) => o.id === orderId);
    if (!local) return;

    try {
      const detail = await withFallback(
        () => adminApi.getAdminOrder(orderId),
        () => local as any,
      );
      setDetailOrder(mapApiDetailToOrder(detail));
    } catch {
      setDetailOrder(local);
    }
  };

  const filteredOrders = orders.filter((ord) => {
    const matchesSearch =
      ord.order_number.toLowerCase().includes(search.toLowerCase()) ||
      ord.customer_email.toLowerCase().includes(search.toLowerCase()) ||
      ord.customer_name.toLowerCase().includes(search.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || ord.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStepStatus = (current: Order["status"], step: Order["status"]) => {
    const sequence: Order["status"][] = ["pending", "confirmed", "processing", "shipped", "delivered"];
    const currentIdx = sequence.indexOf(current);
    const stepIdx = sequence.indexOf(step);

    if (currentIdx >= stepIdx) return "completed";
    if (currentIdx + 1 === stepIdx) return "current";
    return "upcoming";
  };

  return (
    <div className="space-y-6 font-dm-sans text-soil select-none">
      <div>
        <h2 className="font-playfair text-2xl font-bold tracking-wider">Orders Management</h2>
        <p className="text-xs text-dust tracking-wide mt-1">Review checkout files, log payment transitions, and process logistics.</p>
      </div>

      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between border border-sand/40 bg-cream p-4 rounded-xs">
        <div className="relative flex-1 max-w-md">
          <input
            type="text"
            placeholder="Search order number or client email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-chalk border border-sand/50 rounded-xs py-2 pl-9 pr-3 text-xs tracking-wide placeholder:text-dust/50 focus:outline-none focus:border-terracotta transition-all"
          />
          <Search className="absolute left-3 top-2.5 size-4 text-dust/60" />
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          {["all", "pending", "confirmed", "processing", "shipped", "delivered"].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`rounded-xs px-3 py-1.5 text-[10px] font-bold tracking-widest uppercase transition-colors cursor-pointer border ${
                statusFilter === status
                  ? "bg-soil text-chalk border-soil"
                  : "bg-chalk text-soil border-sand/50 hover:bg-cream"
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      <div className="border border-sand/40 rounded-xs bg-cream overflow-x-auto shadow-xs">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-sand/30 bg-sand/10 text-[10px] font-bold tracking-wider uppercase text-dust">
              <th className="p-4">Order File</th>
              <th className="p-4">Customer</th>
              <th className="p-4">Amount</th>
              <th className="p-4">Logistics</th>
              <th className="p-4">Payment</th>
              <th className="p-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-sand/20">
            {filteredOrders.map((ord) => (
              <tr key={ord.id} className="hover:bg-sand/5 transition-colors">
                <td className="p-4 font-bold text-soil">{ord.order_number}</td>
                <td className="p-4">
                  <div className="font-semibold">{ord.customer_name}</div>
                  <div className="text-[10px] text-dust/80 font-medium tracking-wide mt-0.5">{ord.customer_email}</div>
                </td>
                <td className="p-4 font-bold">
                  Rp {ord.total.toLocaleString("id-ID")}
                  <span className="block text-[9px] text-dust/70 font-medium tracking-wider mt-0.5">
                    {ord.items.reduce((sum, item) => sum + item.quantity, 0)} packages
                  </span>
                </td>
                <td className="p-4">
                  <span className={`inline-flex rounded-xs px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider ${
                    ord.status === "delivered"
                      ? "bg-[#e2f0d9] text-[#385723]"
                      : ord.status === "shipped"
                      ? "bg-[#ddebf7] text-[#1f4e79]"
                      : "bg-[#fff2cc] text-[#7f6000]"
                  }`}>
                    {ord.status}
                  </span>
                </td>
                <td className="p-4">
                  <span className={`inline-flex rounded-xs px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider ${
                    ord.payment_status === "paid"
                      ? "bg-[#e2f0d9] text-[#385723]"
                      : "bg-sand/35 text-dust"
                  }`}>
                    {ord.payment_status}
                  </span>
                </td>
                <td className="p-4 text-right">
                  <button
                    onClick={() => handleViewDetail(ord.id)}
                    className="flex items-center gap-1.5 ml-auto border border-sand bg-chalk px-3 py-1.5 text-[10px] font-bold tracking-widest text-soil uppercase hover:bg-cream rounded-xs cursor-pointer transition-colors"
                  >
                    <Eye className="size-3.5" />
                    <span>View File</span>
                  </button>
                </td>
              </tr>
            ))}
            {filteredOrders.length === 0 && (
              <tr>
                <td colSpan={6} className="p-8 text-center text-xs text-dust tracking-wider font-medium">
                  No orders registered under these parameters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {detailOrder && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div
            className="fixed inset-0 bg-soil/45 backdrop-blur-xs transition-opacity duration-300"
            onClick={() => setDetailOrder(null)}
          />
          <div className="relative w-full max-w-2xl bg-chalk p-6 shadow-xl border-l border-sand/40 overflow-y-auto h-screen flex flex-col justify-between transition-transform duration-300">
            <div>
              <div className="flex items-center justify-between border-b border-sand/30 pb-4 mb-6">
                <div>
                  <h3 className="font-playfair text-xl font-bold tracking-wider">
                    {detailOrder.order_number}
                  </h3>
                  <span className="text-[10px] text-dust tracking-wide font-medium mt-0.5">
                    Purchased on: {new Date(detailOrder.created_at).toLocaleString("id-ID")}
                  </span>
                </div>
                <button
                  onClick={() => setDetailOrder(null)}
                  className="p-1 hover:text-terracotta transition-colors border-0 bg-transparent cursor-pointer"
                >
                  <X className="size-5" />
                </button>
              </div>

              <div className="flex items-center justify-between border border-sand/40 p-4 bg-cream rounded-xs mb-6">
                <div className="space-y-1.5">
                  <span className="block text-[9px] font-bold tracking-widest uppercase text-dust">Update Logistics Status</span>
                  <div className="flex gap-2">
                    {["pending", "confirmed", "processing", "shipped", "delivered"].map((st) => (
                      <button
                        key={st}
                        onClick={() => handleUpdateStatus(detailOrder.id, st as Order["status"])}
                        className={`px-2.5 py-1 text-[9px] font-bold tracking-widest uppercase border rounded-[1px] cursor-pointer transition-colors ${
                          detailOrder.status === st
                            ? "bg-soil text-chalk border-soil"
                            : "bg-chalk text-soil border-sand/55 hover:bg-cream"
                        }`}
                      >
                        {st}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <span className="block text-[9px] font-bold tracking-widest uppercase text-dust">Update Payment</span>
                  <div className="flex gap-1.5">
                    {["unpaid", "paid"].map((pay) => (
                      <button
                        key={pay}
                        onClick={() => handleUpdatePayment(detailOrder.id, pay as Order["payment_status"])}
                        className={`px-2.5 py-1 text-[9px] font-bold tracking-widest uppercase border rounded-[1px] cursor-pointer transition-colors ${
                          detailOrder.payment_status === pay
                            ? "bg-soil text-chalk border-soil"
                            : "bg-chalk text-soil border-sand/55 hover:bg-cream"
                        }`}
                      >
                        {pay}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mb-6 space-y-3">
                <span className="block text-[10px] font-bold tracking-widest uppercase text-dust">Logistics Timeline</span>
                <div className="relative flex justify-between items-center px-4">
                  <div className="absolute top-1/2 left-4 right-4 h-0.5 bg-sand/30 -translate-y-1/2 z-0" />
                  {[
                    { key: "pending", label: "Ordered", icon: CreditCard },
                    { key: "confirmed", label: "Confirmed", icon: Box },
                    { key: "shipped", label: "Shipped", icon: Truck },
                    { key: "delivered", label: "Delivered", icon: CheckCircle },
                  ].map((step) => {
                    const stepStatus = getStepStatus(detailOrder.status, step.key as Order["status"]);
                    const StepIcon = step.icon;

                    return (
                      <div key={step.key} className="relative z-10 flex flex-col items-center">
                        <div className={`size-8 rounded-full border flex items-center justify-center transition-colors duration-300 ${
                          stepStatus === "completed"
                            ? "bg-soil border-soil text-chalk"
                            : stepStatus === "current"
                            ? "bg-terracotta border-terracotta text-chalk"
                            : "bg-chalk border-sand/50 text-dust"
                        }`}>
                          <StepIcon className="size-4" />
                        </div>
                        <span className="text-[9px] font-bold tracking-wide uppercase mt-1.5">{step.label}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="border border-sand/35 rounded-xs bg-chalk divide-y divide-sand/20 mb-6">
                <div className="p-4">
                  <span className="block text-[10px] font-bold tracking-widest uppercase text-dust mb-3">Customer Profile</span>
                  <div className="grid gap-4 sm:grid-cols-2 text-xs font-semibold">
                    <div>
                      <span className="block text-[9px] font-bold text-dust uppercase">Full Name</span>
                      <span className="text-soil">{detailOrder.customer_name}</span>
                    </div>
                    <div>
                      <span className="block text-[9px] font-bold text-dust uppercase">Email Address</span>
                      <span className="text-soil">{detailOrder.customer_email}</span>
                    </div>
                  </div>
                </div>

                <div className="p-4">
                  <span className="block text-[10px] font-bold tracking-widest uppercase text-dust mb-3">Shipping Address</span>
                  <div className="text-xs font-semibold space-y-1">
                    <div className="font-bold text-soil">{detailOrder.address.recipient_name} ({detailOrder.address.phone})</div>
                    <div className="text-dust">{detailOrder.address.address_line}</div>
                    <div className="text-dust">
                      {detailOrder.address.city}, {detailOrder.address.province} {detailOrder.address.postal_code}
                    </div>
                  </div>
                </div>

                {detailOrder.notes && (
                  <div className="p-4">
                    <span className="block text-[10px] font-bold tracking-widest uppercase text-dust mb-1">Notes / Instructions</span>
                    <p className="text-xs font-medium text-soil italic">"{detailOrder.notes}"</p>
                  </div>
                )}
              </div>

              <div className="border border-sand/35 rounded-xs bg-chalk overflow-hidden">
                <div className="bg-sand/15 px-4 py-2 border-b border-sand/30">
                  <span className="text-[10px] font-bold tracking-wider text-dust uppercase">Ordered Items Breakdown</span>
                </div>
                <div className="divide-y divide-sand/20">
                  {detailOrder.items.map((item, idx) => (
                    <div key={idx} className="p-4 flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={item.image_url}
                          alt={item.product_name}
                          className="size-12 object-cover rounded-xs border border-sand/40"
                        />
                        <div>
                          <div className="font-bold text-xs text-soil">{item.product_name}</div>
                          <div className="flex gap-2 text-[9px] font-bold text-dust uppercase tracking-wider mt-0.5">
                            <span>Size: {item.variant_size}</span>
                            <span>Color: {item.variant_color}</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-xs">
                          Rp {item.unit_price.toLocaleString("id-ID")}
                        </div>
                        <div className="text-[10px] text-dust font-medium mt-0.5">
                          Quantity: {item.quantity}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="bg-cream/45 p-4 border-t border-sand/30 flex flex-col items-end space-y-1.5 text-xs">
                  <div className="flex justify-between w-48 text-[11px] font-medium text-dust">
                    <span>Subtotal:</span>
                    <span>Rp {detailOrder.subtotal.toLocaleString("id-ID")}</span>
                  </div>
                  <div className="flex justify-between w-48 text-[11px] font-medium text-dust">
                    <span>Delivery Fee:</span>
                    <span>Rp {detailOrder.shipping_fee.toLocaleString("id-ID")}</span>
                  </div>
                  <div className="flex justify-between w-48 text-xs font-bold text-soil border-t border-sand/35 pt-1.5">
                    <span>Total Amount:</span>
                    <span>Rp {detailOrder.total.toLocaleString("id-ID")}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end border-t border-sand/30 pt-6 mt-6">
              <button
                type="button"
                onClick={() => setDetailOrder(null)}
                className="border border-sand bg-transparent px-6 py-2.5 text-xs font-semibold tracking-wider text-soil uppercase hover:bg-cream rounded-xs cursor-pointer transition-colors"
              >
                Close File
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrdersPage;
