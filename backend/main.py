from fastapi import FastAPI, UploadFile, File, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, field_validator
from google import genai
from google.genai import types
import json
import re
import io
import os
from typing import List, Optional
from dotenv import load_dotenv
from pdfminer.high_level import extract_text
import logging

# Load environment variables
load_dotenv()

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Constants
GEMINI_MODEL = "gemini-2.5-flash"
SUPPORTED_FILE_TYPES = {".txt", ".pdf"}
MAX_FILE_SIZE = 10 * 1024 * 1024  # 10MB

# CORS origins - production configuration
CORS_ORIGINS = [
    "http://localhost:5173",  # Local development
    "http://localhost:3000",  # Alternative local port
    "https://*.vercel.app",   # Vercel deployments
    "https://*.netlify.app",  # Netlify deployments
]

# Initialize Gemini client
try:
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        raise ValueError("GEMINI_API_KEY environment variable is required")
    client = genai.Client(api_key=api_key)
except Exception as e:
    logger.error(f"Failed to initialize Gemini client: {e}")
    raise

# Data models
class Email(BaseModel):
    classificacao: str
    texto: str
    
    @field_validator('classificacao')
    @classmethod
    def validate_classificacao(cls, v):
        if v not in ['Produtivo', 'Improdutivo', 'Erro', 'Desconhecido']:
            logger.warning(f"Unexpected classification: {v}")
        return v

class PromptRequest(BaseModel):
    texto: str
    
    @field_validator('texto')
    @classmethod
    def validate_texto(cls, v):
        if not v or not v.strip():
            raise ValueError("Text cannot be empty")
        if len(v) > 50000:  # Increased limit for long emails
            raise ValueError("Text is too long (maximum 50,000 characters allowed)")
        return v.strip()

# FastAPI app
app = FastAPI(
    title="Email Categorizer API",
    description="API for categorizing emails as productive or unproductive",
    version="1.0.0"
)

# CORS middleware - Configure based on environment
cors_origins = ["*"] if os.getenv("ENVIRONMENT") == "production" else CORS_ORIGINS

app.add_middleware(
    CORSMiddleware,
    allow_origins=cors_origins,
    allow_credentials=False if os.getenv("ENVIRONMENT") == "production" else True,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["*"],
)

# Classification prompt template
CLASSIFICATION_PROMPT = """
Você é um assistente de IA para uma grande empresa do setor financeiro que processa alto volume de emails diariamente. 
Primeiro, detecte o idioma do email abaixo e responda SEMPRE no mesmo idioma detectado.

Classifique o email usando esses parâmetros:

PRODUTIVO: Emails que requerem ação ou resposta específica relacionada aos negócios da empresa, como:
- Solicitações de status de requisições em andamento
- Dúvidas sobre produtos ou serviços financeiros
- Pedidos de suporte técnico ou atendimento
- Compartilhamento de documentos importantes
- Questões regulatórias ou de compliance
- Solicitações de clientes sobre contas, investimentos, empréstimos
- Comunicações internas sobre projetos ou processos

EXEMPLOS DE EMAILS PRODUTIVOS:
• "Preciso verificar o status da minha solicitação de empréstimo #12345"
• "Estou com problemas para acessar minha conta online"
• "Podem enviar o extrato mensal da conta corrente?"
• "Qual a documentação necessária para abertura de conta PJ?"

IMPRODUTIVO: Emails que não necessitam resposta imediata ou não são relacionados aos negócios, como:
- Mensagens de felicitações (aniversários, feriados, etc.)
- Agradecimentos gerais
- Mensagens pessoais não relacionadas ao trabalho
- Spam ou comunicações irrelevantes
- Convites para eventos não corporativos

EXEMPLOS DE EMAILS IMPRODUTIVOS:
• "Feliz Natal e próspero Ano Novo para toda a equipe!"
• "Obrigado pela excelente apresentação de ontem"
• "Parabéns pela promoção, você merece!"
• "A máquina de café do escritório foi consertada"

DIRETRIZES PARA RESPOSTAS AUTOMÁTICAS:

Para emails PRODUTIVOS:
- Confirme o recebimento da solicitação
- Informe próximos passos ou prazo estimado
- Seja cordial mas profissional
- Use linguagem corporativa adequada ao setor financeiro
- Inclua informações de contato se necessário

EXEMPLOS DE RESPOSTAS PRODUTIVAS:
• "Recebemos sua solicitação e entraremos em contato em até 2 dias úteis com uma atualização."
• "Obrigado por entrar em contato. Nossa equipe técnica analisará o problema e retornará em breve."
• "Sua solicitação foi registrada sob protocolo #[número]. Aguarde nosso retorno em até 24 horas."

Para emails IMPRODUTIVOS:
- Responda educadamente mas deixe claro que não requer processamento
- Mantenha tom profissional e respeitoso
- Seja breve e direto

EXEMPLOS DE RESPOSTAS IMPRODUTIVAS:
• "Muito obrigado pela mensagem. Desejamos um excelente ano novo para você também!"
• "Agradecemos suas palavras gentis. Ficamos felizes em ter contribuído."
• "Obrigado pela informação. Registramos sua mensagem."
- Mantenha tom profissional e respeitoso
- Seja breve e direto

IMPORTANTE: 
- Use linguagem formal e profissional adequada ao setor financeiro
- SEMPRE responda no mesmo idioma do email original
- Inclua elementos de cortesia corporativa
- Mantenha consistência com padrões de atendimento empresarial

Responda apenas em JSON, no formato:
{{
  "classificacao": "Produtivo ou Improdutivo" (sempre em português),
  "texto": "Sugestão de resposta automática profissional no mesmo idioma do email original"
}}

Email: {texto}
"""

def classificar_texto_gemini(texto: str) -> Email:
    """
    Classifies email text using Google Gemini AI.
    
    Args:
        texto: The email text to classify
        
    Returns:
        Email object with classification and response suggestion
        
    Raises:
        HTTPException: If classification fails
    """
    try:
        prompt = CLASSIFICATION_PROMPT.format(texto=texto)
        
        response = client.models.generate_content(
            model=GEMINI_MODEL,
            contents=prompt,
            config=types.GenerateContentConfig(temperature=0)
        )

        # Clean Markdown formatting
        cleaned_text = re.sub(r"```json\s*|\s*```", "", response.text).strip()

        try:
            data = json.loads(cleaned_text)
            return Email(**data)
        except json.JSONDecodeError as e:
            logger.error(f"Failed to parse JSON response: {e}")
            return Email(
                classificacao="Erro", 
                texto="Erro ao processar resposta da IA"
            )
            
    except Exception as e:
        logger.error(f"Error in classification: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Erro interno do servidor"
        )

def extract_file_content(file: UploadFile) -> str:
    """
    Extracts text content from uploaded file.
    
    Args:
        file: The uploaded file
        
    Returns:
        Extracted text content
        
    Raises:
        HTTPException: If file processing fails
    """
    try:
        file_extension = os.path.splitext(file.filename)[1].lower()
        
        if file_extension not in SUPPORTED_FILE_TYPES:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Formato não suportado. Suportados: {', '.join(SUPPORTED_FILE_TYPES)}"
            )
        
        # Read file content
        file_content = file.file.read()
        
        # Check file size
        if len(file_content) > MAX_FILE_SIZE:
            raise HTTPException(
                status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
                detail="Arquivo muito grande (máximo 10MB)"
            )
        
        # Extract content based on file type
        if file_extension == ".txt":
            try:
                content = file_content.decode("utf-8")
            except UnicodeDecodeError:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Arquivo não está em formato UTF-8 válido"
                )
        elif file_extension == ".pdf":
            try:
                content = extract_text(io.BytesIO(file_content))
                if not content.strip():
                    raise HTTPException(
                        status_code=status.HTTP_400_BAD_REQUEST,
                        detail="PDF não contém texto extraível"
                    )
            except Exception as e:
                logger.error(f"PDF extraction error: {e}")
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Erro ao extrair texto do PDF"
                )
        
        return content.strip()
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"File processing error: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Erro ao processar arquivo"
        )

# API Endpoints
@app.post("/classificar", response_model=Email)
async def classificar_texto_endpoint(request: PromptRequest):
    """
    Classifies email text directly from request body.
    """
    try:
        return classificar_texto_gemini(request.texto)
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Classification endpoint error: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Erro ao classificar texto"
        )

@app.post("/upload", response_model=Email)
async def upload_file(file: UploadFile = File(...)):
    """
    Processes uploaded file and classifies its content.
    """
    try:
        content = extract_file_content(file)
        return classificar_texto_gemini(content)
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Upload endpoint error: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Erro ao processar upload"
        )

@app.get("/")
async def root():
    """
    Root endpoint with API information.
    """
    return {
        "message": "Email Categorizer API", 
        "version": "1.0.0",
        "description": "API for categorizing emails as productive or unproductive using Google Gemini AI",
        "endpoints": {
            "POST /classificar": "Classify email text",
            "POST /upload": "Upload and classify email file",
            "GET /health": "Health check"
        }
    }

@app.get("/health")
async def health_check():
    """
    Health check endpoint.
    """
    return {"status": "healthy", "message": "Email Categorizer API is running"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
