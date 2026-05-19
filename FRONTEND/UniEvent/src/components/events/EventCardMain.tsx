import { useState } from "react";
import type { Form } from "../../config/creare-eveniment";
import EventCardEditor from "./EventCardEditor";
import Accordion from "../common/Accordion";
import SocialMediaCard from "./SocialMediaCard";
import DriveImage from "../common/DriveImage";
import ActionButton from "../common/ActionButton";
import {
  bannerLabel,
  eventData, // mock data din eventMainType
  eventDataToFormValues,
  type Section,
} from "./eventMainType";

interface EventCardMainProps {
  isArchived?: boolean;
}

const EventCardMain = ({ isArchived = false }: EventCardMainProps) => {
  const editGeneralDataButtonIndex = 0;
  const editSocialMediaButtonIndex = 6;

  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const [isSocialMediaEdit, setIsSocialMediaEdit] = useState<boolean>(false);
  const [currentEventData, setCurrentEventData] =
    useState<Section[]>(eventData);
  const [backupData, setBackupData] = useState<Section[] | null>(null);
  const [showErrors, setShowErrors] = useState<boolean>(false);

  function editDataAction() {
    setIsEditMode(true);
  }

  function editSocialMediaAction() {
    if (!isSocialMediaEdit) {
      setBackupData(JSON.parse(JSON.stringify(currentEventData)));
      setIsSocialMediaEdit(true);
    } else {
      const socialMediaSection = currentEventData[editSocialMediaButtonIndex];
      const hasEmptyLinks = socialMediaSection.fields.some(
        (field) =>
          Array.isArray(field.value) &&
          field.value.some((linkObj: any) => linkObj.link.trim() === ""),
      );

      if (hasEmptyLinks) {
        setShowErrors(true);
        return;
      }

      setIsSocialMediaEdit(false);
      setShowErrors(false);
      setBackupData(null);
    }
  }

  function cancelSocialMediaAction() {
    if (backupData) {
      setCurrentEventData(backupData);
    }
    setIsSocialMediaEdit(false);
    setShowErrors(false);
    setBackupData(null);
  }

  const addSocialMediaLink = (sectionIdx: number, fieldIdx: number) => {
    const updatedData = [...currentEventData];
    const targetField = updatedData[sectionIdx].fields[fieldIdx];

    if (Array.isArray(targetField.value)) {
      const newLink = {
        link: "",
        reach: 0,
        engagement: 0,
        isNew: true,
      };

      targetField.value.push(newLink as any);

      setCurrentEventData(updatedData);
    }
  };

  const removeSocialMediaLink = (
    sectionIdx: number,
    fieldIdx: number,
    linkIdx: number,
  ) => {
    const updatedData = [...currentEventData];
    const targetField = updatedData[sectionIdx].fields[fieldIdx];

    if (Array.isArray(targetField.value)) {
      targetField.value.splice(linkIdx, 1);
      setCurrentEventData([...updatedData]);
    }
  };

  const handleUpdateLink = (
    sectionIdx: number,
    fieldIdx: number,
    linkIdx: number,
    updatedValue: any,
  ) => {
    const newData = [...currentEventData];
    const targetField = newData[sectionIdx].fields[fieldIdx];
    if (Array.isArray(targetField.value)) {
      (targetField.value as any[])[linkIdx] = updatedValue;
      setCurrentEventData(newData);
    }
  };

  return (
    <>
      {isEditMode == false ? (
        <div className="max-w-4xl mx-auto my-10 flex flex-col gap-8 px-6 py-8 bg-white border border-slate-100 shadow-xl shadow-slate-200/50 rounded-3xl">
          {currentEventData.map((section: Section, idx: number) => (
            <div key={idx} className="group">
              <div className="flex items-center gap-4 mb-6">
                <h2 className="text-2xl font-bold tracking-tight text-slate-800">
                  {section.sectionTitle}
                </h2>
                <div className="h-px flex-1 bg-slate-100" />

                {!isArchived && editGeneralDataButtonIndex === idx && (
                  <ActionButton
                    className="text-primary font-bold hover:underline"
                    action={editDataAction}
                  >
                    Editează
                  </ActionButton>
                )}

                {!isArchived && editSocialMediaButtonIndex === idx && (
                  <div className="flex gap-2">
                    <ActionButton
                      className="text-primary font-bold hover:underline"
                      action={editSocialMediaAction}
                    >
                      {isSocialMediaEdit ? "Salvează" : "Editează"}
                    </ActionButton>

                    {isSocialMediaEdit && (
                      <ActionButton
                        className="text-primary font-bold hover:underline"
                        action={cancelSocialMediaAction}
                      >
                        Anulează
                      </ActionButton>
                    )}
                  </div>
                )}
              </div>

              <div className="space-y-6">
                {section.fields.map((f: any, fIdx: number) => (
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
                      // AICI E REZOLVAREA: Verificăm dacă primul element e string (ex: Invitați)
                      typeof f.value[0] === "string" ? (
                        <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-4">
                          <span className="min-w-[120px] text-sm font-semibold text-slate-500">
                            {f.label}
                          </span>
                          <span className="text-slate-800 font-medium">
                            {/* Le unim frumos cu virgulă și spațiu */}
                            {f.value.join(", ")}
                          </span>
                        </div>
                      ) : (
                        // Dacă e array de obiecte, îl punem în Acordeon (Social Media)
                        <div className="ml-4">
                          <Accordion
                            title={
                              f.label + " (" + f.value.length + " link-uri)"
                            }
                            styles=""
                          >
                            <div className="ml-2 flex flex-col gap-4 w-full items-center px-4 py-2">
                              {f.value.map((link: any, linkIdx: number) => (
                                <SocialMediaCard
                                  key={linkIdx}
                                  link={link.link}
                                  reach={link.reach}
                                  engagement={link.engagement}
                                  forcedEditMode={isSocialMediaEdit}
                                  showDelete={isSocialMediaEdit}
                                  showErrors={
                                    showErrors && link.link.trim() === ""
                                  }
                                  onDelete={() =>
                                    removeSocialMediaLink(idx, fIdx, linkIdx)
                                  }
                                  onChange={(updatedValue) =>
                                    handleUpdateLink(
                                      idx,
                                      fIdx,
                                      linkIdx,
                                      updatedValue,
                                    )
                                  }
                                />
                              ))}

                              {isSocialMediaEdit && (
                                <ActionButton
                                  className="w-full mt-4 border-2 border-dashed border-slate-200 rounded-xl py-4 text-slate-500 font-bold hover:border-primary hover:text-primary transition-all"
                                  action={() => addSocialMediaLink(idx, fIdx)}
                                >
                                  + Adaugă Link Nou
                                </ActionButton>
                              )}
                            </div>
                          </Accordion>
                        </div>
                      )
                    ) : (
                      // Dacă e valoare simplă (string/număr)
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
          <EventCardEditor
            eventData={eventDataToFormValues(currentEventData) as Partial<Form>}
            onCancel={() => setIsEditMode(false)}
          />
        </div>
      )}
    </>
  );
};

export default EventCardMain;
