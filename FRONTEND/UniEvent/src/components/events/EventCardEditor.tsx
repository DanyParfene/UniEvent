import { useAppForm } from "../form";
import {
  formSchema,
  formSteps,
  type Form,
} from "../../config/creare-eveniment";
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
      
      // TO DO: Aici vei face request-ul PUT/PATCH către backend

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
            
            // 1. Validăm strict tot formularul folosind schema Zod
            const currentValues = form.state.values;
            const validationResult = formSchema.safeParse(currentValues);

            if (!validationResult.success) {
              // 2. Dacă sunt erori (ex: a șters un câmp obligatoriu), le extragem și le afișăm
              const zodIssues = validationResult.error.issues;
              // Folosim Set pentru a nu afișa aceeași eroare de 2 ori
              const errorMessages = Array.from(new Set(zodIssues.map((err: any) => err.message as string)));
              
              setFormErrors(errorMessages);
              return; // Blocăm trimiterea formularului!
            }
            
            // 3. Dacă totul e valid, ștergem erorile și facem submit
            setFormErrors(null);
            form.handleSubmit();
          }}
        >
          {formSteps.map((formStep, index) => (
            <div key={index} className="w-full mb-10">
              
              {/* Styling actualizat pentru titlu, identic cu cel din create-event */}
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
                        } 
                        // AM ADĂUGAT AICI MULTI-CHECKBOX-UL PENTRU PARTENERI:
                        else if (element.type === "multiCheckboxInput") {
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

          {/* Afișarea erorilor generale de submit */}
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

            <button type="submit" className={actionButtonStyle}>
              Salvează
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EventCardEditor;
