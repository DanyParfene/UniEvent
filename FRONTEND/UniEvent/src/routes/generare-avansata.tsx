import { createFileRoute } from '@tanstack/react-router'
import FilterCard from '../components/filter/FilterCard'
import { type Section } from '../components/events/eventMainType';
import { useRef, useState } from 'react';
import EventList from '../components/events/EventList';

export const Route = createFileRoute('/generare-avansata')({
  component: RouteComponent,
})

const MOCK_EVENTS: Section[][] = [
  [
    {
      sectionTitle: "Date generale",
      fields: [
        { label: "Denumire eveniment", value: "Workshop React Advanced" },
        { label: "Dată eveniment", value: "24 Mai 2026" },
        { label: "Oră eveniment", value: "10:00" },
        { label: "Locație", value: "Sala A1, Etaj 2" }
      ]
    }
  ],
  [
    {
      sectionTitle: "Date generale",
      fields: [
        { label: "Denumire eveniment", value: "Conferință AI & Viitorul" },
        { label: "Dată eveniment", value: "15 Iunie 2026" },
        { label: "Oră eveniment", value: "09:00" },
        { label: "Locație", value: "Aula Magna" }
      ]
    }
  ],
  [
    {
      sectionTitle: "Date generale",
      fields: [
        { label: "Denumire eveniment", value: "Workshop React Advanced" },
        { label: "Dată eveniment", value: "24 Mai 2026" },
        { label: "Oră eveniment", value: "10:00" },
        { label: "Locație", value: "Sala A1, Etaj 2" }
      ]
    }
  ],
  [
    {
      sectionTitle: "Date generale",
      fields: [
        { label: "Denumire eveniment", value: "Conferință AI & Viitorul" },
        { label: "Dată eveniment", value: "15 Iunie 2026" },
        { label: "Oră eveniment", value: "09:00" },
        { label: "Locație", value: "Aula Magna" }
      ]
    }
  ],
  [
    {
      sectionTitle: "Date generale",
      fields: [
        { label: "Denumire eveniment", value: "Workshop React Advanced" },
        { label: "Dată eveniment", value: "24 Mai 2026" },
        { label: "Oră eveniment", value: "10:00" },
        { label: "Locație", value: "Sala A1, Etaj 2" }
      ]
    }
  ],
  [
    {
      sectionTitle: "Date generale",
      fields: [
        { label: "Denumire eveniment", value: "Conferință AI & Viitorul" },
        { label: "Dată eveniment", value: "15 Iunie 2026" },
        { label: "Oră eveniment", value: "09:00" },
        { label: "Locație", value: "Aula Magna" }
      ]
    }
  ],
  [
    {
      sectionTitle: "Date generale",
      fields: [
        { label: "Denumire eveniment", value: "Workshop React Advanced" },
        { label: "Dată eveniment", value: "24 Mai 2026" },
        { label: "Oră eveniment", value: "10:00" },
        { label: "Locație", value: "Sala A1, Etaj 2" }
      ]
    }
  ],
  [
    {
      sectionTitle: "Date generale",
      fields: [
        { label: "Denumire eveniment", value: "Conferință AI & Viitorul" },
        { label: "Dată eveniment", value: "15 Iunie 2026" },
        { label: "Oră eveniment", value: "09:00" },
        { label: "Locație", value: "Aula Magna" }
      ]
    }
  ],
  [
    {
      sectionTitle: "Date generale",
      fields: [
        { label: "Denumire eveniment", value: "Workshop React Advanced" },
        { label: "Dată eveniment", value: "24 Mai 2026" },
        { label: "Oră eveniment", value: "10:00" },
        { label: "Locație", value: "Sala A1, Etaj 2" }
      ]
    }
  ],
  [
    {
      sectionTitle: "Date generale",
      fields: [
        { label: "Denumire eveniment", value: "Conferință AI & Viitorul" },
        { label: "Dată eveniment", value: "15 Iunie 2026" },
        { label: "Oră eveniment", value: "09:00" },
        { label: "Locație", value: "Aula Magna" }
      ]
    }
  ],
  [
    {
      sectionTitle: "Date generale",
      fields: [
        { label: "Denumire eveniment", value: "Workshop React Advanced" },
        { label: "Dată eveniment", value: "24 Mai 2026" },
        { label: "Oră eveniment", value: "10:00" },
        { label: "Locație", value: "Sala A1, Etaj 2" }
      ]
    }
  ],
  [
    {
      sectionTitle: "Date generale",
      fields: [
        { label: "Denumire eveniment", value: "Conferință AI & Viitorul" },
        { label: "Dată eveniment", value: "15 Iunie 2026" },
        { label: "Oră eveniment", value: "09:00" },
        { label: "Locație", value: "Aula Magna" }
      ]
    }
  ],
];
console.log(MOCK_EVENTS);

function RouteComponent() {
  const [showResults, setShowResults] = useState(false);
  const resultsRef = useRef<HTMLDivElement>(null);

  const handleSearch = () => {
    setShowResults(true);
    setTimeout(() => {
      resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  return (
    <div className='w-full flex flex-col items-center bg-gray-50 py-12 px-4 min-h-screen'>
      <FilterCard 
        title="Generare avansată" 
        onSearch={handleSearch} 
      />

      {showResults && (
        <div 
          ref={resultsRef} 
          className="w-full max-w-7xl mt-16 animate-in fade-in slide-in-from-bottom-4 duration-700"
        >
          <div className="flex flex-row justify-between items-center mb-8 px-2">
            <div>
            <h1 className="text-3xl font-bold text-text-secondary tracking-tight">
              Rezultate
            </h1>
            <div className="mt-2 h-1 w-20 bg-primary rounded-full"></div>
          </div>
            <button className="px-6 py-2 bg-primary text-white font-bold rounded-xl transition-all hover:shadow-lg active:scale-95 cursor-pointer">
              Generare
            </button>
          </div>

          <EventList 
            events={MOCK_EVENTS} 
            isArchived={false} 
            isGrid={true} 
            showCardButton={false} 
          />
        </div>
      )}
    </div>
  )
}