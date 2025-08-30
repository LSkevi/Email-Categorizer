# Smart Email Categorizer 🚀

> **AutoU Case Study - AI-Powered Email Classification System**

An intelligent web application that automatically classifies emails and suggests appropriate responses using Google Gemini AI.

## 🎯 Project Overview

This solution automates email classification for financial companies, categorizing emails as **Productive** (requiring action) or **Unproductive** (informational), and generating smart response suggestions to improve team efficiency.

## ✨ Key Features

- **🤖 AI Classification**: Advanced email categorization using Google Gemini AI
- **📁 File Support**: Upload .txt, .pdf files or paste email content directly  
- **🌐 Multilingual**: Full Portuguese and English support with auto-detection
- **💬 Smart Responses**: AI-generated professional response suggestions
- **📊 History Tracking**: Persistent classification history with timestamps
- **🎨 Modern UI**: Responsive, professional interface built with React
- **☁️ Cloud Ready**: Deployed on Vercel (frontend) and Render (backend)

## 🛠️ Tech Stack

**Frontend**
- React 18 with modern hooks
- Tailwind CSS for styling
- i18next for internationalization
- Vite for fast development

**Backend**  
- FastAPI for high-performance APIs
- Google Gemini AI for classification
- PDFMiner for document processing
- Python 3.11+ with type hints

## 🚀 Live Demo

- **Frontend**: https://email-categorizer-one.vercel.app
- **Backend API**: https://email-categorizer.onrender.com
- **API Documentation**: https://email-categorizer.onrender.com/docs

## 📋 Quick Start

### 2. Configurar o Backend

```bash
cd backend

# Instalar dependências
pip install -r requirements.txt

# Configurar variáveis de ambiente
# Crie um arquivo .env com:
GEMINI_API_KEY=sua_api_key_aqui

# Executar o servidor
python -m uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

### 3. Configurar o Frontend

```bash
cd frontend

# Instalar dependências
npm install

# Executar o servidor de desenvolvimento
npm run dev
```

### 4. Acessar a Aplicação

- Frontend: http://localhost:5173
- Backend API: http://localhost:8000
- Documentação da API: http://localhost:8000/docs

## 📖 Como Usar

1. **Upload de Arquivo**: Selecione um arquivo .txt ou .pdf com o conteúdo do email
2. **Entrada de Texto**: Ou cole/digite o texto do email diretamente
3. **Análise**: Clique em "Analisar Email" para processar
4. **Resultados**: Visualize a classificação e sugestão de resposta
5. **Histórico**: Acesse o histórico no painel lateral para revisar análises anteriores

## 🎯 Categorias de Classificação

### Produtivo

Emails que requerem ação ou resposta específica:

- Solicitações de suporte técnico
- Atualizações sobre casos em aberto
- Dúvidas sobre sistemas
- Assuntos empresariais e clientes

### Improdutivo

Emails que não necessitam ação imediata:

- Mensagens de felicitações
- Agradecimentos
- Mensagens pessoais
- Temas não relacionados a negócios

## 🌟 Diferenciais Técnicos

- **IA Avançada**: Utiliza Google Gemini 2.5 Flash para classificação precisa
- **Detecção Automática de Idioma**: Respostas no mesmo idioma do email original
- **Persistência Local**: Histórico salvo no localStorage do navegador
- **Interface Polida**: Design moderno com glassmorphism e animações
- **Responsividade**: Funciona perfeitamente em desktop e mobile
- **Feedback Visual**: Indicadores de loading e estados interativos

## 📱 Estrutura do Projeto

```
Email-Categorizer/
├── frontend/                  # Aplicação React
│   ├── src/
│   │   ├── Components/       # Componentes React
│   │   ├── translations/     # Arquivos de tradução
│   │   └── ...
│   ├── package.json
│   └── ...
├── backend/                   # API FastAPI
│   ├── main.py              # Arquivo principal da API
│   ├── requirements.txt     # Dependências Python
│   └── ...
└── README.md
```

## 🔧 Scripts Disponíveis

### Frontend

```bash
npm run dev          # Servidor de desenvolvimento
npm run build        # Build para produção
npm run preview      # Preview do build
```

### Backend

```bash
python -m uvicorn main:app --reload    # Servidor de desenvolvimento
python -m uvicorn main:app --host 0.0.0.0 --port 8000  # Produção
```

## 🌐 Deploy

### Frontend (Vercel)

1. Conecte seu repositório ao Vercel
2. Configure o diretório raiz como `frontend`
3. Deploy automático

### Backend (Railway/Render)

1. Configure as variáveis de ambiente
2. Use o comando: `python -m uvicorn main:app --host 0.0.0.0 --port $PORT`

## 🤝 Contribuição

Este projeto foi desenvolvido como parte do processo seletivo da AutoU. Sugestões e melhorias são bem-vindas!

## 📄 Licença

Este projeto está sob a licença MIT.

## 👨‍💻 Desenvolvedor

Desenvolvido com ❤️ para o processo seletivo da AutoU

---

⭐ **Gostou do projeto? Deixe uma estrela!**

- Backend: Python, FastAPI, Uvicorn (ASGI)
- LLM: Google Gemini via the Generative AI API (REST)
- Frontend: React (Vite), JavaScript

---

## Quick start (overview)

1. Clone the repo
2. Set up the backend (Python): install deps, configure credentials for Gemini, run FastAPI
3. Set up the frontend (React): install deps, point to backend API, run dev server
4. Use the UI or curl to categorize emails

Detailed instructions follow.

---

## Backend — FastAPI (Python)

Prerequisites:

- Python 3.10+
- pip
- Google Cloud Project with access to the Generative AI / Gemini model (or service account)
- (Optional) Docker

1. Create a Python virtual environment and install dependencies

```bash
python -m venv .venv
source .venv/bin/activate   # macOS / Linux
# .venv\Scripts\activate    # Windows PowerShell

pip install --upgrade pip
# Install all dependencies from the backend requirements file
pip install -r backend/requirements.txt
```

Notes:

- Ensure your backend/requirements.txt includes the libraries your backend needs (examples: fastapi, uvicorn, sqlalchemy, aiosqlite, pydantic, python-dotenv, google-auth, google-auth-httplib2, google-auth-oauthlib, requests). If you want, I can generate a starter requirements.txt for you.
- If you prefer to install packages individually for development, you can still run `pip install fastapi uvicorn ...` but the requirements file keeps versions consistent.

2. Environment variables

Create a `.env` file in the backend folder (example shown) or set environment variables in your environment:

```
# .env (example)
PORT=8000
DATABASE_URL=sqlite+aiosqlite:///./emails.db
# GOOGLE: either provide a service account JSON path or set credentials for application default
GOOGLE_APPLICATION_CREDENTIALS=/path/to/service-account.json
# optionally override model name:
GEMINI_MODEL=text-bison-001
# If you are using an API key approach:
GOOGLE_API_KEY=YOUR_API_KEY
```

Notes:

- Preferred for server-side use: a Google Cloud service account with the correct IAM permissions, set via `GOOGLE_APPLICATION_CREDENTIALS`.
- Some deployments can use an API key — check your Google Cloud setup and quota.

3. Example backend endpoints

- POST /api/categorize

  - Request JSON:
    ```json
    {
      "subject": "Weekly status",
      "body": "Here's what I accomplished this week...",
      "metadata": { "source": "inbox", "sender": "alice@example.com" }
    }
    ```
  - Response JSON:
    ```json
    {
      "id": 1,
      "category": "productive",
      "confidence": 0.93,
      "explanation": "The email contains status updates and action items...",
      "created_at": "2025-08-29T18:00:00Z"
    }
    ```

- GET /api/history

  - Returns list of previous categorizations (paginated)

- GET /api/history/{id}
  - Return single entry details

4. Example categorize flow (server-side) — Python snippet calling Google Generative API

```python
# backend/gemini_client.py (example)
import os
import json
import google.auth
from google.auth.transport.requests import AuthorizedSession

def call_gemini(prompt: str, model: str = "text-bison-001"):
    # This uses Application Default Credentials via GOOGLE_APPLICATION_CREDENTIALS
    credentials, _ = google.auth.default(scopes=["https://www.googleapis.com/auth/cloud-platform"])
    authed_session = AuthorizedSession(credentials)

    url = f"https://generativelanguage.googleapis.com/v1beta2/models/{model}:generate"
    payload = {
        "prompt": {
            "text": prompt
        },
        "temperature": 0.0,
        "maxOutputTokens": 256
    }

    r = authed_session.post(url, json=payload)
    r.raise_for_status()
    return r.json()
```

5. Example categorize logic (pseudo)

- Build a prompt that instructs the model to decide if the email is productive:
  - Provide context, explicit instruction, and a JSON-only response schema to parse reliably.
- Use the model's answer to determine category (e.g., `productive`, `not_productive`, `unknown`) and store the explanation and confidence (if available).

Example prompt skeleton:

```
You are an email triage assistant. Classify the following email as "productive" if it contains work-related content, action items, status updates, meeting invitations, or tasks. Classify as "not_productive" if it's spam, social, personal chit-chat, or irrelevant. Return only valid JSON with keys: category, confidence (0-1), explanation.

Email subject: "..."
Email body: "..."
```

6. Run backend

```bash
uvicorn backend.main:app --reload --host 0.0.0.0 --port ${PORT:-8000}
```

The FastAPI interactive docs will be available at http://localhost:8000/docs

---

## Frontend — React (JavaScript)

Prerequisites:

- Node.js >=16
- npm or yarn

1. Install

```bash
cd frontend
npm install
# or
yarn
```

2. Environment

Create `.env` in the frontend folder:

```
REACT_APP_API_URL=http://localhost:8000/api
```

3. Start dev server

```bash
npm start
# or
yarn start
```

4. UI overview

- Form to input subject + body and submit for categorization
- History view listing past categorizations
- Detail view showing explanation and raw model output

5. Example client request (fetch)

```javascript
// src/api.js
const API_URL = process.env.REACT_APP_API_URL;

export async function categorizeEmail(subject, body) {
  const res = await fetch(`${API_URL}/categorize`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ subject, body }),
  });
  return res.json();
}
```

---

## Database / Data model

A simple model example (SQLAlchemy / SQLModel style):

- EmailRecord
  - id: int (pk)
  - subject: text
  - body: text
  - category: string
  - confidence: float
  - explanation: text
  - model_response: json/text (raw response if you want to store it)
  - created_at: datetime

Use SQLite for local dev (`sqlite:///./emails.db`), and Postgres for production. If using Alembic or SQLModel, include migrations in the `backend/migrations` folder.

---

## Docker (optional)

Simple Dockerfile examples are provided in /docker for backend and frontend. Build and run using docker-compose for local development.

---

## Tests

- Add unit tests for:
  - prompt construction and parsing
  - classification logic (for deterministic parts)
  - API endpoints (use FastAPI TestClient)
- Add integration tests mocking the Gemini API (or use a sandbox key)

---

## Security & Privacy

- Emails are sensitive. Ensure you have consent before sending email content to any external model.
- For production, review and apply organizational policies for data retention, encryption-at-rest, logging, and access control.
- Consider anonymizing or only sending metadata & excerpts to the LLM where possible.
- Monitor costs of LLM usage and add rate limits or usage caps.

---

## Deployment

- Backend: host on a cloud VM, Cloud Run, or container service. Configure service account securely.
- Frontend: host on Vercel, Netlify, or a static hosting provider. Point to the backend API and secure CORS.

---

## Contribution

Contributions are welcome. Suggested workflow:

1. Fork the repo
2. Create a feature branch
3. Run tests, add documentation
4. Create a pull request describing changes

Add an ISSUE_TEMPLATE and PR_TEMPLATE to guide contributors.

---

## Troubleshooting

- 401/permission errors calling Gemini: ensure `GOOGLE_APPLICATION_CREDENTIALS` points to a valid service account JSON and the account has the correct API access.
- Rate limits / quota: check Google Cloud console for usage and quota.
- Unexpected model output: tighten prompt instructions and use schema enforcement (ask model to output JSON only).

---

## TODO / Ideas (future improvements)

- Add user authentication and per-user history
- Add throttling and cost-monitoring dashboard
- Fine-tune a classification model locally for improved accuracy
- Add multi-language support
- Add a browser extension to categorize emails directly in webmail

---

## License & Contact

- License: add your preferred license (MIT, Apache-2.0, etc.) — fill this in.
- Contact: LSkevi (add your email or social links here)

---

Thank you for building with this stack! This README gives you a full setup path to get the Email Categorizer running locally and explains how Gemini is integrated.
