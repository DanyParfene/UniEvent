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
      console.log("object")
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
                    const { name, type, ...props } = element;

                    if (element.type === "textInput") {
                      return <field.TextInput {...props} />;
                    } else {
                      return <field.DateInput {...props} />;
                    }
                  }}
                />
              );
            })}
          </Activity>
        ))}
        <button
          disabled={currentStep < 1 ? true : false}
          onClick={() => setCurrentStep((prev) => prev - 1)}
        >
          Previous
        </button>
        <button
          disabled={currentStep == formSteps.length - 1 ? true : false}
          onClick={() => setCurrentStep((prev) => prev + 1)}
        >
          Continue
        </button>

        <button type="submit">Save</button>
      </form>
    </div>
  );
}
