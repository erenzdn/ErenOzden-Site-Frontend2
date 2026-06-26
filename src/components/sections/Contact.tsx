"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import { useTranslations } from "next-intl";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Phone, Mail, CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import { Turnstile, type TurnstileInstance } from "@marsidev/react-turnstile";
import { CONTACT } from "@/lib/constants";
import { buildStrapiApiUrl } from "@/lib/apiClient";

gsap.registerPlugin(ScrollTrigger);

interface FormData {
  name: string;
  email: string;
  message: string;
}

type FormStatus = "idle" | "submitting" | "success" | "error";

// Production key - Cloudflare Dashboard'dan localhost domain'i eklemeyi unutmayın
// Test için: "1x00000000000000000000AA" (her zaman geçer)
const TURNSTILE_SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || "0x4AAAAAADlLsZkl_GOM_A2E";

export default function Contact() {
  const t = useTranslations("contact");
  const sectionRef = useRef<HTMLElement>(null);
  const turnstileRef = useRef<TurnstileInstance>(null);

  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    message: "",
  });

  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const [formStatus, setFormStatus] = useState<FormStatus>("idle");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [validationErrors, setValidationErrors] = useState<Partial<Record<keyof FormData | "turnstile", string>>>({});

  useEffect(() => {
    const refreshTimer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 150);

    const ctx = gsap.context(() => {
      gsap.from("[data-contact-animate]", {
        opacity: 0,
        y: 30, // 40'tan 30'a düşürüldü
        duration: 0.5, // 0.7'den 0.5'e düşürüldü
        stagger: 0.08, // 0.1'den 0.08'e düşürüldü
        ease: "power2.out", // power3'ten power2'ye değiştirildi
        clearProps: "all",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 90%",
          toggleActions: "play none none reverse",
          fastScrollEnd: true,
          preventOverlaps: true,
        },
      });
    }, sectionRef);
    
    return () => {
      clearTimeout(refreshTimer);
      ctx.revert();
    };
  }, []);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target;
      setFormData((prev) => ({ ...prev, [name]: value }));
      if (validationErrors[name as keyof FormData]) {
        setValidationErrors((prev) => ({ ...prev, [name]: undefined }));
      }
    },
    [validationErrors]
  );

  const handleTurnstileSuccess = useCallback((token: string) => {
    setTurnstileToken(token);
    setValidationErrors((prev) => ({ ...prev, turnstile: undefined }));
  }, []);

  const handleTurnstileError = useCallback(() => {
    setTurnstileToken(null);
  }, []);

  const handleTurnstileExpire = useCallback(() => {
    setTurnstileToken(null);
  }, []);

  const validateForm = (): boolean => {
    const errors: Partial<Record<keyof FormData | "turnstile", string>> = {};

    if (!formData.name.trim() || formData.name.trim().length < 2) {
      errors.name = t("validation.nameRequired");
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim() || !emailRegex.test(formData.email)) {
      errors.email = t("validation.emailInvalid");
    }

    if (!formData.message.trim() || formData.message.trim().length < 20) {
      errors.message = t("validation.messageMin");
    }

    if (!turnstileToken) {
      errors.turnstile = t("validation.turnstileRequired");
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const resetForm = () => {
    setFormData({ name: "", email: "", message: "" });
    setTurnstileToken(null);
    setValidationErrors({});
    turnstileRef.current?.reset();
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setFormStatus("submitting");
    setErrorMessage("");

    try {
      const payload = {
        data: {
          name: formData.name.trim(),
          email: formData.email.trim(),
          message: formData.message.trim(),
          cfTurnstileToken: turnstileToken,
        },
      };

      const response = await fetch(buildStrapiApiUrl("/api/messages"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.error?.message || `HTTP ${response.status}`);
      }

      setFormStatus("success");
      resetForm();
    } catch (error) {
      setFormStatus("error");
      setErrorMessage(error instanceof Error ? error.message : t("error.message"));
      turnstileRef.current?.reset();
      setTurnstileToken(null);
    }
  };

  const handleSendAnother = () => {
    setFormStatus("idle");
    resetForm();
  };

  if (formStatus === "success") {
    return (
      <section
        ref={sectionRef}
        id="contact"
        className="section-padding relative overflow-hidden w-full flex flex-col items-center"
      >
        <div className="container mx-auto px-4 sm:px-6 md:px-8 lg:px-10 max-w-[1200px] w-full relative z-10">
          <div className="max-w-xl mx-auto text-center">
            <div className="card p-6 sm:p-8 md:p-10 lg:p-12">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center mx-auto mb-5 sm:mb-6">
                <CheckCircle size={32} className="text-green-500 sm:w-10 sm:h-10" />
              </div>
              <h3 className="text-xl sm:text-2xl md:text-3xl font-heading font-bold text-white mb-3 sm:mb-4 px-4">
                {t("success.title")}
              </h3>
              <p className="text-gray-text text-sm sm:text-base mb-6 sm:mb-8 px-4">{t("success.message")}</p>
              <button
                onClick={handleSendAnother}
                className="px-6 sm:px-8 py-3 sm:py-3.5 bg-primary text-dark text-sm sm:text-base font-medium rounded-xl hover:bg-primary-dark transition-all duration-300 shadow-lg shadow-primary/20 hover:shadow-primary/40 cursor-pointer"
              >
                {t("success.another")}
              </button>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      ref={sectionRef}
      id="contact"
      className="section-padding relative overflow-hidden w-full flex flex-col items-center"
    >
      <div className="container mx-auto px-4 sm:px-6 md:px-8 lg:px-10 max-w-[1200px] w-full relative z-10">
        <div className="text-center mb-12 sm:mb-14 md:mb-16" data-contact-animate>
          <span className="badge badge-primary mb-4 sm:mb-5 inline-flex">{t("badge")}</span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-heading font-bold text-white mb-4 sm:mb-5 leading-tight px-4">
            {t("title")}
          </h2>
          <p className="text-gray-text text-sm sm:text-base max-w-xl mx-auto px-4">{t("description")}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 md:gap-10 lg:gap-12 xl:gap-16">
          <div className="lg:col-span-5 space-y-4 sm:space-y-5">
            <div data-contact-animate className="card card-glow p-6 sm:p-7 md:p-8 flex flex-col gap-3 sm:gap-4">
              <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                <Mail size={20} className="text-primary sm:w-[22px] sm:h-[22px]" />
              </div>
              <div>
                <p className="text-gray-text text-xs sm:text-sm mb-1">{t("info.email")}</p>
                <a
                  href={`mailto:${CONTACT.email}`}
                  className="text-white text-base sm:text-lg font-heading font-semibold hover:text-primary transition-colors break-all"
                >
                  {CONTACT.email}
                </a>
              </div>
            </div>

            <div data-contact-animate className="card card-glow p-6 sm:p-7 md:p-8 flex flex-col gap-3 sm:gap-4">
              <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                <Phone size={20} className="text-primary sm:w-[22px] sm:h-[22px]" />
              </div>
              <div>
                <p className="text-gray-text text-xs sm:text-sm mb-1">{t("info.phone")}</p>
                <a
                  href={`tel:${CONTACT.phone.replace(/\s+/g, "")}`}
                  className="text-white text-base sm:text-lg font-heading font-semibold hover:text-primary transition-colors"
                >
                  {CONTACT.phone}
                </a>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7">
            <form
              data-contact-animate
              className="card p-6 sm:p-7 md:p-8 lg:p-10"
              onSubmit={handleSubmit}
              noValidate
            >
              {formStatus === "error" && (
                <div className="mb-5 sm:mb-6 p-3 sm:p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-start gap-2 sm:gap-3">
                  <AlertCircle size={18} className="text-red-500 shrink-0 mt-0.5 sm:w-5 sm:h-5" />
                  <div>
                    <p className="text-red-400 font-medium text-xs sm:text-sm">{t("error.title")}</p>
                    <p className="text-red-400/80 text-xs sm:text-sm mt-1">{errorMessage}</p>
                  </div>
                </div>
              )}

              <div className="space-y-1.5 sm:space-y-2 mb-4 sm:mb-5">
                <label htmlFor="name" className="text-white text-xs sm:text-sm font-medium ml-1">
                  {t("form.name")}
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder={t("form.namePlaceholder")}
                  className={`w-full px-4 sm:px-5 py-3 sm:py-3.5 bg-dark border rounded-xl text-white text-xs sm:text-sm placeholder:text-gray focus:outline-none transition-colors ${
                    validationErrors.name
                      ? "border-red-500/50 focus:border-red-500"
                      : "border-dark-border focus:border-primary/50"
                  }`}
                  disabled={formStatus === "submitting"}
                />
                {validationErrors.name && (
                  <p className="text-red-400 text-xs ml-1 mt-1">{validationErrors.name}</p>
                )}
              </div>

              <div className="space-y-1.5 sm:space-y-2 mb-4 sm:mb-5">
                <label htmlFor="email" className="text-white text-xs sm:text-sm font-medium ml-1">
                  {t("form.email")}
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder={t("form.emailPlaceholder")}
                  className={`w-full px-4 sm:px-5 py-3 sm:py-3.5 bg-dark border rounded-xl text-white text-xs sm:text-sm placeholder:text-gray focus:outline-none transition-colors ${
                    validationErrors.email
                      ? "border-red-500/50 focus:border-red-500"
                      : "border-dark-border focus:border-primary/50"
                  }`}
                  disabled={formStatus === "submitting"}
                />
                {validationErrors.email && (
                  <p className="text-red-400 text-xs ml-1 mt-1">{validationErrors.email}</p>
                )}
              </div>

              <div className="space-y-1.5 sm:space-y-2 mb-5 sm:mb-6">
                <label htmlFor="message" className="text-white text-xs sm:text-sm font-medium ml-1">
                  {t("form.message")}
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={5}
                  value={formData.message}
                  onChange={handleInputChange}
                  placeholder={t("form.messagePlaceholder")}
                  className={`w-full px-4 sm:px-5 py-3 sm:py-3.5 bg-dark border rounded-xl text-white text-xs sm:text-sm placeholder:text-gray focus:outline-none transition-colors resize-none ${
                    validationErrors.message
                      ? "border-red-500/50 focus:border-red-500"
                      : "border-dark-border focus:border-primary/50"
                  }`}
                  disabled={formStatus === "submitting"}
                />
                {validationErrors.message && (
                  <p className="text-red-400 text-xs ml-1 mt-1">{validationErrors.message}</p>
                )}
              </div>

              <div className="flex flex-col items-center mb-5 sm:mb-6">
                <div className="scale-[0.85] sm:scale-100 origin-center">
                  <Turnstile
                    ref={turnstileRef}
                    siteKey={TURNSTILE_SITE_KEY}
                    onSuccess={handleTurnstileSuccess}
                    onError={handleTurnstileError}
                    onExpire={handleTurnstileExpire}
                    options={{
                      theme: "dark",
                      size: "normal",
                    }}
                  />
                </div>
                {validationErrors.turnstile && (
                  <p className="text-red-400 text-xs mt-2">{validationErrors.turnstile}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={formStatus === "submitting"}
                className="w-full py-3.5 sm:py-4 bg-primary text-dark text-sm sm:text-base font-medium rounded-xl hover:bg-primary-dark transition-all duration-300 shadow-lg shadow-primary/20 hover:shadow-primary/40 cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:bg-primary flex items-center justify-center gap-2"
              >
                {formStatus === "submitting" ? (
                  <>
                    <Loader2 size={20} className="animate-spin" />
                    {t("form.submitting")}
                  </>
                ) : (
                  t("form.submit")
                )}
              </button>

              <p className="text-gray-text/60 text-[10px] sm:text-xs text-center mt-3 sm:mt-4 px-2">
                {t("form.privacyNote")}
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
