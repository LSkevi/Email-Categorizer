export default function EmailResult({ result }) {
  return (
    <div className="mt-6 bg-black p-5 rounded-2xl shadow-md w-full max-w-lg">
      <h2 className="text-xl font-semibold mb-2">Resultado da Classificação</h2>
      <p>
        <strong>Classificação:</strong> {result.classificacao}
      </p>
      <p className="mt-2">
        <strong>Sugestão de resposta:</strong> {result.texto}
      </p>
    </div>
  );
}
