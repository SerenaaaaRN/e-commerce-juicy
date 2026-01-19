import { Frame, LayoutDashboard, MapIcon, Package, PieChart, Settings, Store } from "lucide-react";

export const adminNavConfig = {
  user: {
    name: "Admin",
    email: "admin@juicy.com",
    avatar: "/avatars/shadcn.jpg",
  },
  teams: [
    {
      name: "Juicy Store",
      logo: Store,
      plan: "Pro Plan",
    },
  ],
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: LayoutDashboard,
      isActive: true,
      items: [
        {
          title: "Overview",
          url: "/dashboard",
        },
        {
          title: "Analytics",
          url: "/dashboard/analytics",
        },
      ],
    },
    {
      title: "E-Commerce",
      url: "#",
      icon: Package,
      items: [
        {
          title: "Products",
          url: "/dashboard/products",
        },
        {
          title: "Orders",
          url: "/dashboard/orders",
        },
        {
          title: "Customers",
          url: "/dashboard/customers",
        },
      ],
    },
    {
      title: "Settings",
      url: "#",
      icon: Settings,
      items: [
        {
          title: "General",
          url: "/dashboard/settings",
        },
        {
          title: "Team",
          url: "/dashboard/settings/team",
        },
      ],
    },
  ],
  projects: [
    {
      name: "Payment Gateway",
      url: "#",
      icon: Frame,
    },
    {
      name: "Shipping Partner",
      url: "#",
      icon: MapIcon,
    },
    {
      name: "Marketing Ads",
      url: "#",
      icon: PieChart,
    },
  ],
};
