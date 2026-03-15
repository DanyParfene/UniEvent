import { createFileRoute } from "@tanstack/react-router";
import { useAppForm } from "../components/form";
import {
  defaultFormValues,
  formSchema,
  formSteps,
} from "../config/create-event";
import { Activity, useState } from "react";

export const Route = createFileRoute("/create-event")({
  component: RouteComponent,
});

function RouteComponent() {
  const [currentStep, setCurrentStep] = useState<number>(0);

  const form = useAppForm({
    defaultValues: defaultFormValues,
    validators: {
      onChange: formSchema,
    },
    onSubmit: ({ value }) => {
      console.log("object");
      console.log(value);
    },
  });

  return (
    <div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          form.handleSubmit();
        }}
      >
        {formSteps.map((formStep, index) => (
          <Activity
            mode={index == currentStep ? "visible" : "hidden"}
            key={index}
          >
            <h3>{formStep.name}</h3>
            {formStep.elements.map((element) => {
              return (
                <form.AppField
                  name={element.name}
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
                  }}
                />
              );
            })}
          </Activity>
        ))}

        <button
          type="button"
          disabled={currentStep < 1}
          onClick={() => setCurrentStep((prev) => prev - 1)}
        >
          Previous
        </button>
        <button
          type="button"
          disabled={currentStep == formSteps.length - 1}
          onClick={() => {
            console.log(form.state);
            if (!form.state.isTouched) {
              return;
            }

            const errors = form.state.errors;
            console.log(errors);

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

              for (const [key] of Object.entries(errors[0] ?? {})) {
                if (key.startsWith(`step${currentStep + 1} |`)) {
                  return;
                }
              }
            }
            setCurrentStep((prev) => prev + 1);
          }}
        >
          Continue
        </button>

        <button
          type="submit"
          disabled={currentStep == formSteps.length - 1 ? false : true}
        >
          Save
        </button>
      </form>
    </div>
  );
}
