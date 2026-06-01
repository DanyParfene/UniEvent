import { createFileRoute } from '@tanstack/react-router'
import { requireGuest } from '../lib/require-auth'
import RegisterCard from '../components/account/RegisterCard'

export const Route = createFileRoute('/inregistrare')({
  beforeLoad: () => requireGuest(),
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className="w-full flex flex-col items-center justify-center bg-gray-50 py-12 px-4 min-h-[calc(100vh-5rem)]">
      <RegisterCard />
    </div>
  )
}
