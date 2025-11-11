"use client";

import { PageLayout } from "@/components/common/PageLayout";
import { ArticlesSection } from "@/components/common/ArticlesSection";

export default function ArticlesPage() {
  return (
    <PageLayout currentView="articles">
      <ArticlesSection />
    </PageLayout>
  );
}
