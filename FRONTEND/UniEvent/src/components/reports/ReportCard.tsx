export type ReportData = {
    id: string | number;
    title?: string;
    imageUrl?: string;
}

const ReportCard = ({ title, imageUrl }: ReportData) => {
    return (
        <div className="w-full max-w-xs p-4 flex flex-col justify-between items-center border-2 border-gray-200 shadow-sm rounded-3xl 
                        transition-all duration-300 hover:shadow-xl hover:shadow-blue-100/50">
            
            <div className="w-full flex flex-col items-center justify-center p-6 w-full">
                {title && (
                    <h3 className="text-xl font-black text-text-secondary leading-tight text-center mb-4">
                        {title}
                    </h3>
                )}

                {imageUrl && (
                    <div className="relative w-full h-22 flex items-center justify-center p-2">
                        <img 
                            src={imageUrl} 
                            alt="content" 
                            className="relative max-w-full max-h-full object-contain transition-transform duration-500 group-hover:scale-110"
                        />
                    </div>
                )}
            </div>

            <button className="mt-6 w-full sm:w-auto px-12 py-3 
                        bg-white border border-gray-200 rounded-2xl shadow-sm 
                        text-sm font-black text-primary 
                        transition-all duration-300 
                        hover:bg-primary hover:text-white cursor-pointer 
                        active:scale-95 shrink-0">
                Generare
            </button>
        </div>
    );
}

export default ReportCard;