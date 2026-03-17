import { createFileRoute } from '@tanstack/react-router'
import FilterCard from '../components/filter/FilterCard'

export const Route = createFileRoute('/filtrare-evenimente')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div className='w-screen h-screen flex flex-col items-center overflow-y-auto py-16'>
    <FilterCard/>
  </div>
}
