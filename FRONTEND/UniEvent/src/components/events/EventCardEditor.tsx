import { useAppForm } from "../form";
import {
  formSchema,
  formSteps,
  type Form,
} from "../../config/create-event";
import { useState } from "react";

type EventCardEditorProps = {
  eventData: Partial<Form>;
  onCancel: () => void;
};

const EventCardEditor = ({ eventData, onCancel }: EventCardEditorProps) => {
  const [formErrors, setFormErrors] = useState<string[] | null>(null);

  const form = useAppForm({
    defaultValues: eventData,
    validators: {
      onChange: formSchema,
    },
    onSubmit: ({ value }) => {
      console.log("Datele salvate sunt:", value);
      
      // TO DO

      onCancel(); 
    },
  });

  const actionButtonStyle = "w-full sm:w-auto px-8 py-3 bg-white border border-gray-200 rounded-2xl shadow-sm text-sm font-black text-primary transition-all duration-300 hover:bg-primary hover:text-white cursor-pointer active:scale-95 shrink-0 disabled:opacity-50 disabled:hover:bg-white disabled:hover:text-primary disabled:cursor-not-allowed";

  return (
    <div className="flex-1 mt-10 w-full flex justify-center">
      <div className="min-w-[40vw] max-w-3xl w-full flex flex-col items-center border border-gray-200 px-8 sm:px-16 py-10 shadow-xl rounded-2xl bg-white mb-10">
        <form
          className="w-full"
          onSubmit={(e) => {
            e.preventDefault();
            
            if (form.state.errors.length > 0) {
                const errorsList = form.state.errors.flatMap(err => 
                    Object.values(err).map((errObj: any) => errObj[0].message)
                );
                setFormErrors(errorsList);
                return;
            }
            
            setFormErrors(null);
            form.handleSubmit();
          }}
        >
          {formSteps.map((formStep, index) => (
            <div key={index} className="w-full mb-10">
              <h3 className="font-[Sans-Source-Now] text-2xl font-semibold mb-6 border-b border-gray-100 pb-2 text-gray-800">
                {formStep.name}
              </h3>
              
              <div className="flex flex-col w-full gap-2">
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
              </div>
            </div>
          ))}

          {formErrors && (
            <div className="w-full mt-4 text-red-600 bg-red-50 border border-red-100 p-4 rounded-lg text-sm font-medium text-center">
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
            >
              Salvează
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EventCardEditor;