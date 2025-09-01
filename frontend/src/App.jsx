import { useState, useEffect, useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";
import UploadForm from "./Components/UploadForm";
import EmailResult from "./Components/EmailResult";
import EmailHistory from "./Components/EmailHistory";
import Instructions from "./Components/Instructions";
import "./i18n";

// Constants
const STORAGE_KEY = "emailHistory";
const MAX_HISTORY_ITEMS = 50;

export default function App() {
  const [result, setResult] = useState(null);
  const [history, setHistory] = useState([]);
  const [showClearDialog, setShowClearDialog] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);
  const { t, i18n } = useTranslation();

  // Load history from localStorage on mount
  useEffect(() => {
    const savedHistory = localStorage.getItem(STORAGE_KEY);
    if (savedHistory) {
      try {
        setHistory(JSON.parse(savedHistory));
      } catch (error) {
        console.error("Failed to parse saved history:", error);
        localStorage.removeItem(STORAGE_KEY);
      }
    }
  }, []);

  // Custom result handler to update history
  const handleResult = useCallback((newResult) => {
    const resultWithTimestamp = {
      ...newResult,
      timestamp: new Date().toISOString(),
    };

    setHistory((prevHistory) => {
      const updatedHistory = [resultWithTimestamp, ...prevHistory].slice(
        0,
        MAX_HISTORY_ITEMS
      );
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedHistory));
      return updatedHistory;
    });

    setResult(resultWithTimestamp);
  }, []);

  const toggleLanguage = useCallback(() => {
    const newLang = i18n.language === "pt" ? "en" : "pt";
    i18n.changeLanguage(newLang);
  }, [i18n]);

  const openInstructions = useCallback(() => {
    setShowInstructions(true);
  }, []);

  const closeInstructions = useCallback(() => {
    setShowInstructions(false);
  }, []);

  const confirmClearHistory = useCallback(() => {
    setHistory([]);
    setResult(null);
    localStorage.removeItem(STORAGE_KEY);
    setShowClearDialog(false);
  }, []);

  const deleteHistoryItem = useCallback((index) => {
    setHistory((prevHistory) => {
      const updatedHistory = prevHistory.filter((_, i) => i !== index);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedHistory));
      return updatedHistory;
    });
  }, []);

  // Memoize expensive computations
  const hasHistory = useMemo(() => history.length > 0, [history.length]);

  return (
    <div className="min-h-screen bg-[#0F172A] bg-gradient-to-b from-[#0F172A] via-[#0B1221] to-[#0F172A] py-3 px-2 sm:py-6 sm:px-3">
      <div className="relative w-full max-w-6xl mx-auto">
        {/* Decorative elements */}
        <div className="absolute -z-10 blur-[50px] bg-gradient-to-r from-[#38BDF8]/25 to-[#38BDF8]/10 w-full h-full" />

        {/* Main content */}
        <div className="relative bg-white/10 backdrop-blur-2xl rounded-xl sm:rounded-2xl p-3 sm:p-4 border border-white/10 shadow-xl">
          {/* Header buttons */}
          <div className="absolute top-3 right-3 sm:top-4 sm:right-4 flex items-center gap-1.5 sm:gap-2">
            {/* Instructions button */}
            <button
              onClick={openInstructions}
              className="px-2.5 py-1.5 sm:px-3 rounded-lg 
                       bg-white/5 hover:bg-white/10 transition-all
                       text-white/80 hover:text-white text-sm font-medium
                       touch-manipulation"
              title="Instructions"
            >
              ?
            </button>

            {/* Language switch button */}
            <button
              onClick={toggleLanguage}
              className="px-2.5 py-1.5 sm:px-3 rounded-lg 
                       bg-white/5 hover:bg-white/10 transition-all
                       text-white/80 text-sm font-medium
                       touch-manipulation"
            >
              {i18n.language === "pt" ? "EN" : "PT"}
            </button>
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-semibold mb-2 sm:mb-3 pb-2 text-center bg-clip-text text-transparent bg-gradient-to-r from-[#38BDF8] to-[#7DD3FC] tracking-tight pr-20 sm:pr-0">
            {t("title")}
          </h1>

          <p className="text-center text-white/70 text-sm sm:text-base mb-4 sm:mb-6 max-w-2xl mx-auto leading-relaxed">
            {t("subtitle")}
          </p>

          {/* Mobile-first layout: stack on mobile, side-by-side on lg+ */}
          <div className="flex flex-col lg:grid lg:grid-cols-3 gap-3 sm:gap-4">
            <div className="lg:col-span-2 flex flex-col gap-3 sm:gap-4">
              <div className="w-full bg-white/5 hover:bg-white/10 transition-all duration-300 rounded-xl p-3 sm:p-4 backdrop-blur-md shadow-lg border border-white/5">
                <UploadForm setResult={handleResult} />
              </div>

              {result && (
                <div className="w-full animate-fadeIn">
                  <EmailResult result={result} />
                </div>
              )}
            </div>

            <aside className="w-full lg:sticky lg:top-4 self-start order-first lg:order-last">
              <div className="flex justify-end mb-2">
                <button
                  onClick={() => setShowClearDialog(true)}
                  disabled={!hasHistory}
                  className="px-2.5 py-1.5 sm:px-3 rounded-md text-xs font-medium border border-white/10 text-white/80 bg-white/5 hover:bg-white/10 transition disabled:opacity-50 disabled:cursor-not-allowed touch-manipulation"
                  title={t("history.clear", "Clear history")}
                >
                  {t("history.clear", "Clear history")}
                </button>
              </div>
              <EmailHistory
                history={history}
                onSelectEmail={(item) => setResult(item)}
                onDeleteEmail={deleteHistoryItem}
              />
            </aside>

            {/* Clear history modal */}
            {showClearDialog && (
              <div className="fixed inset-0 z-50 flex items-start sm:items-center justify-center p-4 pt-20 sm:pt-4">
                <div
                  className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                  onClick={() => setShowClearDialog(false)}
                />
                <div
                  role="dialog"
                  aria-modal="true"
                  className="relative z-10 w-full max-w-sm bg-[#0F172A] text-white border border-white/10 rounded-xl p-5 shadow-2xl touch-manipulation"
                >
                  <h3 className="text-lg font-semibold mb-2">
                    {t("history.clearTitle", "Clear history?")}
                  </h3>
                  <p className="text-sm text-white/70 mb-4">
                    {t(
                      "history.clearMessage",
                      "This will remove all saved classifications. This cannot be undone."
                    )}
                  </p>
                  <div className="flex justify-end gap-3">
                    <button
                      onClick={() => setShowClearDialog(false)}
                      className="px-4 py-2.5 rounded-md text-sm bg-white/10 hover:bg-white/15 text-white/90 touch-manipulation min-h-[44px]"
                    >
                      {t("common.cancel", "Cancel")}
                    </button>
                    <button
                      onClick={confirmClearHistory}
                      className="px-4 py-2.5 rounded-md text-sm bg-red-500/80 hover:bg-red-500 text-white touch-manipulation min-h-[44px]"
                    >
                      {t("history.clear", "Clear history")}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Instructions modal */}
            <Instructions
              isOpen={showInstructions}
              onClose={closeInstructions}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
