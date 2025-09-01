import { useState, useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";
import {
  translateClassification,
  isProductiveClassification,
} from "../utils/classificationTranslator";

export default function EmailResult({ result }) {
  const [copied, setCopied] = useState(false);
  const { t, i18n } = useTranslation();

  const handleCopy = useCallback(async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
      // Fallback for older browsers
      try {
        const textArea = document.createElement("textarea");
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand("copy");
        document.body.removeChild(textArea);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (fallbackErr) {
        console.error("Fallback copy failed:", fallbackErr);
      }
    }
  }, []);

  // Memoize the translated classification
  const translatedClassification = useMemo(
    () => translateClassification(result?.classificacao, t),
    [result?.classificacao, t]
  );

  // Memoize the formatted timestamp
  const formattedTimestamp = useMemo(() => {
    if (!result?.timestamp)
      return new Date().toLocaleString(
        i18n.language === "pt" ? "pt-BR" : "en-US"
      );

    return new Date(result.timestamp).toLocaleString(
      i18n.language === "pt" ? "pt-BR" : "en-US"
    );
  }, [result?.timestamp, i18n.language]);

  // Memoize classification styles
  const classificationStyles = useMemo(() => {
    const isProductive = isProductiveClassification(result?.classificacao);
    return {
      bgColor: isProductive ? "bg-cyan-500/20" : "bg-red-500/20",
      textColor: isProductive ? "text-cyan-400" : "text-red-400",
    };
  }, [result?.classificacao]);

  return (
    <div className="relative bg-white/5 backdrop-blur-xl p-6 rounded-2xl border border-white/10 shadow-xl transition-all duration-300 hover:bg-white/10">
      <div className="absolute -z-10 inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-2xl blur-xl" />

      <h2 className="text-2xl font-semibold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400 tracking-tight">
        {t("result.title")}
      </h2>

      <div className="space-y-4">
        {/* Original Email Section */}
        <div className="relative group bg-white/5 p-4 rounded-xl border border-white/5 hover:bg-white/10 transition-all duration-300">
          <div className="flex justify-between items-center mb-1">
            <p className="text-sm font-medium text-gray-400 uppercase tracking-wide">
              {t("result.originalEmail", "Original Email")}
            </p>
            <button
              onClick={() => handleCopy(result.originalTexto)}
              className="opacity-0 group-hover:opacity-100 transition-opacity px-3 py-1 rounded-lg text-xs font-semibold bg-blue-500/20 text-blue-400 hover:bg-blue-500/30"
            >
              {copied ? t("result.copied") : t("result.copy")}
            </button>
          </div>
          <div className="max-h-48 overflow-y-auto scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">
            <p className="text-base text-white/90 leading-relaxed whitespace-pre-wrap font-normal">
              {result.originalTexto}
            </p>
          </div>
        </div>

        <div className="bg-white/5 p-4 rounded-xl border border-white/5 hover:bg-white/10 transition-all duration-300">
          <div className="flex justify-between items-center mb-1">
            <p className="text-sm font-medium text-gray-400 uppercase tracking-wide">
              {t("result.classification")}
            </p>
            <span
              className={`px-3 py-1 rounded-full text-xs font-semibold ${classificationStyles.bgColor} ${classificationStyles.textColor}`}
            >
              {translatedClassification}
            </span>
          </div>
          <p className="text-xl font-semibold text-white tracking-tight">
            {translatedClassification}
          </p>
        </div>

        <div className="relative group bg-white/5 p-4 rounded-xl border border-white/5 hover:bg-white/10 transition-all duration-300">
          <div className="flex justify-between items-center mb-1">
            <p className="text-sm font-medium text-gray-400 uppercase tracking-wide">
              {t("result.suggestion")}
            </p>
            <button
              onClick={() => handleCopy(result.texto)}
              className="opacity-0 group-hover:opacity-100 transition-opacity px-3 py-1 rounded-lg text-xs font-semibold bg-purple-500/20 text-purple-400 hover:bg-purple-500/30"
            >
              {copied ? t("result.copied") : t("result.copy")}
            </button>
          </div>
          <div className="max-h-96 overflow-y-auto scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">
            <p className="text-base text-white/90 leading-relaxed whitespace-pre-wrap font-normal">
              {result.texto}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-6 pt-4 border-t border-white/10">
        <div className="flex items-center justify-between text-sm text-gray-400">
          <span>
            {t("result.processedAt")} {formattedTimestamp}
          </span>
          <span className="px-2 py-1 rounded-lg bg-green-500/20 text-green-400">
            ✓
          </span>
        </div>
      </div>
    </div>
  );
}
