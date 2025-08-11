import ErrorBoundary from '@/components/composites/common/ErrorBoundary'
import ProductSectionSkeleton from '@/components/composites/dashboard/products/skeletons/ProductSectionSkeleton'
import type { DashboardDataReturn } from '@/containers/dashboard/dashboardDataService'
import ProductSectionContainer from '@/containers/product/ProductSectionContainer'
import { Suspense } from 'react'

interface Dashboard {
  accessToken: string
  products: DashboardDataReturn['products']
  inventory: DashboardDataReturn['inventoryData']
}

export default function Dashboard({ accessToken, products, inventory }: Dashboard) {
  console.log("dashboard is server component")
  return (
  // * pass server fetched data to client component as a promise (prop)
  //* wrap in suspense to wait for promise to resolve
    <ErrorBoundary>
      <Suspense fallback={<ProductSectionSkeleton />}>
        <ProductSectionContainer // dynamic rendering
          accessToken={accessToken}
          products={products}
          inventory={inventory}
        />
      </Suspense>
    </ErrorBoundary>
  )
}
