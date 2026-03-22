import { useEffect, useState } from "react";
import { Search, ToggleLeft, ToggleRight, X, UserCheck } from "lucide-react";
import { toast } from "sonner";
import { adminApi } from "@/lib/api";

type Customer = {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  order_count: number;
  total_spent: number;
  is_active: boolean;
  created_at: string;
};

const CustomersPage = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [search, setSearch] = useState("");
  const [selectedCust, setSelectedCust] = useState<Customer | null>(null);

  useEffect(() => {
    const fetch = async () => {
      try {
        const result = await adminApi.listAdminCustomers();
        if (result.customers.length > 0) {
          setCustomers(
            result.customers.map((c) => ({
              id: c.id,
              full_name: c.full_name,
              email: c.email,
              phone: c.phone || "",
              order_count: 0,
              total_spent: 0,
              is_active: true,
              created_at: c.created_at || "",
            })),
          );
        }
      } catch {}
    };
    fetch();
  }, []);

  const handleToggleStatus = async (id: string) => {
    const target = customers.find((c) => c.id === id);
    if (!target) return;
    const nextState = !target.is_active;
    try {
      await adminApi.updateCustomerStatus(id, nextState);
      const updated = customers.map((c) => {
        if (c.id === id) {
          toast.info(`Customer account ${nextState ? "activated" : "deactivated"}.`);
          return { ...c, is_active: nextState };
        }
        return c;
      });
      setCustomers(updated);
      if (selectedCust && selectedCust.id === id) {
        const match = updated.find((c) => c.id === id);
        if (match) setSelectedCust(match);
      }
    } catch {
      toast.error("Failed to update customer status.");
    }
  };

  const filteredCustomers = customers.filter(
    (c) =>
      c.full_name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 font-dm-sans text-soil select-none">
      <div>
        <h2 className="font-playfair text-2xl font-bold tracking-wider">Customers Database</h2>
        <p className="text-xs text-dust tracking-wide mt-1">Review customer directories, monitor lifetime stats, and manage accounts.</p>
      </div>

      <div className="relative max-w-md border border-sand/40 bg-cream p-4 rounded-xs">
        <input
          type="text"
          placeholder="Search by full name or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-chalk border border-sand/50 rounded-xs py-2 pl-9 pr-3 text-xs tracking-wide placeholder:text-dust/50 focus:outline-none focus:border-terracotta transition-all"
        />
        <Search className="absolute left-7 top-6.5 size-4 text-dust/60" />
      </div>

      <div className="border border-sand/40 rounded-xs bg-cream overflow-x-auto shadow-xs">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-sand/30 bg-sand/10 text-[10px] font-bold tracking-wider uppercase text-dust">
              <th className="p-4">Customer</th>
              <th className="p-4">Phone</th>
              <th className="p-4">Orders Frequency</th>
              <th className="p-4">Total Spent</th>
              <th className="p-4">Created At</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-sand/20">
            {filteredCustomers.map((c) => (
              <tr key={c.id} className="hover:bg-sand/5 transition-colors">
                <td className="p-4">
                  <div className="font-bold text-soil">{c.full_name}</div>
                  <div className="text-[10px] text-dust/80 font-medium tracking-wide mt-0.5">{c.email}</div>
                </td>
                <td className="p-4 font-semibold text-soil/85">{c.phone}</td>
                <td className="p-4 font-bold">{c.order_count} purchases</td>
                <td className="p-4 font-bold text-soil">Rp {c.total_spent.toLocaleString("id-ID")}</td>
                <td className="p-4 text-dust/80 font-semibold">{c.created_at}</td>
                <td className="p-4">
                  <span className={`inline-flex rounded-xs px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider ${
                    c.is_active
                      ? "bg-[#e2f0d9] text-[#385723]"
                      : "bg-sand/35 text-dust"
                  }`}>
                    {c.is_active ? "Active" : "Banned"}
                  </span>
                </td>
                <td className="p-4 text-right">
                  <div className="flex items-center justify-end gap-3">
                    <button
                      onClick={() => handleToggleStatus(c.id)}
                      className="p-1 hover:text-terracotta transition-colors border-0 bg-transparent cursor-pointer"
                      title={c.is_active ? "Deactivate user" : "Activate user"}
                    >
                      {c.is_active ? (
                        <ToggleRight className="size-5 text-terracotta" />
                      ) : (
                        <ToggleLeft className="size-5 text-dust/60" />
                      )}
                    </button>
                    <button
                      onClick={() => setSelectedCust(c)}
                      className="border border-sand bg-chalk px-3 py-1.5 text-[9px] font-bold tracking-widest text-soil uppercase hover:bg-cream rounded-xs cursor-pointer transition-colors"
                    >
                      Inspect
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {filteredCustomers.length === 0 && (
              <tr>
                <td colSpan={7} className="p-8 text-center text-xs text-dust tracking-wider font-medium">
                  No customers found matching criteria.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {selectedCust && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div
            className="fixed inset-0 bg-soil/45 backdrop-blur-xs transition-opacity duration-300"
            onClick={() => setSelectedCust(null)}
          />
          <div className="relative w-full max-w-xl bg-chalk p-6 shadow-xl border-l border-sand/40 overflow-y-auto h-screen flex flex-col justify-between transition-transform duration-300">
            <div>
              <div className="flex items-center justify-between border-b border-sand/30 pb-4 mb-6">
                <div>
                  <h3 className="font-playfair text-xl font-bold tracking-wider">
                    {selectedCust.full_name}
                  </h3>
                  <span className="text-[10px] text-dust tracking-wide font-medium mt-0.5">
                    Member since: {selectedCust.created_at}
                  </span>
                </div>
                <button
                  onClick={() => setSelectedCust(null)}
                  className="p-1 hover:text-terracotta transition-colors border-0 bg-transparent cursor-pointer"
                >
                  <X className="size-5" />
                </button>
              </div>

              <div className="border border-sand/45 p-4 bg-cream rounded-xs divide-y divide-sand/20 space-y-4 mb-6">
                <div className="grid gap-4 sm:grid-cols-2 text-xs font-semibold">
                  <div>
                    <span className="block text-[9px] font-bold text-dust uppercase">Email Address</span>
                    <span className="text-soil">{selectedCust.email}</span>
                  </div>
                  <div>
                    <span className="block text-[9px] font-bold text-dust uppercase">Phone Number</span>
                    <span className="text-soil">{selectedCust.phone}</span>
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 text-xs font-semibold pt-4">
                  <div>
                    <span className="block text-[9px] font-bold text-dust uppercase">Total Orders</span>
                    <span className="text-soil">{selectedCust.order_count} checkouts</span>
                  </div>
                  <div>
                    <span className="block text-[9px] font-bold text-dust uppercase">Lifetime Spent</span>
                    <span className="text-soil">Rp {selectedCust.total_spent.toLocaleString("id-ID")}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4">
                  <div className="flex items-center gap-2">
                    <UserCheck className="size-4 text-soil" />
                    <span className="text-xs font-semibold">Account status active</span>
                  </div>
                  <button
                    onClick={() => handleToggleStatus(selectedCust.id)}
                    className={`px-3 py-1.5 text-[9px] font-bold tracking-widest uppercase border rounded-xs cursor-pointer transition-colors ${
                      selectedCust.is_active
                        ? "bg-terracotta text-chalk border-terracotta hover:bg-[#9a5230]"
                        : "bg-soil text-chalk border-soil hover:bg-soil/90"
                    }`}
                  >
                    {selectedCust.is_active ? "Ban Customer" : "Unban Customer"}
                  </button>
                </div>
              </div>

              <div className="border border-sand/35 rounded-xs bg-chalk overflow-hidden">
                <div className="bg-sand/15 px-4 py-2 border-b border-sand/30">
                  <span className="text-[10px] font-bold tracking-wider text-dust uppercase">Purchase Invoices History</span>
                </div>
                <div className="divide-y divide-sand/20">
                  {[].map((ord: any) => (
                    <div key={ord.id} className="p-4 flex items-center justify-between text-xs font-semibold">
                      <div>
                        <div className="font-bold text-soil">{ord.order_number}</div>
                        <div className="text-[9px] text-dust font-semibold tracking-wide mt-0.5">{ord.created_at}</div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className={`rounded-xs px-2 py-0.5 text-[8px] font-bold uppercase tracking-widest ${
                          ord.status === "delivered"
                            ? "bg-[#e2f0d9] text-[#385723]"
                            : "bg-[#fff2cc] text-[#7f6000]"
                        }`}>
                          {ord.status}
                        </span>
                        <span className="font-bold text-soil">
                          Rp {ord.total.toLocaleString("id-ID")}
                        </span>
                      </div>
                    </div>
                  ))}
                  {true && (
                    <div className="p-6 text-center text-[10px] text-dust/60 font-semibold tracking-wider">
                      No invoices recorded.
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end border-t border-sand/30 pt-6 mt-6">
              <button
                type="button"
                onClick={() => setSelectedCust(null)}
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

export default CustomersPage;
