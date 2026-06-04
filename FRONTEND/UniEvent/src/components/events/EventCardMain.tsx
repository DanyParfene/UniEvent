import { useState } from "react";
import type { Form } from "../../config/creare-eveniment";
import EventCardEditor from "./EventCardEditor";
import Accordion from "../common/Accordion";
import SocialMediaCard from "./SocialMediaCard";
import DriveImage from "../common/DriveImage";
import ActionButton from "../common/ActionButton";
import {
  bannerLabel,
  categoryLabelToKey,
  eventDataToFormValues,
  type Section,
  type SocialMediaLink,
} from "./eventMainType";
import { useUpdateEvent } from "../../api/events";
import { useNavigate } from "@tanstack/react-router";

interface EventCardMainProps {
  initialSections: Section[];
  eventId?: string;
  isArchived?: boolean;
}

const EventCardMain = ({ initialSections, eventId, isArchived = false }: EventCardMainProps) => {
  const editGeneralDataButtonIndex = 0;
  const editSocialMediaButtonIndex = 6;

  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const [isSocialMediaEdit, setIsSocialMediaEdit] = useState<boolean>(false);
  const [currentEventData, setCurrentEventData] =
    useState<Section[]>(initialSections);
  const [backupData, setBackupData] = useState<Section[] | null>(null);
  const [showErrors, setShowErrors] = useState<boolean>(false);
  const [saveError, setSaveError] = useState<string>("");

  const updateEvent = eventId ? useUpdateEvent(eventId) : null;
  const navigate = useNavigate();

  function editDataAction() {
    setIsEditMode(true);
  }

  async function editSocialMediaAction() {
    if (!isSocialMediaEdit) {
      setBackupData(JSON.parse(JSON.stringify(currentEventData)));
      setSaveError("");
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

      if (updateEvent && eventId) {
        const metrics: { category: string; link: string; reach: number; engagement: number }[] = [];
        for (const field of socialMediaSection.fields) {
          const category = categoryLabelToKey[field.label];
          if (!category || !Array.isArray(field.value)) continue;
          for (const item of field.value as SocialMediaLink[]) {
            if (item.link.trim()) {
              metrics.push({
                category,
                link: item.link,
                reach: item.reach,
                engagement: item.engagement,
              });
            }
          }
        }

        if (metrics.length > 0) {
          try {
            await updateEvent.mutateAsync({ metrics });
            setSaveError("");
          } catch {
            setSaveError("Eroare la salvarea link-urilor. Încearcă din nou.");
            return;
          }
        }
      }

      setIsSocialMediaEdit(false);
      setShowErrors(false);
      setBackupData(null);
    }
  }

  async function archiveEventAction() {
    if (!updateEvent || !eventId) return;
    if (!window.confirm("Sigur dorești să arhivezi acest eveniment?")) return;

    try {
      await updateEvent.mutateAsync({ archive: true });
      navigate({ to: "/evenimente-arhivate", search: { page: 1 } });
    } catch {
      setSaveError("Eroare la arhivarea evenimentului.");
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
                        <div className="rounded-2xl overflow-hidden shadow-sm">
                          <DriveImage link={f.value.toString()} className="w-full object-cover" />
                        </div>
                      </div>
                    ) : Array.isArray(f.value) ? (
                      f.value.length === 0 && typeof f.value[0] !== "object" && idx !== editSocialMediaButtonIndex ? (
                        <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-4">
                          <span className="min-w-[120px] text-sm font-semibold text-slate-500">
                            {f.label}
                          </span>
                          <span className="text-slate-400 italic">-</span>
                        </div>
                      ) : f.value.length > 0 && typeof f.value[0] === "string" ? (
                        <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-4">
                          <span className="min-w-[120px] text-sm font-semibold text-slate-500">
                            {f.label}
                          </span>
                          <span className="text-slate-800 font-medium">
                            {f.value.join(", ")}
                          </span>
                        </div>
                      ) : (
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

          {saveError && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg text-center">
              {saveError}
            </div>
          )}

          {!isArchived && eventId && (
            <div className="flex justify-center mt-8 pt-6 border-t border-slate-100">
              <button
                onClick={archiveEventAction}
                disabled={updateEvent?.isPending}
                className="px-8 py-3 bg-white border border-red-200 rounded-2xl shadow-sm text-sm font-black text-red-500 hover:bg-red-500 hover:text-white transition-all cursor-pointer active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {updateEvent?.isPending ? "Se arhivează..." : "Arhivează evenimentul"}
              </button>
            </div>
          )}
        </div>
      ) : (
        <div>
          <EventCardEditor
            eventData={eventDataToFormValues(currentEventData) as Partial<Form>}
            eventId={eventId}
            onCancel={() => setIsEditMode(false)}
          />
        </div>
      )}
    </>
  );
};

export default EventCardMain;
