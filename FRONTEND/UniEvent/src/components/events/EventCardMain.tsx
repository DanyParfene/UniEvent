import Accordion from "../common/Accordion.tsx";
import { eventData, bannerLabel } from "./eventMainType.ts";
import Link from "../common/Link.tsx";
import DriveImage from "../common/DriveImage.tsx";

const EventCardMain = () => {
  return (
    <div className="flex flex-col justify-center w-[60vw] px-16 py-10 gap-4 shadow-md rounded-2xl m-auto">
      {eventData.map((e) => (
        <div>
          <div className="font-bold text-2xl">{e.sectionTitle}</div>
          <div className="">
            {e.fields.map((f) =>
              f.label === bannerLabel ? (
                <div className="ml-4">
                  <div className="text-lg font-semibold">{f.label}</div>
                  <div className="ml-2">
                    <DriveImage link={f.value.toString()} />
                  </div>
                </div>
              ) : Array.isArray(f.value) ? (
                <div className="ml-4">
                  <Accordion title={f.label} styles="">
                    <div className="ml-2 flex flex-col gap-4 w-full items-center px-4">
                      {f.value.map((link) => (
                        <div className="rounded-lg shadow-sm px-4 py-2 flex flex-col justify-between items-center hover:shadow-md transition-all duration-300 w-full md:flex-row lg:flex-row">
                          <Link link={link.link} />
                          <label className="flex flex-row md:flex-col lg:flex-col gap-2">
                            <span className="font-semibold">Reach</span>
                            {link.reach}
                          </label>
                          <label className="flex flex-row md:flex-col lg:flex-col gap-2">
                            <span className="font-semibold">Engagement</span>
                            {link.engagement}
                          </label>
                        </div>
                      ))}
                    </div>
                  </Accordion>
                </div>
              ) : (
                <div className="ml-4">
                  <div className="text-lg font-semibold">{f.label}</div>
                  <div className="ml-2">{f.value}</div>
                </div>
              ),
            )}
          </div>
          <hr className="m-2" />
        </div>
      ))}
    </div>
  );
};

export default EventCardMain;
