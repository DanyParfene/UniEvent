import { useAppForm } from "../form";
import {
  formSchema,
  formSteps,
  type Form,
} from "../../config/creare-eveniment";
import { useState } from "react";
import { useUpdateEvent } from "../../api/events";

function formValuesToApiPayload(value: Record<string, unknown>): Record<string, unknown> {
  return {
    event_name: value.eventName,
    banner: value.banner,
    start_event_date: value.startEventDate,
    finish_event_date: value.finishEventDate,
    edition: value.edition,
    organizer: value.organizer,
    description: value.description,
    location: value.location,
    invitations: value.invitations,
    organization_mode: value.organizationMode,
    number_of_participants: value.numberOfParticipants,
    target_group: value.targetGroup,
    livestream: value.livestream,
    coordinator: value.coordinator,
    email: value.email,
    telephone: value.telephone,
    other_information: value.otherInformation,
    partner_ids: value.partners,
    status: value.status ?? "draft",
  };
}

type EventCardEditorProps = {
  eventData: Partial<Form>;
  eventId?: string;
  onCancel: () => void;
};

const EventCardEditor = ({ eventData, eventId, onCancel }: EventCardEditorProps) => {
  const [formErrors, setFormErrors] = useState<string[] | null>(null);
  const updateEvent = eventId ? useUpdateEvent(eventId) : null;

  const form = useAppForm({
    defaultValues: eventData,
    validators: {
      onChange: formSchema,
    },
    onSubmit: async ({ value }) => {
      if (updateEvent) {
        try {
          const payload = formValuesToApiPayload(value as Record<string, unknown>);
          await updateEvent.mutateAsync(payload);
        } catch {
          setFormErrors(["A apărut o eroare la salvare. Încearcă din nou."]);
          return;
        }
      }
      onCancel();
    },
  });

  const actionButtonStyle =
    "w-full sm:w-auto px-8 py-3 bg-white border border-gray-200 rounded-2xl shadow-sm text-sm font-black text-primary transition-all duration-300 hover:bg-primary hover:text-white cursor-pointer active:scale-95 shrink-0 disabled:opacity-50 disabled:hover:bg-white disabled:hover:text-primary disabled:cursor-not-allowed";

  return (
    <div className="flex-1 mt-10 w-full flex justify-center">
      <div className="min-w-[40vw] max-w-3xl w-full flex flex-col items-center border border-gray-200 px-8 sm:px-16 py-10 shadow-xl rounded-2xl bg-white mb-10">
        <form
          className="w-full"
          onSubmit={(e) => {
            e.preventDefault();
            
            const currentValues = form.state.values;
            const validationResult = formSchema.safeParse(currentValues);

            if (!validationResult.success) {
              const zodIssues = validationResult.error.issues;
              const errorMessages = Array.from(new Set(zodIssues.map((err: any) => err.message as string)));
              
              setFormErrors(errorMessages);
              return;
            }
            
            setFormErrors(null);
            form.handleSubmit();
          }}
        >
          {formSteps.map((formStep, index) => (
            <div key={index} className="w-full mb-10">
              <div className="w-full flex flex-col items-center mb-8 mt-4">
                <h3 className="text-2xl font-bold text-gray-800 tracking-tight text-center">
                  {formStep.name}
                </h3>
                <div className="mt-2 h-1 w-16 bg-primary rounded-full"></div>
              </div>
              
              <div className="flex flex-col w-full gap-2">
                {formStep.elements.map((element) => {
                  return (
                    <form.AppField
                      name={element.name as any}
                      key={element.name}
                      children={(field) => {
                        if (element.type === "textInput") {
                          const { name, type, ...props } = element;
                          return <field.TextInput {...props} />;
                        } else if (element.type === "dateInput") {
                          const { name, type, ...props } = element;
                          return <field.DateInput {...props} />;
                        } else if (element.type === "dropdown") {
                          const { name, type, ...props } = element;
                          return <field.Dropdown {...props} />;
                        } else if (element.type === "radioGroup") {
                          const { name, type, ...props } = element;
                          return <field.RadioGroup {...props} />;
                        } else if (element.type === "arrayInput") {
                          const { name, type, ...props } = element;
                          return <field.ArrayInput {...props} />;
                        } else if (element.type === "numberInput") {
                          const { name, type, ...props } = element;
                          return <field.NumberInput {...props} />;
                        } else if (element.type === "textAreaInput") {
                          const { name, type, ...props } = element;
                          return <field.TextAreaInput {...props} />;
                        } else if (element.type === "multiCheckboxInput") {
                          const { name, type, ...props } = element;
                          return <field.MultiCheckboxInput {...props} />;
                        }
                        return null;
                      }}
                    />
                  );
                })}
              </div>
            </div>
          ))}

          {formErrors && (
            <div className="w-full mt-8 text-red-600 bg-red-50 border border-red-100 p-3 rounded-lg text-sm font-medium text-center">
              {formErrors.join("; ")}
            </div>
          )}

          <div className="flex flex-wrap justify-center gap-5 mt-10 items-center w-full pt-6 border-t border-gray-100">
            <button
              type="button"
              className={actionButtonStyle}
              onClick={() => onCancel()}
            >
              Înapoi
            </button>

            <button
              type="submit"
              className={actionButtonStyle}
              disabled={updateEvent?.isPending}
            >
              {updateEvent?.isPending ? "Se salvează..." : "Salvează"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EventCardEditor;
