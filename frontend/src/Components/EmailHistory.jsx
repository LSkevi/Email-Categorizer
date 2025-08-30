import { useState } from "react";
import { useTranslation } from "react-i18next";

export default function EmailHistory({
  history,
  onSelectEmail,
  onDeleteEmail,
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const { t, i18n } = useTranslation();

  const renderClassification = (value) => {
    const text = String(value ?? "");
    const pattern = /(improductive|improdutivo)/i;
    const parts = text.split(pattern);
    if (parts.length === 1) {
      return <span className="text-blue-400">{text}</span>;
    }
    return (
      <>
        {parts.map((part, idx) => {
          if (pattern.test(part)) {
            return (
              <span key={idx} className="text-red-400 font-semibold">
                {part}
              </span>
            );
          }
          return (
            <span key={idx} className="text-blue-400">
              {part}
            </span>
          );
        })}
      </>
    );
  };

  return (
    <div className="w-full h-full max-h-[600px] bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 overflow-hidden transition-all duration-300 flex flex-col">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-4 py-3 flex items-center justify-between text-white/80 hover:bg-white/5 flex-shrink-0"
      >
        <span className="font-medium">{t("history.title")}</span>
        <svg
          className={`w-5 h-5 transform transition-transform ${
            isExpanded ? "rotate-180" : ""
          }`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {isExpanded && (
        <div className="flex-1 overflow-y-auto">
          {history.length === 0 ? (
            <p className="p-4 text-white/60 text-center">
              {t("history.empty")}
            </p>
          ) : (
            history.map((item, index) => (
              <div
                key={index}
                className="border-t border-white/5 hover:bg-white/5 transition-colors"
              >
                <div className="flex">
                  <button
                    onClick={() => onSelectEmail(item)}
                    className="flex-1 p-4 text-left"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-sm font-medium">
                        {renderClassification(item.classificacao)}
                      </span>
                      <span className="text-xs text-white/40">
                        {new Date(item.timestamp).toLocaleString(
                          i18n.language === "pt" ? "pt-BR" : "en-US"
                        )}
                      </span>
                    </div>

                    {/* Original Email */}
                    <div className="mb-3">
                      <span className="text-xs font-medium text-[#38BDF8] mb-1 block">
                        {t("history.originalEmail", "Original Email")}:
                      </span>
                      <p className="text-white/70 text-sm line-clamp-2 bg-white/5 rounded-lg p-2">
                        {item.originalTexto || item.texto}
                      </p>
                    </div>

                    {/* Response Suggestion */}
                    {item.sugestao && (
                      <div>
                        <span className="text-xs font-medium text-[#38BDF8] mb-1 block">
                          {t(
                            "history.responseSuggestion",
                            "Response Suggestion"
                          )}
                          :
                        </span>
                        <p className="text-white/60 text-sm line-clamp-2 bg-white/5 rounded-lg p-2">
                          {item.sugestao}
                        </p>
                      </div>
                    )}
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteEmail(index);
                    }}
                    className="p-2 m-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 transition-colors text-xs"
                    title={t("history.delete", "Delete")}
                  >
                    ✕
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
