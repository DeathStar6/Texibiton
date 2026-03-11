# Smart Retail Assistant

An AI-powered web application that analyzes product reviews and generates clear insights including Pros, Cons, Sentiment Score, and Overall Summary.

![Smart Retail Assistant](https://img.shields.io/badge/Next.js-14-black) ![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4-blue) ![Gemini](https://img.shields.io/badge/Google%20Gemini-AI-green)

## Features

- **AI-Powered Analysis** - Uses Google Gemini to analyze product reviews
- **Multiple Input Methods** - Paste review text or enter a product URL
- **Structured Insights** - Get overall rating, sentiment, pros, cons, and summary
- **Modern UI** - Clean dashboard with dark/light mode support
- **Responsive Design** - Works on desktop, tablet, and mobile
- **Copy & Share** - Easy sharing of analysis results

## Prerequisites

Before you begin, make sure you have the following installed:

1. **Node.js** (version 18 or higher)
   - Download from: https://nodejs.org/
   - To check if installed, run: `node --version`

2. **npm** (comes with Node.js)
   - To check if installed, run: `npm --version`

3. **Google Gemini API Key** (free)
   - Get it from: https://aistudio.google.com/app/apikey

## Installation

### Step 1: Download or Clone the Project

If you have Git installed:
```bash
git clone <repository-url>
cd smart-retail-assistant
```

Or simply download and extract the project folder.

### Step 2: Open Terminal/Command Prompt

Navigate to the project folder:
```bash
cd path/to/smart-retail-assistant
```

### Step 3: Install Dependencies

Run this command to install all required packages:
```bash
npm install
```

Wait for the installation to complete (this may take 1-2 minutes).

### Step 4: Set Up Your API Key

1. Open the `.env` file in the project root folder
2. Add your Gemini API key:

```
GEMINI_API_KEY=your_api_key_here
```

**How to get a free Gemini API Key:**
1. Go to https://aistudio.google.com/app/apikey
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy the generated key
5. Paste it in the `.env` file

### Step 5: Run the Application

Start the development server:
```bash
npm run dev
```

You should see output like:
```
▲ Next.js 14.x
- Local: http://localhost:3000
✓ Ready
```

### Step 6: Open in Browser

Open your web browser and go to:
```
http://localhost:3000
```

## How to Use

1. **Choose Input Method**
   - Click "Paste Reviews" to enter review text manually
   - Click "Product URL" to analyze a product page

2. **Enter Reviews**
   - For text: Paste multiple product reviews in the text area
   - For URL: Enter any product page URL (demo data will be used)
   - Click "Load Sample" for example reviews

3. **Analyze**
   - Click the "Analyze with AI" button
   - Wait for the AI to process (usually 2-5 seconds)

4. **View Results**
   - Overall Score (rating out of 5)
   - Sentiment (Positive/Negative/Mixed/Neutral)
   - Pros list
   - Cons list
   - Summary

5. **Share Results**
   - Click "Copy Results" to copy to clipboard
   - Click "Share" to share via your device

## Project Structure

```
smart-retail-assistant/
├── app/
│   ├── api/
│   │   └── analyze/
│   │       └── route.ts      # API endpoint
│   ├── globals.css           # Global styles
│   ├── layout.tsx            # App layout
│   └── page.tsx              # Home page
├── components/
│   ├── ReviewInput/          # Input component
│   ├── ResultCards/          # Results display
│   ├── SentimentChart/       # Sentiment visualization
│   ├── ThemeProvider.tsx     # Dark mode provider
│   └── ThemeToggle.tsx       # Dark/light toggle
├── lib/
│   ├── ai.ts                 # Gemini AI integration
│   └── types.ts              # TypeScript types
├── .env                      # API key (create this)
├── .env.example              # Example env file
├── package.json              # Dependencies
└── README.md                 # This file
```

## Troubleshooting

### "npm command not found"
- Make sure Node.js is installed correctly
- Restart your terminal after installing Node.js

### "Port 3000 is already in use"
- The app will automatically try port 3001
- Or stop other applications using port 3000

### "API Error" or Analysis fails
- Check if your Gemini API key is correct in `.env`
- Make sure there are no extra spaces in the API key
- Restart the server after changing `.env`: press `Ctrl+C` and run `npm run dev` again

### PowerShell Script Error (Windows)
If you see "running scripts is disabled", run this first:
```powershell
Set-ExecutionPolicy -ExecutionPolicy Bypass -Scope Process
```

## Tech Stack

- **Frontend**: Next.js 14, React, TailwindCSS
- **Backend**: Next.js API Routes
- **AI**: Google Gemini 1.5 Flash
- **Icons**: Lucide React
- **Theme**: next-themes (dark/light mode)

## Scripts

| Command | Description |
|---------|-------------|
| `npm install` | Install dependencies |
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Start production server |

## License

This project is open source and available for hackathon demonstrations.

---

Built with Next.js, TailwindCSS, and Google Gemini
