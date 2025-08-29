from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from google import genai
from google.genai import types
import json, re
from typing import List
import io
from pdfminer.high_level import extract_text

client = genai.Client(api_key="AIzaSyC_F5fFt7Z0iyVRAJ6tvu7JyzaMPXmRoqM")

# Modelos de dados
class Email(BaseModel):
    classificacao: str
    texto: str

class PromptRequest(BaseModel):
    texto: str

app = FastAPI()

# CORS
origins = ["http://localhost:5173"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Função para classificar texto
def classificar_texto_gemini(texto: str) -> Email:
    prompt = f"""
    Classifique o email abaixo usando esses parametros e faça uma Sugestão de resposta automática para o email 
    Produtivo: Emails que requerem uma ação ou resposta específica (ex.: solicitações de suporte técnico, atualização sobre casos em aberto, dúvidas sobre o sistema, assuntos sobre a empresa e sobre clientes).
    Improdutivo: Emails que não necessitam de uma ação imediata (ex.: mensagens de felicitações, agradecimentos, mensagens de parentes, qualquer tema que não for sobre negocios).
    Se for improdutivo, a sugestão de resposta deve ser uma mensagem educada informando que o email não será respondido.
    Se for produtivo, a sugestão de resposta deve ser uma resposta direta e objetiva ao email.
    e responda apenas em JSON, no formato:

    {{
      "classificacao": "Produtivo ou Improdutivo",
      "texto": "Sugestão de resposta automática para o email"
    }}

    Email: {texto}
    """

    response = client.models.generate_content(
        model="gemini-2.5-flash",
        contents=prompt,
        config=types.GenerateContentConfig(temperature=0)
    )

    # Limpar Markdown ```json ... ```
    cleaned_text = re.sub(r"```json\s*|\s*```", "", response.text).strip()

    try:
        data = json.loads(cleaned_text)
    except json.JSONDecodeError:
        data = {"classificacao": "Desconhecido", "texto": response.text}

    return Email(**data)

# Endpoint para classificar texto direto
@app.post("/classificar", response_model=Email)
async def classificar_texto_endpoint(request: PromptRequest):
    return classificar_texto_gemini(request.texto)

# Endpoint para upload de arquivos (.txt ou .pdf)
@app.post("/upload", response_model=Email)
async def upload_file(file: UploadFile = File(...)):
    content = ""
    if file.filename.endswith(".txt"):
        content = (await file.read()).decode("utf-8")
    elif file.filename.endswith(".pdf"):
        bytes_data = await file.read()
        content = extract_text(io.BytesIO(bytes_data))
    else:
        return {"classificacao": "Erro", "texto": "Formato não suportado"}

    return classificar_texto_gemini(content)
