import { useState } from "react";
import { useTranslation } from "react-i18next";

export default function EmailResult({ result }) {
  const [copied, setCopied] = useState(false);
  const { t, i18n } = useTranslation(); // Add i18n here

  const handleCopy = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <div className="relative bg-white/5 backdrop-blur-xl p-6 rounded-2xl border border-white/10 shadow-xl transition-all duration-300 hover:bg-white/10">
      <div className="absolute -z-10 inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-2xl blur-xl" />

      <h2 className="text-2xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
        {t("result.title")}
      </h2>

      <div className="space-y-4">
        <div className="bg-white/5 p-4 rounded-xl border border-white/5 hover:bg-white/10 transition-all duration-300">
          <div className="flex justify-between items-center mb-1">
            <p className="text-sm text-gray-400">
              {t("result.classification")}
            </p>
            <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-500/20 text-blue-400">
              {result.classificacao}
            </span>
          </div>
          <p className="text-lg font-semibold text-white">
            {result.classificacao}
          </p>
        </div>

        <div className="relative group bg-white/5 p-4 rounded-xl border border-white/5 hover:bg-white/10 transition-all duration-300">
          <div className="flex justify-between items-center mb-1">
            <p className="text-sm text-gray-400">{t("result.suggestion")}</p>
            <button
              onClick={() => handleCopy(result.texto)}
              className="opacity-0 group-hover:opacity-100 transition-opacity px-3 py-1 rounded-lg text-xs font-medium bg-purple-500/20 text-purple-400 hover:bg-purple-500/30"
            >
              {copied ? t("result.copied") : t("result.copy")}
            </button>
          </div>
          <p className="text-lg text-white/90 leading-relaxed whitespace-pre-wrap">
            {result.texto}
          </p>
        </div>
      </div>

      <div className="mt-6 pt-4 border-t border-white/10">
        <div className="flex items-center justify-between text-sm text-gray-400">
          <span>
            {t("result.processedAt")}{" "}
            {new Date().toLocaleString(
              i18n.language === "pt" ? "pt-BR" : "en-US"
            )}
          </span>
          <span className="px-2 py-1 rounded-lg bg-green-500/20 text-green-400">
            ✓
          </span>
        </div>
      </div>
    </div>
  );
}
