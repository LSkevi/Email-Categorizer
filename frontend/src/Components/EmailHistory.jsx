import { useState, useCallback, useMemo, memo } from "react";
import { useTranslation } from "react-i18next";
import { isUnproductiveClassification } from "../utils/classificationTranslator";

// Memoized classification ball for performance
const ClassificationBall = memo(({ value }) => {
  const isUnproductive = isUnproductiveClassification(value);

  return (
    <div
      className={`w-4 h-4 rounded-full flex-shrink-0 ${
        isUnproductive ? "bg-red-400" : "bg-cyan-400"
      }`}
      title={isUnproductive ? "Unproductive" : "Productive"}
    />
  );
});

ClassificationBall.displayName = "ClassificationBall";

// Memoized history item for performance
const HistoryItem = memo(
  ({ item, index, onSelectEmail, onDeleteEmail, locale }) => {
    const { t } = useTranslation();

    const formattedDate = useMemo(
      () => new Date(item.timestamp).toLocaleString(locale),
      [item.timestamp, locale]
    );

    const handleSelect = useCallback(
      () => onSelectEmail(item),
      [item, onSelectEmail]
    );
    const handleDelete = useCallback(
      (e) => {
        e.stopPropagation();
        onDeleteEmail(index);
      },
      [index, onDeleteEmail]
    );

    return (
      <div className="border-t border-white/5 hover:bg-white/5 transition-colors group">
        <div className="flex items-start gap-3 p-2.5">
          <ClassificationBall value={item.classificacao} />
          
          <button onClick={handleSelect} className="flex-1 text-left min-w-0">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-white/40">
                {formattedDate}
              </span>
            </div>

            {/* Email content */}
            <p className="text-white/70 text-sm line-clamp-2 break-words leading-relaxed">
              {item.originalTexto || item.texto}
            </p>
          </button>

          <button
            onClick={handleDelete}
            className="flex-shrink-0 w-8 h-8 flex items-center justify-center
                     rounded-md bg-red-500/10 hover:bg-red-500/20 
                     text-red-400 hover:text-red-300 
                     transition-all duration-200 text-sm font-medium
                     opacity-70 group-hover:opacity-100
                     hover:scale-105"
            title={t("history.delete", "Delete")}
          >
            ✕
          </button>
        </div>
      </div>
    );
  }
);

HistoryItem.displayName = "HistoryItem";

export default function EmailHistory({
  history,
  onSelectEmail,
  onDeleteEmail,
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const { t, i18n } = useTranslation();

  const locale = useMemo(
    () => (i18n.language === "pt" ? "pt-BR" : "en-US"),
    [i18n.language]
  );

  const toggleExpanded = useCallback(() => {
    setIsExpanded((prev) => !prev);
  }, []);

  const emptyStateText = useMemo(() => t("history.empty"), [t]);
  const historyTitle = useMemo(() => t("history.title"), [t]);

  return (
    <div className="w-full h-full max-h-[600px] bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 overflow-hidden transition-all duration-300 flex flex-col">
      <button
        onClick={toggleExpanded}
        className="w-full px-4 py-3 flex items-center justify-between text-white/80 hover:bg-white/5 flex-shrink-0"
      >
        <span className="font-medium">{historyTitle}</span>
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
            <p className="p-4 text-white/60 text-center">{emptyStateText}</p>
          ) : (
            history.map((item, index) => (
              <HistoryItem
                key={index}
                item={item}
                index={index}
                onSelectEmail={onSelectEmail}
                onDeleteEmail={onDeleteEmail}
                locale={locale}
              />
            ))
          )}
        </div>
      )}
    </div>
  );
}
