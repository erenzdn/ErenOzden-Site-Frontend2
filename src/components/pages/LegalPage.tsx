"use client";

import React from "react";
import { useTranslations } from "next-intl";
import SectionTitle from "@/components/ui/SectionTitle";

type LegalPageProps = {
  namespace: "privacy" | "terms";
};

export default function LegalPage({ namespace }: LegalPageProps) {
  const t = useTranslations(namespace);
  const sections = t.raw("sections") as Array<{ title: string; content: string }>;

  return (
    <section className="py-16 md:py-24">
      <div className="max-w-[800px] mx-auto px-4 sm:px-6">
        <SectionTitle
          title={t("title")}
          description={t("lastUpdated")}
          align="left"
        />

        <div className="space-y-10">
          {sections.map((section) => (
            <article key={section.title}>
              <h3 className="text-xl font-heading font-semibold text-white mb-3">
                {section.title}
              </h3>
              <p className="text-gray-text text-[15px] leading-relaxed whitespace-pre-line">
                {section.content}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
