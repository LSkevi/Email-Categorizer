import React, { useState } from "react";
import AddEmailForm from "./AddEmailForm";

const EmailCategorizer = () => {
  const [resultado, setResultado] = useState(null);

  const classifyEmail = async (emailText) => {
    try {
      const response = await fetch("http://localhost:8000/classificar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ texto: emailText }),
      });

      if (!response.ok) throw new Error("Erro na requisição");

      const data = await response.json();
      setResultado(data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-center">Email Categorizer</h1>

      <AddEmailForm classifyEmail={classifyEmail} />

      {resultado && (
        <div
          className={`p-5 rounded-xl shadow-md border transition-colors
            ${
              resultado.classificacao === "Produtivo"
                ? "bg-green-50 border-green-200"
                : "bg-gray-50 border-gray-200"
            }`}
        >
          <h2 className="text-lg text-black font-semibold mb-2">
            Classificação:{" "}
            <span
              className={
                resultado.classificacao === "Produtivo"
                  ? "text-green-700"
                  : "text-red-700"
              }
            >
              {resultado.classificacao}
            </span>
          </h2>
          <p className="text-gray-800">
            <strong>Resposta sugerida:</strong> {resultado.texto}
          </p>
        </div>
      )}
    </div>
  );
};

export default EmailCategorizer;
