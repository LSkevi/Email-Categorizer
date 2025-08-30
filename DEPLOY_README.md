# 🚀 Email Categorizer - AutoU Case Study

[![Deploy Backend](https://img.shields.io/badge/Deploy-Backend-blue?style=for-the-badge&logo=render)](https://render.com)
[![Deploy Frontend](https://img.shields.io/badge/Deploy-Frontend-black?style=for-the-badge&logo=vercel)](https://vercel.com)

An AI-powered email classification system that categorizes emails as **Productive** or **Unproductive** and suggests professional responses using Google Gemini AI.

## 🌟 Features

- **AI Classification**: Intelligent email categorization using Google Gemini
- **File Upload**: Support for .txt and .pdf files
- **Multilingual**: English and Portuguese support
- **Professional Responses**: AI-generated response suggestions
- **History Tracking**: Keep track of classified emails
- **Modern UI**: Clean, responsive interface built with React

## 🔗 Live Demo

- **Frontend**: [Will be deployed to Vercel]
- **Backend API**: [Will be deployed to Render]

## 🛠️ Tech Stack

### Backend
- **FastAPI** - Modern Python web framework
- **Google Gemini AI** - For email classification and response generation
- **Pydantic** - Data validation
- **PDFMiner** - PDF text extraction

### Frontend
- **React 18** - Modern UI library
- **Vite** - Fast build tool
- **Tailwind CSS** - Utility-first CSS framework
- **i18next** - Internationalization

## 📋 Prerequisites

- Python 3.11+
- Node.js 18+
- Google Gemini API Key

## 🚀 Quick Start

### Backend Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/LSkevi/Email-Categorizer.git
   cd Email-Categorizer/backend
   ```

2. **Create virtual environment**
   ```bash
   python -m venv .venv
   .venv\Scripts\activate  # Windows
   # source .venv/bin/activate  # macOS/Linux
   ```

3. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Set up environment variables**
   ```bash
   # Create .env file
   echo GEMINI_API_KEY=your_gemini_api_key_here > .env
   ```

5. **Run the backend**
   ```bash
   uvicorn main:app --reload
   ```

The API will be available at `http://localhost:8000`

### Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd ../frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

The frontend will be available at `http://localhost:5173`

## 🌐 Deployment

### Backend (Render)

1. **Push your code to GitHub**
2. **Create a new Web Service on Render**
3. **Connect your GitHub repository**
4. **Configure build settings**:
   - **Build Command**: `pip install -r requirements-deploy.txt`
   - **Start Command**: `uvicorn main:app --host 0.0.0.0 --port $PORT`
   - **Environment**: Add `GEMINI_API_KEY` and `ENVIRONMENT=production`

### Frontend (Vercel)

1. **Push your code to GitHub**
2. **Import project on Vercel**
3. **Configure build settings**:
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend`
   - **Environment Variables**: Add `VITE_API_URL` with your Render backend URL

## 📖 API Documentation

### Endpoints

- `GET /` - API information
- `GET /health` - Health check
- `POST /classificar` - Classify email text
- `POST /upload` - Upload and classify email file

### Example Usage

**Classify Text:**
```bash
curl -X POST "https://your-api.render.com/classificar" \
     -H "Content-Type: application/json" \
     -d '{"texto": "Preciso do status do processo 12345 urgente"}'
```

**Response:**
```json
{
  "classificacao": "Produtivo",
  "texto": "Prezado(a), obrigado por entrar em contato. Estou verificando o status do processo 12345 e retornarei com uma atualização completa em breve..."
}
```

## 🎯 AutoU Case Study Requirements ✅

- ✅ **Web Interface**: Modern React application with file upload and text input
- ✅ **AI Classification**: Productive vs Unproductive categorization
- ✅ **Response Suggestions**: AI-generated professional responses
- ✅ **Python Backend**: FastAPI with NLP processing
- ✅ **Cloud Deployment**: Render + Vercel hosting
- ✅ **File Support**: .txt and .pdf file processing
- ✅ **Professional UI**: Clean, intuitive interface

## 🔧 Environment Variables

### Backend (.env)
```
GEMINI_API_KEY=your_gemini_api_key_here
ENVIRONMENT=development
```

### Frontend (.env.local)
```
VITE_API_URL=http://127.0.0.1:8000
```

## 📁 Project Structure

```
Email-Categorizer/
├── backend/
│   ├── main.py              # FastAPI application
│   ├── requirements.txt     # Python dependencies
│   ├── Procfile            # Render deployment
│   └── .env                # Environment variables
├── frontend/
│   ├── src/
│   │   ├── Components/     # React components
│   │   ├── translations/   # i18n files
│   │   └── utils/         # Utility functions
│   ├── package.json       # Node.js dependencies
│   └── vercel.json       # Vercel configuration
└── README.md
```

## 🎨 Screenshots

[Add screenshots of your application here]

## 🤝 Contributing

This project was developed as part of the AutoU selection process. For questions or suggestions, please contact [your-email].

## 📄 License

This project is for educational and evaluation purposes as part of the AutoU selection process.

---

**Developed with ❤️ for AutoU Case Study**
