import { useState, useEffect, useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";
import UploadForm from "./Components/UploadForm";
import EmailResult from "./Components/EmailResult";
import EmailHistory from "./components/EmailHistory";
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
    <div className="fixed inset-0 bg-[#0F172A] bg-gradient-to-b from-[#0F172A] via-[#0B1221] to-[#0F172A] flex items-center justify-center p-3">
      <div className="relative w-full max-w-6xl">
        {/* Decorative elements */}
        <div className="absolute -z-10 blur-[50px] bg-gradient-to-r from-[#38BDF8]/25 to-[#38BDF8]/10 w-full h-full" />

        {/* Main content */}
        <div className="relative bg-white/10 backdrop-blur-2xl rounded-2xl p-4 border border-white/10 shadow-xl">
          {/* Header buttons */}
          <div className="absolute top-4 right-4 flex items-center gap-2">
            {/* Instructions button */}
            <button
              onClick={openInstructions}
              className="px-3 py-1.5 rounded-lg 
                       bg-white/5 hover:bg-white/10 transition-all
                       text-white/80 hover:text-white text-sm font-medium"
              title="Instructions"
            >
              ?
            </button>

            {/* Language switch button */}
            <button
              onClick={toggleLanguage}
              className="px-3 py-1.5 rounded-lg 
                       bg-white/5 hover:bg-white/10 transition-all
                       text-white/80 text-sm font-medium"
            >
              {i18n.language === "pt" ? "EN" : "PT"}
            </button>
          </div>

          <h1 className="text-4xl font-semibold mb-6 pb-2 text-center bg-clip-text text-transparent bg-gradient-to-r from-[#38BDF8] to-[#7DD3FC] tracking-tight">
            {t("title")}
          </h1>

          {/* Two-column layout: left (form + result), right (history) */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="lg:col-span-2 flex flex-col gap-4">
              <div className="w-full bg-white/5 hover:bg-white/10 transition-all duration-300 rounded-xl p-4 backdrop-blur-md shadow-lg border border-white/5">
                <UploadForm setResult={handleResult} />
              </div>

              {result && (
                <div className="w-full animate-fadeIn">
                  <EmailResult result={result} />
                </div>
              )}
            </div>

            <aside className="w-full lg:sticky lg:top-4 self-start">
              <div className="flex justify-end mb-2">
                <button
                  onClick={() => setShowClearDialog(true)}
                  disabled={!hasHistory}
                  className="px-3 py-1.5 rounded-md text-xs font-medium border border-white/10 text-white/80 bg-white/5 hover:bg-white/10 transition disabled:opacity-50 disabled:cursor-not-allowed"
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
              <div className="fixed inset-0 z-50 flex items-center justify-center">
                <div
                  className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                  onClick={() => setShowClearDialog(false)}
                />
                <div
                  role="dialog"
                  aria-modal="true"
                  className="relative z-10 w-full max-w-sm bg-[#0F172A] text-white border border-white/10 rounded-xl p-5 shadow-2xl"
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
                      className="px-3 py-1.5 rounded-md text-sm bg-white/10 hover:bg-white/15 text-white/90"
                    >
                      {t("common.cancel", "Cancel")}
                    </button>
                    <button
                      onClick={confirmClearHistory}
                      className="px-3 py-1.5 rounded-md text-sm bg-red-500/80 hover:bg-red-500 text-white"
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
