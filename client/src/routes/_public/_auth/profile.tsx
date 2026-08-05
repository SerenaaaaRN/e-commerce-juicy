import { ProfilePage } from "@/features/profile/ProfilePage"
import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/_public/_auth/profile")({
  component: ProfilePage,
})