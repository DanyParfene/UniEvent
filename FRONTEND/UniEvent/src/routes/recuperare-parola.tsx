import { createFileRoute } from '@tanstack/react-router'
import RecoverPasswordCard from '../components/account/RecoverPasswordCard'

export const Route = createFileRoute('/recuperare-parola')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8 w-full">
      <RecoverPasswordCard />
    </div>
  )
}