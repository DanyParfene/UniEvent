import { useEffect, useState } from "react";
import type { Form } from "../../config/create-event";
import EventCardEditor from "./EventCardEditor";
import Accordion from "../common/Accordion";
import SocialMediaCard from "./SocialMediaCard";
import DriveImage from "../common/DriveImage";
import ActionButton from "../common/ActionButton";
import { bannerLabel } from "./eventMainType";

const EventCardMain = () => {
  const editGeneralDataButtonIndex = 0;
  const editSocialMediaButtonIndex = 6;

  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const [eventData, setEventData] = useState<Partial<Form>>({});

  useEffect(() => {
    setEventData(() => {
      return {
        eventName: "Test event",
        startEventDate: new Date().toLocaleDateString("en-CA"),
        finishEventDate: new Date().toLocaleDateString("en-CA"),
        edition: 3,
        organizer: "",
        description: "Dummy description",
        invitations: [],
      };
    });
  }, []);

  // structura de Array care contine datele din eventData care poate fi mapata
  const sections = [
    {
      sectionTitle: "Date Generale",
      fields: [
        { label: "Nume Eveniment", value: eventData.eventName },
        { label: "Dată Început", value: eventData.startEventDate },
        { label: "Ediție", value: eventData.edition },
      ],
    },
    {
      sectionTitle: "Detalii",
      fields: [
        { label: "Organizator", value: eventData.organizer },
        { label: "Descriere", value: eventData.description },
      ],
    },
  ];

  function editDataAction () {
    // TO DO
  }

  function editSocialMediaAction () {
    // TO DO
  }



  return (
    <>
      {isEditMode == false ? (
        <div className="max-w-4xl mx-auto my-10 flex flex-col gap-8 px-6 py-8 bg-white border border-slate-100 shadow-xl shadow-slate-200/50 rounded-3xl">
          <ActionButton action={() => setIsEditMode(true)}>Open Edit mode</ActionButton>
          {sections.map((section: any, idx: any) => (
            <div key={idx} className="group">
              <div className="flex items-center gap-4 mb-6">
                <h2 className="text-2xl font-bold tracking-tight text-slate-800">
                  {section.sectionTitle}
                </h2>
                <div className="h-px flex-1 bg-slate-100" />
                {editGeneralDataButtonIndex === idx && (
                  <ActionButton action={editDataAction}>Editează</ActionButton>
                )}
                {editSocialMediaButtonIndex === idx && (
                  <ActionButton action={editSocialMediaAction}>
                    Editează
                  </ActionButton>
                )}
              </div>

              <div className="space-y-6">
                {section.fields.map((f: any, fIdx: any) => (
                  <div key={fIdx} className="ml-2">
                    {f.label === bannerLabel ? (
                      <div className="space-y-3">
                        <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                          {f.label}
                        </span>
                        <div className="rounded-2xl overflow-hidden border border-slate-100 shadow-sm">
                          <DriveImage link={f.value.toString()} />
                        </div>
                      </div>
                    ) : Array.isArray(f.value) ? (
                      <div className="ml-4">
                        <Accordion
                          title={f.label + " (" + f.value.length + " link-rui)"}
                          styles=""
                        >
                          <div className="ml-2 flex flex-col gap-4 w-full items-center px-4">
                            {f.value.map((link: any) => (
                              <SocialMediaCard
                                link={link.link}
                                reach={link.reach}
                                engagement={link.engagement}
                              />
                            ))}
                          </div>
                        </Accordion>
                      </div>
                    ) : (
                      <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-4">
                        <span className="min-w-[120px] text-sm font-semibold text-slate-500">
                          {f.label}
                        </span>
                        <span className="text-slate-800 font-medium">
                          {f.value}
                        </span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div>
          <EventCardEditor eventData={eventData} />
        </div>
        /*  <></> */
      )}
    </>
  );
};

export default EventCardMain;
