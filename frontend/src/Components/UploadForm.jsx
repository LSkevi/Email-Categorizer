import { useState, useRef, useCallback } from "react";
import { useTranslation } from "react-i18next";

// Constants
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";
const ENDPOINTS = {
  file: "/upload",
  text: "/classificar",
};

export default function UploadForm({ setResult }) {
  const { t } = useTranslation();
  const [file, setFile] = useState(null);
  const [texto, setTexto] = useState("");
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileChange = useCallback((e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    setFile(selectedFile);
    setTexto(`📄 ${selectedFile.name}`);
  }, []);

  const handleSubmit = useCallback(
    async (e, type) => {
      e.preventDefault();
      if (loading) return;

      setLoading(true);

      try {
        const url = `${API_BASE_URL}${ENDPOINTS[type]}`;
        const isFileUpload = type === "file";

        const body = isFileUpload
          ? (() => {
              const formData = new FormData();
              formData.append("file", file);
              return formData;
            })()
          : JSON.stringify({ texto });

        const response = await fetch(url, {
          method: "POST",
          ...(type === "text" && {
            headers: { "Content-Type": "application/json" },
          }),
          body,
        });

        if (!response.ok) {
          if (response.status === 422) {
            // Handle validation errors specifically
            try {
              const errorData = await response.json();
              const validationErrors = errorData.detail;
              let errorMessage = "Validation error";

              if (
                Array.isArray(validationErrors) &&
                validationErrors.length > 0
              ) {
                // Extract the validation error message
                errorMessage =
                  validationErrors[0].msg ||
                  validationErrors[0].message ||
                  errorMessage;
              } else if (typeof validationErrors === "string") {
                errorMessage = validationErrors;
              }

              throw new Error(errorMessage);
            } catch {
              throw new Error(
                "Text validation failed. Please check your input length."
              );
            }
          }
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const result = await response.json();

        // Prepare result with original text and suggestions
        const enrichedResult = {
          ...result,
          originalTexto: isFileUpload ? file.name : texto,
          sugestao: result.texto,
        };

        setResult(enrichedResult);
      } catch (error) {
        console.error("Submit error:", error);
        setResult({
          classificacao: "Erro",
          texto: `Erro na análise: ${error.message}`,
          originalTexto: texto,
          sugestao: "Tente novamente mais tarde.",
        });
      } finally {
        setLoading(false);
      }
    },
    [loading, file, texto, setResult]
  );

  const handleRemoveFile = useCallback(() => {
    setFile(null);
    setTexto("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }, []);

  // Validation
  const isSubmitDisabled = loading || (!texto.trim() && !file);

  return (
    <div className="w-full space-y-4">
      <div className="relative">
        <textarea
          placeholder={file ? "" : t("textarea")}
          value={texto}
          onChange={(e) => (file ? null : setTexto(e.target.value))}
          disabled={loading || file}
          className={`w-full h-32 bg-white/5 backdrop-blur-sm rounded-xl p-3 
                   text-white placeholder-gray-400 resize-none outline-none
                   border border-white/10 focus:border-white/20 
                   focus:ring-2 focus:ring-[#38BDF8]/20 transition-all
                   ${file ? "cursor-not-allowed opacity-75" : ""}`}
        />
        {file && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg px-3 py-2 text-sm font-medium text-white/80 border border-white/20">
              {t("fileSelected", "Remove the file to change text")}
            </div>
          </div>
        )}
      </div>

      {/* Character counter */}
      {!file && (
        <div className="flex justify-end">
          <span
            className={`text-xs ${
              texto.length > 45000
                ? "text-red-400"
                : texto.length > 40000
                ? "text-yellow-400"
                : "text-gray-400"
            }`}
          >
            {texto.length.toLocaleString()} / 50,000 characters
          </span>
        </div>
      )}

      <div className="flex items-center gap-3">
        <div className="flex-1 relative group">
          <input
            ref={fileInputRef}
            type="file"
            onChange={handleFileChange}
            accept=".txt,.pdf"
            disabled={loading}
            className="w-full file:mr-3 file:py-2 file:px-4 file:rounded-xl
                     file:border-0 file:text-sm file:font-medium 
                     file:bg-[#38BDF8] hover:file:bg-[#0EA5E9]
                     file:text-white file:cursor-pointer
                     file:transition-all file:duration-300
                     file:hover:opacity-90 file:active:scale-95
                     file:outline-none file:ring-0
                     text-sm text-gray-400 bg-white/5 
                     rounded-xl p-2 cursor-pointer
                     hover:bg-white/10 active:bg-white/15
                     transition-all duration-300
                     disabled:opacity-50 disabled:cursor-not-allowed"
          />
          {file && (
            <button
              onClick={handleRemoveFile}
              className="absolute right-3 top-1/2 -translate-y-1/2 
                       w-8 h-8 flex items-center justify-center
                       rounded-full bg-red-500/15 hover:bg-red-500/25 
                       text-red-400 hover:text-red-300 text-sm font-medium
                       transition-all duration-300 hover:scale-105
                       border border-red-500/20 hover:border-red-500/30
                       shadow-sm hover:shadow-md"
              title="Remove file"
            >
              ✕
            </button>
          )}
        </div>

        {/* Single button that handles both cases */}
        <button
          onClick={(e) => handleSubmit(e, file ? "file" : "text")}
          disabled={isSubmitDisabled}
          className="px-6 py-2.5 rounded-xl bg-[#38BDF8] hover:bg-[#0EA5E9] text-white font-semibold disabled:opacity-50 transition-all duration-200 tracking-wide"
        >
          {file ? t("buttons.analyzeFile") : t("buttons.analyzeText")}
        </button>
      </div>

      {loading && (
        <div className="flex justify-center gap-2 text-white font-medium">
          <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
              fill="none"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          <span className="tracking-wide">{t("buttons.processing")}</span>
        </div>
      )}
    </div>
  );
}
