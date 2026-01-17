# 📈 TradeVerse - Professional Stock Trading Platform

![License](https://img.shields.io/badge/license-MIT-blue.svg) ![Node](https://img.shields.io/badge/node-%3E%3D16.0.0-brightgreen.svg) ![React](https://img.shields.io/badge/react-v19.0.0-blue.svg) ![Status](https://img.shields.io/badge/status-active-success.svg)

**TradeVerse** is a high-performance, real-time stock trading simulation platform designed for the modern trader. Built with the MERN stack and powered by advanced WebSocket integration, it offers a seamless, risk-free environment to master financial markets with **₹5,00,000 ($500k)** in virtual capital.

Featuring a futuristic dark/light mode UI with **Glassmorphism aesthetics**, **AI-powered insights**, and **interactive particle animations**, TradeVerse combines professional-grade charting tools with an engaging user experience.

---

## 🚀 Key Features

### 🧠 AI & Intelligence
- **AI Trading Assistant**: Integrated **OpenAI-powered chatbot** that provides real-time stock analysis, answers trading questions, and offers technical insights.
- **Smart Fallback System**: Automatically switches to "Simulation Mode" if API keys are missing, ensuring uninterrupted usage.

### 📊 Real-Time Market Intelligence
- **Live Stock Data**: Instant price updates via **Socket.io** and **Yahoo Finance API**.
- **Global Market Ticker**: Scrolling ticker tape displaying real-time data for major global indices (S&P 500, NASDAQ, BTC/USD, NIFTY 50).
- **Smart Market Status**: Dynamic tracking of global market hours (NSE vs. NYSE). Stock prices freeze when markets are closed.
- **Advanced Charting**: Interactive candlestick and area charts with timeframe selection.

### 💼 Portfolio & Paper Trading
- **₹5,00,000 Virtual Capital**: Start with a substantial paper trading budget to practice high-volume strategies.
- **Advanced Order Management**: Buy/Sell stocks with a professional modal interface.
- **Risk Management**: Configure custom **Risk Limits** and **Leverage** (1x to 10x) in Settings.
- **Dynamic Portfolio**: Real-time calculation of Holdings, Net Worth, and P/L (Profit & Loss).

### ⚙️ Settings & Customization
- **Account Management**: View paper trading account details (Account ID, Region, Plan).
- **Danger Zone**: One-click reset functionality to wipe portfolio data and restart your trading journey.
- **Theme Persistence**: Seamless Light/Dark mode toggling that remembers your preference across sessions.
- **Currency Support**: Switch between **INR (₹)** and **USD ($)** display modes.

### 🎨 Premium UI/UX
- **Glassmorphism 2.0**: Modern, translucent UI elements with backdrop blurring and refined gradients.
- **Skeleton Loaders**: Premium loading states for smooth data fetching transitions.
- **Interactive Visuals**: Custom HTML5 Canvas particle animations on auth pages.
- **Responsive Layout**: Fully optimized for desktop, tablet, and mobile displays.

---

## 🛠 Technology Stack

### Frontend (Client)
- **Framework**: [React 19](https://react.dev/) (via [Vite](https://vitejs.dev/))
- **Routing**: React Router DOM v7
- **State Management**: React Context API (Theme, Auth, Price)
- **Real-Time**: Socket.io Client
- **Visualization**: Recharts, Lightweight Charts
- **UI Libraries**: Sonner (Toast notifications), Lucide React (Icons)
- **Styling**: Modern CSS3, CSS Variables, Glassmorphism

### Backend (Server)
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB (Mongoose ODM)
- **Authentication**: JWT (JSON Web Tokens), Google OAuth 2.0
- **Real-Time**: Socket.io Server
- **Security**: bcryptjs (hashing), cors, dotenv

---

## ⚙️ Installation & Setup

Follow these steps to set up TradeVerse locally.

### Prerequisites
- **Node.js**: v16 or higher
- **MongoDB**: Local instance or MongoDB Atlas Connection String
- **Google Cloud Project**: For OAuth Client ID
- **OpenAI API Key** (Optional): For live AI features

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/tradeverse.git
cd tradeverse
```

### 2. Backend Configuration
Navigate to the backend folder and install dependencies:
```bash
cd backend
npm install
```

Create a `.env` file in the `backend` directory with the following variables:
```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/stock_trading_app
JWT_SECRET=your_secure_jwt_secret_key
GOOGLE_CLIENT_ID=your_google_cloud_client_id
```

Start the backend server:
```bash
npm start
# OR for development with auto-restart
npm run dev
```

### 3. Frontend Configuration
Open a new terminal, navigate to the frontend folder, and install dependencies:
```bash
cd ../frontend
npm install
```

Create a `.env` file in the `frontend` directory for AI features (optional):
```env
VITE_OPENAI_API_KEY=your_openai_api_key
VITE_ALPHA_VANTAGE_API_KEY=your_alpha_vantage_key
```

Start the development server:
```bash
npm run dev
```

Visit `http://localhost:5173` to view the application.

---

## 📂 Project Structure

```text
TradeVerse/
├── backend/
│   ├── config/         # Database connection logic
│   ├── controllers/    # Request handlers (Auth, Price, Portfolio)
│   ├── models/         # Mongoose schemas (User, Transaction)
│   ├── routes/         # API route definitions
│   └── server.js       # App entry point & Socket.io setup
│
├── frontend/
│   ├── src/
│   │   ├── components/ # Reusable UI (TradePanel, Skeleton, Charts)
│   │   ├── context/    # Global state (Theme, Auth, Price)
│   │   ├── pages/      # Application views (Dashboard, Company, Settings)
│   │   └── main.jsx    # React entry point
│   ├── index.css       # Global styles & variables
│   └── package.json    # Client dependencies
│
└── README.md           # Project documentation
```

## 🤝 Contributing
Contributions are welcome! Please fork the repository and submit a pull request for any features, bug fixes, or enhancements.

## 📄 License
This project is licensed under the MIT License - see the LICENSE file for details.
