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

### Prerequisites

- Node.js 18+
- Python 3.11+
- Google Gemini API Key

### 1. Clone Repository

```bash
git clone https://github.com/LSkevi/Email-Categorizer.git
cd Email-Categorizer
```

### 2. Backend Setup

```bash
cd backend

# Install dependencies
pip install -r requirements.txt

# Create .env file with your API key
echo "GEMINI_API_KEY=your_api_key_here" > .env

# Run the server
python -m uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Run development server
npm run dev
```

### 4. Access Application

- Frontend: http://localhost:5173
- Backend API: http://localhost:8000
- API Documentation: http://localhost:8000/docs

## 📖 How to Use

1. **File Upload**: Select a .txt or .pdf file containing email content
2. **Text Input**: Or paste/type email content directly
3. **Analysis**: Click "Analyze Email" to process
4. **Results**: View classification and response suggestion
5. **History**: Access history in sidebar to review previous analyses

## 🎯 Classification Categories

### Productive
Emails requiring action or specific response:
- Technical support requests
- Case status updates
- System inquiries
- Business and client matters

### Unproductive
Emails not requiring immediate action:
- Congratulatory messages
- Thank you notes
- Personal messages
- Non-business topics

## 🌟 Technical Features

- **Advanced AI**: Uses Google Gemini 2.5 Flash for precise classification
- **Auto Language Detection**: Responses in same language as original email
- **Local Persistence**: History saved in browser localStorage
- **Modern Design**: Glassmorphism design with smooth animations
- **Responsive**: Perfect functionality on desktop and mobile
- **Visual Feedback**: Loading indicators and interactive states

## 📱 Project Structure

```
Email-Categorizer/
├── frontend/                  # React Application
│   ├── src/
│   │   ├── Components/       # React Components
│   │   ├── translations/     # Translation Files
│   │   └── utils/
│   ├── package.json
│   └── vite.config.js
├── backend/                   # FastAPI Application
│   ├── main.py              # Main API File
│   ├── requirements.txt     # Python Dependencies
│   └── Procfile             # Deployment Config
└── README.md
```

## 🔧 Available Scripts

### Frontend
```bash
npm run dev          # Development server
npm run build        # Production build
npm run preview      # Preview build
```

### Backend
```bash
python -m uvicorn main:app --reload              # Development
python -m uvicorn main:app --host 0.0.0.0 --port $PORT  # Production
```

## 🌐 Deployment

### Frontend (Vercel)
1. Connect repository to Vercel
2. Set root directory to `frontend`
3. Deploy automatically

### Backend (Render)
1. Configure environment variables
2. Use command: `python -m uvicorn main:app --host 0.0.0.0 --port $PORT`

## 🤝 Contributing

This project was developed as part of the AutoU selection process. Suggestions and improvements are welcome!

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Developer

Developed with ❤️ for the AutoU selection process

---

⭐ **Like this project? Give it a star!**
