import { createFileRoute } from "@tanstack/react-router";
import nokiaLogo from "../assets/nokia_logo.png";
import atosLogo from "../assets/atos_logo.png";
import bcrLogo from "../assets/bcr_logo.png";
import ReportCard from "../components/reports/ReportCard";
import ReportSection from "../components/reports/ReportSection";
import { type ReportData } from "../components/reports/ReportCard";

export const Route = createFileRoute("/rapoarte")({
  component: RouteComponent,
});

function RouteComponent() {
  const sponsors: ReportData[] = [
    { id: 1, imageUrl: nokiaLogo },
    { id: 2, imageUrl: atosLogo },
    { id: 3, imageUrl: bcrLogo },
  ];

  const events: ReportData[] = [
    { id: 1, title: "Eveniment Decembrie" },
    { id: 2, title: "Workshop React" },
    { id: 3, title: "Hackathon 2024" },
  ];

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-10 md:px-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
        <div>
          <h1 className="text-3xl md:text-5xl font-bold text-text-secondary tracking-tight">
            Rapoarte
          </h1>
          <div className="mt-2 h-1.5 w-20 bg-primary rounded-full"></div>
        </div>

        <button className="flex items-center justify-center gap-2 px-8 py-3 bg-primary rounded-2xl shadow-md text-sm font-bold text-white transition-all hover:shadow-lg active:scale-95 cursor-pointer">
          Generare Avansată
        </button>
      </div>

      <div className="flex flex-col gap-12">
        <ReportSection title="Interval de Timp">
          {["1 an", "6 luni", "3 luni"].map((t) => (
            <ReportCard key={t} id={t} title={`Raport ${t}`} />
          ))}
        </ReportSection>

        <ReportSection title="Sponsori">
          {sponsors.map((sponsor) => (
            <ReportCard
              key={sponsor.id}
              id={sponsor.id}
              imageUrl={sponsor.imageUrl}
            />
          ))}
        </ReportSection>

        <ReportSection title="Evenimente Specifice">
          {events.map((event) => (
            <ReportCard key={event.id} id={event.id} title={event.title} />
          ))}
        </ReportSection>
      </div>
    </div>
  );
}
