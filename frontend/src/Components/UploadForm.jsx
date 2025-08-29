import { useState } from "react";

export default function UploadForm({ setResult }) {
  const [file, setFile] = useState(null);
  const [texto, setTexto] = useState("");
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => setFile(e.target.files[0]);
  const handleTextoChange = (e) => setTexto(e.target.value);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();

    if (file) {
      formData.append("file", file);
      const res = await fetch("http://127.0.0.1:8000/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      setResult(data);
    } else if (texto.trim()) {
      const res = await fetch("http://127.0.0.1:8000/classificar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ texto }),
      });
      const data = await res.json();
      setResult(data);
    }

    setLoading(false);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-black p-6 rounded-2xl shadow-md w-full max-w-lg flex flex-col gap-4"
    >
      <textarea
        placeholder="Cole o texto do email aqui..."
        value={texto}
        onChange={handleTextoChange}
        className="border p-3 rounded-lg h-32 resize-none"
      />

      <input type="file" onChange={handleFileChange} />

      <button
        type="submit"
        className="bg-pastelBlue hover:bg-blue-300 text-white font-semibold py-2 rounded-lg"
        disabled={loading}
      >
        {loading ? "Processando..." : "Classificar"}
      </button>
    </form>
  );
}
