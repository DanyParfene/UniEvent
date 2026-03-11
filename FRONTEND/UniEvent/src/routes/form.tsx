import { createFileRoute } from "@tanstack/react-router";
import { useAppForm } from "../components/form";
import z from "zod";

export const Route = createFileRoute("/form")({
  component: RouteComponent,
});

const formSchema = z.object({
  firstName: z.string().min(3),
  date: z.iso.date(),
});

type Form = z.infer<typeof formSchema>;

const defaultForm: Partial<Form> = {
  firstName: "",
  date: new Date().toLocaleDateString("ro-RO"),
};

function RouteComponent() {
  console.log(defaultForm.date);
  const form = useAppForm({
    defaultValues: defaultForm,
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
        <form.AppField
          name="firstName"
          children={(field) => (
            <field.TextInput name="firstName" label="First Name" />
          )}
        />
        <form.AppField
          name="date"
          children={(field) => <field.DateInput name="date" label="Date" />}
        />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}
