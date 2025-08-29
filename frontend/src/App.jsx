import { useState } from "react";
import UploadForm from "./components/UploadForm";
import EmailResult from "./components/EmailResult";

export default function App() {
  const [result, setResult] = useState(null);

  return (
    <div className="min-h-screen min-w-screen bg-[#1e1e2f] flex flex-col items-center justify-center p-6">
      <h1 className="text-3xl font-semibold text-white-800 mb-6 text-center">
        Classificador de Emails
      </h1>

      <div className="w-full max-w-lg flex flex-col items-center gap-6">
        <UploadForm setResult={setResult} />
        {result && <EmailResult result={result} />}
      </div>
    </div>
  );
}
