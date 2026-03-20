import { PartnerCard, type Partner } from "../partners/PartnerCard";
import nokiaLogo from "../../assets/nokia_logo.png";
import continentalLogo from "../../assets/continental_logo.png";
import atosLogo from "../../assets/atos_logo.png";
import bcrLogo from "../../assets/bcr_logo.png";
import ArrowForwardIcon from "../../assets/arrow-forward.svg?react";
import { useEffect, useState } from "react";

const partners: Partner[] = [
  { id: 0, name: "Nokia", logo: nokiaLogo },
  { id: 1, name: "Continental", logo: continentalLogo },
  { id: 2, name: "Atos", logo: atosLogo },
  { id: 3, name: "BCR", logo: bcrLogo },
  { id: 4, name: "Nokia", logo: nokiaLogo },
  { id: 5, name: "Continental", logo: continentalLogo },
  { id: 6, name: "Atos", logo: atosLogo },
  { id: 7, name: "BCR", logo: bcrLogo },
];

const Carousel = () => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [visibleItems, setVisibleItems] = useState<number>(0);

  const maxIndex = partners.length - visibleItems;

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev <= 0 ? maxIndex : prev - 1));
  };

  useEffect(() => {
    const updateVisibleItems = () => {
      const width = window.innerWidth;

      if (width < 640) {
        setVisibleItems(1);
      } else if (width < 768) {
        setVisibleItems(2);
      } else if (width < 1024) {
        setVisibleItems(3);
      } else {
        setVisibleItems(4);
      }
    };

    updateVisibleItems(); // run once on mount

    window.addEventListener("resize", updateVisibleItems);

    return () => {
      window.removeEventListener("resize", updateVisibleItems);
    };
  }, []);

  console.log(visibleItems)

  return (
    <div className="relative w-full max-w-[60vw]">
      <div className="overflow-hidden">
        <div
          className="-ml-4 flex transition-transform duration-500 ease-in-out"
          style={{
            transform: `translateX(-${currentIndex * (100 / visibleItems)}%)`,
          }}
        >
          {partners.map((partner, index) => (
            <div key={`${partner.id}-${index}`} className="shrink-0 px-2"
              style={{ flex: `0 0 ${100 / visibleItems}%` }}>
              <PartnerCard
                id={partner.id}
                name={partner.name}
                logo={partner.logo}
                disableHover={true}
              />
            </div>
          ))}
        </div>
      </div>

      <button
        type="button"
        onClick={prevSlide}
        className="absolute left-3 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-xl border border-white/15 bg-white/10 shadow-lg backdrop-blur-md transition hover:scale-105 hover:bg-white/20 active:scale-95 cursor-pointer"
      >
        <ArrowForwardIcon className="fill-primary rotate-180" />
      </button>

      <button
        type="button"
        onClick={nextSlide}
        className="absolute right-3 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-xl border border-white/15 bg-white/10 shadow-lg backdrop-blur-md transition hover:scale-105 hover:bg-white/20 active:scale-95 cursor-pointer"
      >
        <ArrowForwardIcon className="fill-primary" />
      </button>
    </div>
  );
};

export default Carousel;
