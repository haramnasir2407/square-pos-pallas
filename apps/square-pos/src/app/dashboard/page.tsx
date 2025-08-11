import { DashboardContainer } from '@/containers/dashboard'
/**
 * Dashboard page for authenticated users.
 * Fetches products and inventory server-side, and renders the product section.
 * Redirects to home if not authenticated.
 */
export default function DashboardPage() {
  return <DashboardContainer />
}
