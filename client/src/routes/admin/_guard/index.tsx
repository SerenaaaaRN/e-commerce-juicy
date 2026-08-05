import { createFileRoute, redirect } from "@tanstack/react-router"

export const Route = createFileRoute("/admin/_guard/")({
  beforeLoad: () => {
    throw redirect({ to: "/admin/dashboard" })
  },
})