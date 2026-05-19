import { createFileRoute } from "@tanstack/react-router";
import { useAppForm } from "../components/form";
import {
  defaultFormValues,
  formSchema,
  formSteps,
} from "../config/creare-eveniment";
import { Activity, useState } from "react";
export const Route = createFileRoute("/creare-eveniment")({
  component: RouteComponent,
});

function RouteComponent() {
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [formErrors, setFormErrors] = useState<string[] | null>(null);

  const form = useAppForm({
    defaultValues: defaultFormValues,
    validators: {
      onChange: formSchema,
    },
    onSubmit: ({ value }) => {
      console.log("Formular salvat cu succes!");
      console.log(value);
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
                <h3 className="font-[Sans-Source-Now] text-xl font-bold mb-2 text-center w-full text-gray-800">
                  {formStep.name}
                </h3>

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

          {formErrors && (
            <div className="w-[90%] max-w-md mx-auto text-red-600 bg-red-50 border border-red-100 p-2 rounded-lg mb-2 text-sm font-medium text-center">
              {formErrors.join("; ")}
            </div>
          )}

          <div className="flex flex-wrap justify-center gap-4 mt-auto pt-4  w-full">
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
                if (!form.state.isTouched) return;

                const errors = form.state.errors;

                if (errors.length > 0) {
                  for (const [key] of Object.entries(errors[0] ?? {})) {
                    if (
                      formSteps[currentStep].elements.some(
                        (element) => element.name === key,
                      )
                    ) {
                      return;
                    }
                  }

                  let ok = false;
                  for (const [key, value] of Object.entries(errors[0] ?? {})) {
                    if (key.startsWith(`step${currentStep + 1} |`)) {
                      if (formErrors === null) {
                        setFormErrors([(value as any)[0].message]);
                      } else {
                        setFormErrors((prev) => [
                          ...(prev || []),
                          (value as any)[0].message,
                        ]);
                      }
                      ok = true;
                    }
                  }
                  if (ok === true) return;
                }

                setFormErrors(null);
                setCurrentStep((prev) => prev + 1);
              }}
              className={buttonStyle}
            >
              Continuă
            </button>

            <button
              type="submit"
              disabled={currentStep !== formSteps.length - 1}
              className={buttonStyle}
            >
              Salvează
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
