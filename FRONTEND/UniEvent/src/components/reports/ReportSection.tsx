interface ReportSectionProps {
  title: string;
  children: React.ReactNode;
}

const ReportSection = ({ title, children }: ReportSectionProps) => {
    return (
    <div className="flex flex-col">
      <div className="mb-10 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-text-secondary">
          {title}
        </h2>
        <div className="mt-2 h-1 w-20 bg-primary mx-auto rounded-full"></div>
      </div>
      <div className="flex gap-5 flex-wrap w-full justify-center">
        {children}
      </div>
    </div>
  );
}

export default ReportSection;