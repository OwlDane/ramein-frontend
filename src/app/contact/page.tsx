"use client";

import { PageLayout } from "@/components/common/PageLayout";
import { ContactSection } from "@/components/common/ContactSection";

export default function ContactPage() {
  return (
    <PageLayout currentView="contact">
      <ContactSection />
    </PageLayout>
  );
}
