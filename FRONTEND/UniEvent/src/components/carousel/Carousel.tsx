import ArrowForwardIcon from "../../assets/arrow-forward.svg?react";
import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { usePartners } from "../../api/partners";
import { getGoogleDriveDirectLink } from "../common/DriveImage";

interface CarouselProps {
  department?: string;
}

const Carousel = ({ department }: CarouselProps) => {
  const { data: partners } = usePartners(department);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [visibleItems, setVisibleItems] = useState<number>(0);

  const maxIndex = Math.max(0, partners.length - visibleItems);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev <= 0 ? maxIndex : prev - 1));
  };

  useEffect(() => {
    const updateVisibleItems = () => {
      const width = window.innerWidth;
      if (width < 640) setVisibleItems(1);
      else if (width < 768) setVisibleItems(2);
      else if (width < 1024) setVisibleItems(3);
      else setVisibleItems(4);
    };

    updateVisibleItems();
    window.addEventListener("resize", updateVisibleItems);
    return () => window.removeEventListener("resize", updateVisibleItems);
  }, []);

  if (partners.length === 0) return null;

  return (
    <div className="relative w-full max-w-7xl mx-auto px-4 md:px-12 py-10">
      <div className="mb-14 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-text-secondary">
          Parteneri
        </h2>
        <div className="mt-2 h-1 w-20 bg-primary mx-auto rounded-full"></div>
      </div>

      <div className="relative">
        <div className="overflow-hidden p-2">
          <div
            className="-ml-4 flex transition-transform duration-500 ease-in-out"
            style={{
              transform: `translateX(-${currentIndex * (100 / visibleItems)}%)`,
            }}
          >
            {partners.map((partner, index) => (
              <div
                key={`${partner.id}-${index}`}
                className="shrink-0 px-2"
                style={{ flex: `0 0 ${100 / visibleItems}%` }}
              >
                <div className="relative flex flex-col items-center justify-center p-6 bg-white border border-gray-200 shadow-sm rounded-2xl">
                  {partner.logo_path ? (
                    <div className="h-16 w-full flex items-center justify-center mb-4">
                      <img
                        src={getGoogleDriveDirectLink(partner.logo_path)}
                        alt={`${partner.name} logo`}
                        className="max-h-full max-w-35 object-contain"
                      />
                    </div>
                  ) : (
                    <div className="h-16 w-full flex items-center justify-center mb-4">
                      <span className="text-2xl font-black text-primary">
                        {partner.name.charAt(0)}
                      </span>
                    </div>
                  )}
                  <p className="text-sm font-semibold text-gray-500">{partner.name}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <button
          type="button"
          onClick={prevSlide}
          className="absolute -left-4 md:-left-6 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-xl border border-white/15 bg-white/10 shadow-lg backdrop-blur-md transition hover:scale-105 hover:bg-white/20 active:scale-95 cursor-pointer"
        >
          <ArrowForwardIcon className="fill-primary rotate-180" />
        </button>

        <button
          type="button"
          onClick={nextSlide}
          className="absolute -right-4 md:-right-6 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-xl border border-white/15 bg-white/10 shadow-lg backdrop-blur-md transition hover:scale-105 hover:bg-white/20 active:scale-95 cursor-pointer"
        >
          <ArrowForwardIcon className="fill-primary" />
        </button>
      </div>

      <div className="mt-12 md:mt-16 flex justify-center w-full">
        <Link
          to="/parteneri"
          className="inline-block px-10 py-4 bg-white border border-gray-200 
                           rounded-2xl shadow-sm text-sm font-black text-primary 
                           transition-all duration-300 hover:bg-primary hover:text-text-primary 
                           hover:shadow-lg active:scale-95"
        >
          Vezi mai mulți parteneri
        </Link>
      </div>
    </div>
  );
};

export default Carousel;
