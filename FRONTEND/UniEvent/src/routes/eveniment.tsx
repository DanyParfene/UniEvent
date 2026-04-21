import { createFileRoute } from "@tanstack/react-router";
import EventCardMain from "../components/events/EventCardMain";
import { useState } from "react";
import EventCardEditor from "../components/events/EventCardEditor";
import type { Form } from "../config/create-event.ts";

export const Route = createFileRoute("/eveniment")({
  component: RouteComponent,
});

function RouteComponent() {
  const [isEditingData, setIsEditingData] = useState(false);
  const [isEditingSocial, setIsEditingSocial] = useState(false);
  const [data, setData] = useState<Form | null>(null);
  const setIsEditingDataTrue = () => {
    setIsEditingData(true);
  };

  const setIsEditingSocialMediaTrue = () => {
    setIsEditingSocial(true);
  };

  return (
    <div>
      {isEditingData ? (
        <EventCardEditor eventData={data} />
      ) : isEditingSocial ? (
        ""
      ) : (
        <EventCardMain
          eventData={data}
          editDataAction={setIsEditingDataTrue}
          editSocialMediaAction={setIsEditingSocialMediaTrue}
        />
      )}
    </div>
  );
}
