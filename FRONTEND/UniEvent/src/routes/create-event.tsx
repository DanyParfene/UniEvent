import { createFileRoute } from "@tanstack/react-router";
import { useAppForm } from "../components/form";
import {
  componentsMap,
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

  /* const currentFormStep = formSteps.find((_, index) => index == step); */

  const form = useAppForm({
    defaultValues: defaultFormValues,
    validators: {
      onChange: formSchema,
    },
    onSubmit: ({ value }) => {
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
          <Activity mode={currentStep == index ? "visible" : "hidden"}>
            <h3>{formStep.name}</h3>
            {formStep.elements.map((element, ind) => {
              return (
                <form.AppField
                  name={element.name}
                  key={ind}
                  children={(field) => {
                    const { name, ...props } = element;
                    const Component = componentsMap[element.type];
                    return <field.Component {...props} />;
                  }}
                />
              );
            })}
          </Activity>
        ))}
        {/* {currentFormStep?.elements.map((element) => {
          if (element.type == "textInput") {
            return (
              <form.AppField
                name={element.name}
                children={(field) => <field.TextInput {...element} />}
              />
            );
          }
        })} */}
      </form>
    </div>
  );
}
