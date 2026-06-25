"use client";

import React, { useState, useEffect } from "react";
import { apiClient, resolveStrapiUrl, normalizeStrapiData } from "@/lib/apiClient";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Globe, Image as ImageIcon, CheckCircle2, AlertCircle, RefreshCw, Layers } from "lucide-react";

export default function StrapiTestPage() {
  const [mounted, setMounted] = useState(false);

  // Content states
  const [contentCollection, setContentCollection] = useState("services");
  const [contentData, setContentData] = useState<any>(null);
  const [contentLoading, setContentLoading] = useState(false);
  const [contentError, setContentError] = useState<string | null>(null);

  // Media resolver test state
  const [testUrl, setTestUrl] = useState("/uploads/image_placeholder_1ab2c3.png");

  // Mount logic
  useEffect(() => {
    setMounted(true);
  }, []);

  // Fetch Content Example
  const handleFetchContent = async () => {
    setContentLoading(true);
    setContentError(null);
    setContentData(null);

    try {
      // apiClient.get calls local Next.js proxy rewrite -> /api/<collection>
      const res = await apiClient.get(`/api/${contentCollection}`, {
        params: { populate: "*" }
      });
      
      // Strapi data normalization helper
      const normalized = normalizeStrapiData(res);
      setContentData({
        original: res,
        normalized: normalized,
      });
    } catch (err: any) {
      setContentError(err.message || "İçerik çekilirken hata oluştu.");
    } finally {
      setContentLoading(false);
    }
  };

  if (!mounted) {
    return (
      <div className="min-h-screen bg-dark flex items-center justify-center">
        <RefreshCw className="animate-spin text-white" size={32} />
      </div>
    );
  }

  return (
    <>
      <Header />
      <main className="pt-28 pb-16 min-h-screen bg-dark text-white font-sans">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
          
          {/* Hero Section */}
          <div className="mb-12 text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/10 text-gray-text rounded-full text-xs font-semibold mb-3">
              <CheckCircle2 size={12} className="text-green-400" /> Sadece Public İçerik (Login / JWT Yok)
            </div>
            <h1 className="text-4xl md:text-5xl font-heading font-bold bg-clip-text text-transparent bg-gradient-to-r from-white via-gray-300 to-gray-500 mb-4">
              Strapi v5 Entegrasyon Paneli
            </h1>
            <p className="text-gray-text max-w-2xl leading-relaxed">
              API istemcisi (fetch), medya URL çözümleme ve veri normalleştirme özelliklerini test etmek ve doğrulamak amacıyla hazırlanan genel (public) test paneli.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* SOL KOLON - Medya ve Kısa Notlar */}
            <div className="lg:col-span-5 space-y-8">
              
              {/* URL Çözümleyici Yardımcı Alanı */}
              <div className="card p-6 border border-dark-border bg-white/[0.02] backdrop-blur-md rounded-2xl">
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <ImageIcon size={18} className="text-gray-400" />
                  Medya URL Çözümleyici
                </h2>
                <div className="space-y-4">
                  <p className="text-sm text-gray-text">
                    Strapi medyasından dönen dosya yollarını tam URL&apos;e dönüştürmek için <code className="text-white bg-dark-lighter px-1.5 py-0.5 rounded text-xs">resolveStrapiUrl(url)</code> yardımcısını kullanabilirsiniz:
                  </p>

                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-gray-text block">Test Etmek İstediğiniz Görsel Yolu</label>
                    <input
                      type="text"
                      value={testUrl}
                      onChange={(e) => setTestUrl(e.target.value)}
                      className="w-full py-2 px-3 bg-dark-lighter border border-dark-border text-xs rounded-lg focus:outline-none focus:border-white text-white font-mono"
                    />
                  </div>

                  <div className="space-y-1.5 p-3 bg-dark-lighter border border-dark-border rounded-xl">
                    <span className="text-[10px] font-semibold text-amber-400 block font-mono">ÇÖZÜMLENEN ADRES (FULL URL):</span>
                    <span className="text-xs text-white font-mono break-all">{resolveStrapiUrl(testUrl)}</span>
                  </div>
                </div>
              </div>

              {/* Strapi Yetkilendirme Hatırlatması */}
              <div className="card p-6 border border-dark-border bg-white/[0.02] backdrop-blur-md rounded-2xl">
                <h2 className="text-xl font-bold mb-3 flex items-center gap-2">
                  <Layers size={18} className="text-gray-400" />
                  Strapi Erişim İzni Notu
                </h2>
                <p className="text-gray-text text-xs leading-relaxed mb-3">
                  Koleksiyonları üye girişi yapmadan okuyabilmek için Strapi yönetim panelinde aşağıdaki izinlerin verilmiş olması gerekir:
                </p>
                <div className="p-3 bg-dark-lighter border border-dark-border rounded-xl font-mono text-[11px] text-gray-300 space-y-1.5">
                  <p className="text-white font-semibold">İzlenecek Yol:</p>
                  <p>1. Settings ➡️ Users & Permissions ➡️ Roles</p>
                  <p>2. <span className="text-amber-400">Public</span> rolünü seçin</p>
                  <p>3. Koleksiyonları bulun (örn: Services)</p>
                  <p>4. <span className="text-green-400">find</span> ve <span className="text-green-400">findOne</span> kutularını işaretleyin</p>
                  <p>5. Save butonuna tıklayın</p>
                </div>
              </div>

            </div>

            {/* SAĞ KOLON - İçerik Çekme & JSON Çıktısı */}
            <div className="lg:col-span-7 space-y-8">
              
              {/* API İstek Kartı */}
              <div className="card p-6 border border-dark-border bg-white/[0.02] backdrop-blur-md rounded-2xl">
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <Globe size={18} className="text-gray-400" />
                  Örnek İçerik Çekme (Content-Type)
                </h2>

                <div className="flex gap-3 mb-6">
                  <div className="flex-1">
                    <input
                      type="text"
                      value={contentCollection}
                      onChange={(e) => setContentCollection(e.target.value)}
                      placeholder="Koleksiyon adı (örn: services, portfolios, posts)"
                      className="w-full py-2.5 px-4 bg-dark-lighter border border-dark-border focus:border-white text-sm rounded-xl focus:outline-none transition text-white font-mono"
                    />
                  </div>
                  <button
                    onClick={handleFetchContent}
                    disabled={contentLoading}
                    className="py-2.5 px-6 bg-white/10 hover:bg-white/20 border border-white/20 text-sm font-semibold rounded-xl flex items-center gap-2 transition disabled:opacity-50"
                  >
                    {contentLoading ? (
                      <RefreshCw className="animate-spin" size={16} />
                    ) : (
                      "İçeriği Getir"
                    )}
                  </button>
                </div>

                {contentError && (
                  <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-xl flex items-center gap-2 mb-6">
                    <AlertCircle size={16} />
                    <span>{contentError}</span>
                  </div>
                )}

                {contentData ? (
                  <div className="space-y-6">
                    
                    {/* Normalized View */}
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <h3 className="text-sm font-semibold text-green-400 flex items-center gap-1.5">
                          <CheckCircle2 size={14} /> Normalize Edilmiş Düz Veri (id + attributes flatting)
                        </h3>
                      </div>
                      <div className="bg-dark-lighter border border-dark-border rounded-xl p-4 overflow-x-auto max-h-[250px] custom-scrollbar">
                        <pre className="text-xs text-gray-300 font-mono">
                          {JSON.stringify(contentData.normalized, null, 2)}
                        </pre>
                      </div>
                    </div>

                    {/* Raw API Response */}
                    <div>
                      <h3 className="text-sm font-semibold text-amber-400 mb-2">
                        Orijinal Strapi REST API Yanıtı (Raw)
                      </h3>
                      <div className="bg-dark-lighter border border-dark-border rounded-xl p-4 overflow-x-auto max-h-[250px] custom-scrollbar">
                        <pre className="text-xs text-gray-300 font-mono">
                          {JSON.stringify(contentData.original, null, 2)}
                        </pre>
                      </div>
                    </div>

                  </div>
                ) : (
                  <div className="text-center py-12 bg-white/[0.01] border border-dashed border-dark-border rounded-xl">
                    <Globe size={32} className="mx-auto text-gray-500 mb-3 animate-pulse" />
                    <p className="text-sm text-gray-text">
                      Henüz bir istek atılmadı. Yukarıdaki kutucuğa bir koleksiyon ismi yazıp (örneğin <code className="text-white font-mono bg-dark-lighter px-1 py-0.5 rounded">services</code>) &quot;İçeriği Getir&quot; butonuna basabilirsiniz.
                    </p>
                  </div>
                )}
              </div>

            </div>

          </div>

        </div>
      </main>
      <Footer />
    </>
  );
}
