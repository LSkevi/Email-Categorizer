import { useState, useRef } from "react";
import { useTranslation } from "react-i18next";

export default function UploadForm({ setResult }) {
  const { t } = useTranslation();
  const [file, setFile] = useState(null);
  const [texto, setTexto] = useState("");
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileChange = async (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    setFile(selectedFile);

    try {
      const content = await selectedFile.text();
      setTexto(content);
    } catch (error) {
      console.error("Error reading file:", error);
    }
  };

  const handleSubmit = async (e, type) => {
    e.preventDefault();
    setLoading(true);
    try {
      const url = type === "file" ? "/upload" : "/classificar";
      const body =
        type === "file"
          ? (() => {
              const fd = new FormData();
              fd.append("file", file);
              return fd;
            })()
          : JSON.stringify({ texto });

      const res = await fetch(`http://127.0.0.1:8000${url}`, {
        method: "POST",
        ...(type === "text" && {
          headers: { "Content-Type": "application/json" },
        }),
        body,
      });
      setResult(await res.json());
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFile = () => {
    setFile(null);
    setTexto("");
    // Reset the file input value
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="w-full space-y-4">
      <textarea
        placeholder={t("textarea")}
        value={texto}
        onChange={(e) => setTexto(e.target.value)}
        disabled={loading}
        className="w-full h-32 bg-white/5 backdrop-blur-sm rounded-xl p-3 
                 text-white placeholder-gray-400 resize-none outline-none
                 border border-white/10 focus:border-white/20 
                 focus:ring-2 focus:ring-[#38BDF8]/20 transition-all"
      />

      <div className="flex items-center gap-3">
        <div className="flex-1 relative group">
          <input
            ref={fileInputRef}
            type="file"
            onChange={handleFileChange}
            accept=".txt,.doc,.docx"
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
              className="absolute right-2 top-2 p-1.5 rounded-lg 
                       bg-red-500/10 hover:bg-red-500/20 text-red-400
                       transition-colors duration-300"
            >
              ✕
            </button>
          )}
        </div>

        <button
          onClick={(e) => handleSubmit(e, "text")}
          disabled={loading || !texto.trim()}
          className="px-4 py-2 rounded-xl bg-[#38BDF8] hover:bg-[#0EA5E9] text-white font-medium disabled:opacity-50 transition-colors"
        >
          {t("buttons.text")}
        </button>

        <button
          onClick={(e) => handleSubmit(e, "file")}
          disabled={loading || !file}
          className="px-4 py-2 rounded-xl bg-[#38BDF8] hover:bg-[#0EA5E9] text-white font-medium disabled:opacity-50 transition-colors"
        >
          {t("buttons.file")}
        </button>
      </div>

      {loading && (
        <div className="flex justify-center gap-2 text-white">
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
          <span>{t("buttons.processing")}</span>
        </div>
      )}
    </div>
  );
}
