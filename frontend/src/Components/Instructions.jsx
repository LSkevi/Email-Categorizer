import { useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";

export default function Instructions({ isOpen, onClose }) {
  const { t } = useTranslation();

  const handleBackdropClick = useCallback(
    (e) => {
      if (e.target === e.currentTarget) {
        onClose();
      }
    },
    [onClose]
  );

  const instructionsTitle = useMemo(() => t("instructions.title"), [t]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-16">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={handleBackdropClick}
      />
      <div
        role="dialog"
        aria-modal="true"
        className="relative z-10 w-full max-w-2xl max-h-[80vh] bg-[#0F172A]/95 backdrop-blur-xl text-white border border-white/20 rounded-2xl shadow-2xl overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <span className="text-2xl">ℹ️</span>
            <h2 className="text-xl font-semibold">{instructionsTitle}</h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center
                     rounded-full bg-white/10 hover:bg-white/20 
                     text-white/70 hover:text-white
                     transition-all duration-200 hover:scale-105"
            aria-label="Close instructions"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="p-4 overflow-y-auto max-h-[calc(80vh-120px)] space-y-4 text-sm scrollbar-thin">
          {/* Main Feature */}
          <div className="bg-white/5 rounded-lg p-3">
            <h4 className="font-medium text-[#38BDF8] mb-2 flex items-center gap-2">
              <span>🎯</span> {t("instructions.mainFeature")}
            </h4>
            <p className="text-white/70 leading-relaxed">
              {t("instructions.mainFeatureDesc")}
            </p>
          </div>

          {/* How to Use */}
          <div className="bg-white/5 rounded-lg p-3">
            <h4 className="font-medium text-[#38BDF8] mb-2 flex items-center gap-2">
              <span>📝</span> {t("instructions.howToUse")}
            </h4>
            <ul className="text-white/70 space-y-1.5">
              <li className="flex items-start gap-2">
                <span className="text-cyan-400 mt-0.5">•</span>
                <span>{t("instructions.step1")}</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-cyan-400 mt-0.5">•</span>
                <span>{t("instructions.step2")}</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-cyan-400 mt-0.5">•</span>
                <span>{t("instructions.step3")}</span>
              </li>
            </ul>
          </div>

          {/* Classifications */}
          <div className="bg-white/5 rounded-lg p-3">
            <h4 className="font-medium text-[#38BDF8] mb-2 flex items-center gap-2">
              <span>🏷️</span> {t("instructions.classifications")}
            </h4>
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 bg-cyan-400 rounded-full"></span>
                <span className="text-cyan-400 font-medium">
                  {t("classifications.productive")}
                </span>
                <span className="text-white/60">
                  - {t("instructions.productiveDesc")}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 bg-red-400 rounded-full"></span>
                <span className="text-red-400 font-medium">
                  {t("classifications.unproductive")}
                </span>
                <span className="text-white/60">
                  - {t("instructions.unproductiveDesc")}
                </span>
              </div>
            </div>
          </div>

          {/* Features */}
          <div className="bg-white/5 rounded-lg p-3">
            <h4 className="font-medium text-[#38BDF8] mb-2 flex items-center gap-2">
              <span>⚡</span> {t("instructions.features")}
            </h4>
            <ul className="text-white/70 space-y-1.5">
              <li className="flex items-start gap-2">
                <span className="text-purple-400 mt-0.5">✓</span>
                <span>{t("instructions.feature1")}</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-400 mt-0.5">✓</span>
                <span>{t("instructions.feature2")}</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-400 mt-0.5">✓</span>
                <span>{t("instructions.feature3")}</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-400 mt-0.5">✓</span>
                <span>{t("instructions.feature4")}</span>
              </li>
            </ul>
          </div>

          {/* Tip */}
          <div className="bg-gradient-to-r from-[#38BDF8]/10 to-purple-500/10 rounded-lg p-3 border border-[#38BDF8]/20">
            <h4 className="font-medium text-yellow-400 mb-1 flex items-center gap-2">
              <span>💡</span> {t("instructions.tip")}
            </h4>
            <p className="text-white/70 text-xs leading-relaxed">
              {t("instructions.tipDesc")}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
