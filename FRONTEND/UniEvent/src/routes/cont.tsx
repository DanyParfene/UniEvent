import { createFileRoute } from '@tanstack/react-router'
import UserCard from '../components/account/UserCard';

export const Route = createFileRoute('/cont')({
  component: RouteComponent,
})

function RouteComponent() {
  // aici trebuie extras rolul utilizatorului dintr-un context sau ceva 
  const userRole = "Super Administrator"; 

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-12 px-4 sm:px-6 lg:px-8 w-full">
      <UserCard currentUserRole={userRole} />
    </div>
  )
}