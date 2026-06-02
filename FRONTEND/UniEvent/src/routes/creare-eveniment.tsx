import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { requireAuth } from "../lib/require-auth";
import { useAppForm } from "../components/form";
import {
  defaultFormValues,
  formSchema,
  formSteps,
} from "../config/creare-eveniment";
import { Activity } from "react";
import { useState } from "react";
import { useCreateEvent } from "../api/events";

export const Route = createFileRoute("/creare-eveniment")({
  beforeLoad: () => requireAuth(),
  component: RouteComponent,
});

function RouteComponent() {
  const [currentStep, setCurrentStep] = useState<number>(0);
  const createEvent = useCreateEvent();
  const navigate = useNavigate();

  const form = useAppForm({
    defaultValues: defaultFormValues,
    validators: {
      onChange: formSchema,
    },
    onSubmit: async ({ value }) => {
      try {
        const payload: Record<string, unknown> = {
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
          status: "draft",
        };
        await createEvent.mutateAsync(payload);
        navigate({ to: "/evenimente", search: { page: 1 } });
      } catch {
        // handled by createEvent.isError
      }
    },
  });

  const buttonStyle =
    "w-full sm:w-auto px-8 py-2.5 bg-white border border-gray-200 rounded-2xl shadow-sm text-sm font-black text-primary transition-all duration-300 hover:bg-primary hover:text-white disabled:opacity-50 disabled:hover:bg-white disabled:hover:text-primary disabled:cursor-not-allowed cursor-pointer active:scale-95 shrink-0";

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] px-4 w-full">
      <div className="w-full max-w-2xl bg-white border border-gray-200 px-6 py-6 sm:px-10 shadow-xl rounded-2xl flex flex-col min-h-120 h-fit">
        <form
          className="w-full flex flex-col flex-1 h-full"
          onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit();
          }}
        >
          {formSteps.map((formStep, index) => (
            <Activity
              mode={index === currentStep ? "visible" : "hidden"}
              key={index}
            >
              <div className="flex flex-col flex-1 h-full">
                <div className="w-full flex flex-col items-center mb-8">
                  <h3 className="text-3xl font-bold text-gray-800 tracking-tight text-center">
                    {formStep.name}
                  </h3>
                  <div className="mt-2 h-1 w-20 bg-primary rounded-full"></div>
                </div>

                <div className="flex flex-col w-[90%] max-w-md mx-auto my-auto">
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
            </Activity>
          ))}

          <div className="flex flex-wrap justify-center gap-4 mt-auto pt-4 w-full">
            <button
              type="button"
              disabled={currentStep < 1}
              onClick={() => setCurrentStep((prev) => prev - 1)}
              className={buttonStyle}
            >
              Înapoi
            </button>

            <button
              type="button"
              disabled={currentStep === formSteps.length - 1}
              onClick={() => {
                const currentFieldNames = formSteps[currentStep].elements.map(
                  (el) => el.name as string,
                );

                for (const name of currentFieldNames) {
                  const field = form.getFieldMeta(name as any);
                  if (!field?.isTouched) {
                    form.setFieldMeta(name as any, (prev) => ({
                      ...prev,
                      isTouched: true,
                    }));
                  }
                  form.validateField(name as any, "change");
                }

                const hasErrors = currentFieldNames.some((name) => {
                  const field = form.getFieldMeta(name as any);
                  return field && field.errors.length > 0;
                });

                if (!hasErrors) {
                  setCurrentStep((prev) => prev + 1);
                }
              }}
              className={buttonStyle}
            >
              Continuă
            </button>

            <button
              type="submit"
              disabled={currentStep !== formSteps.length - 1 || createEvent.isPending}
              className={buttonStyle}
            >
              {createEvent.isPending ? "Se salvează..." : "Salvează"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
