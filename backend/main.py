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


class Email(BaseModel):
    classificacao: str
    texto: str


class PromptRequest(BaseModel):
    texto: str    

app = FastAPI()

origins = [
    "http://localhost:5173",  
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/classificar", response_model=Email)
async def classificar_texto(request: PromptRequest):
    
    prompt = f"""
    Classifique o email abaixo usando esses parametros e faça uma Sugestão de resposta automática para o email
    sempre responda na língua do email mudando o idioma da classificacao e do texto da resposta automática
    Produtivo: Emails que requerem uma ação ou resposta específica (ex.: solicitações de suporte técnico, atualização sobre casos em aberto, dúvidas sobre o sistema).
    Improdutivo:Emails que não necessitam de uma ação imediata (ex.: mensagens de felicitações, agradecimentos).
    e responda apenas em JSON, no formato:

    {{
      "classificacao": "Produtivo ou Improdutivo",
      "texto": "Sugestão de resposta automática para o email"
    }}

    Email: {request.texto}
    """

    response = client.models.generate_content(
        model="gemini-2.5-flash",
        contents=prompt,
        config=types.GenerateContentConfig(
            temperature=0,
        )
    )

    print("Resposta do Gemini:\n", response.text)
    cleaned_text = re.sub(r"```json\s*|\s*```", "", response.text).strip()

    
    try:
        data = json.loads(cleaned_text)
    except json.JSONDecodeError:
        data = {
            "classificacao": "Desconhecido",
            "texto": response.text
        }

    return Email(**data)
