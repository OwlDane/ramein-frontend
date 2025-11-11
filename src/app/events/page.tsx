"use client";

import { useRouter } from "next/navigation";
import { PageLayout } from "@/components/common/PageLayout";
import { EventCatalog } from "@/components/event/EventCatalog";

export default function EventsPage() {
  const router = useRouter();

  const handleEventSelect = (eventId: string) => {
    router.push(`/events/${eventId}`);
  };

  return (
    <PageLayout currentView="events">
      <EventCatalog onEventSelect={handleEventSelect} />
    </PageLayout>
  );
}
