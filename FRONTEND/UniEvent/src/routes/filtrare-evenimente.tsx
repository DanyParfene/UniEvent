import { createFileRoute } from '@tanstack/react-router'
import FilterCard from '../components/filter/FilterCard'

export const Route = createFileRoute('/filtrare-evenimente')({
  component: RouteComponent,
})

function RouteComponent() {
  const handleSearch = () => {

  }

  return (
    <div className='w-full flex flex-col items-center justify-center py-12 px-4 min-h-[calc(100vh-5rem)]'>
      <FilterCard title="Filtrare evenimente" onSearch={handleSearch}/>
    </div>
  )
}