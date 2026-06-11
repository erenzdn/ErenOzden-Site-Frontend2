"use client";

import React from "react";

interface SectionTitleProps {
  subtitle?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  light?: boolean;
}

export default function SectionTitle({
  subtitle,
  title,
  description,
  align = "left",
  light = false,
}: SectionTitleProps) {
  const alignClass = align === "center" ? "text-center mx-auto" : "text-left";

  return (
    <div className={`mb-14 max-w-2xl ${alignClass}`} data-animate="up">
      {subtitle && (
        <span className="badge badge-primary mb-5 inline-flex">
          {subtitle}
        </span>
      )}
      <h2
        className={`text-3xl md:text-4xl lg:text-[44px] font-heading font-bold leading-[1.15] mb-5 ${
          light ? "text-dark" : "text-white"
        }`}
      >
        {title}
      </h2>
      {description && (
        <p
          className={`text-[15px] md:text-base leading-relaxed ${
            light ? "text-gray" : "text-gray-text"
          }`}
        >
          {description}
        </p>
      )}
    </div>
  );
}
