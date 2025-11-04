# Health Assistant (Expo + TypeScript)

A senior-friendly React Native app to help identify symptoms, get health tips, book appointments, and access emergency info. Includes an AI ChatBot on the home screen with smart redirects.

## 🎯 Core Features

- **Home**: Large, high-contrast actions for Symptoms, Emergency, Health Tips, Appointments, Medicine
- **ChatBot**: Floating AI assistant with OpenRouter integration, intent detection, and auto-redirects
- **Symptoms**: Body-part-driven flow → images → AI analysis summary
- **AI Analysis**: Possible causes, basic treatment, when to see a doctor, recommended foods, severity
- **Emergency**: India-focused numbers (102/108/112/etc.), symptoms requiring urgent help, legal rights
- **Health Tips**: Curated categories (Exercise, Nutrition, Mental Health, Safety, Medication)

## 🧠 ChatBot

- Floating button on the home screen (opens an in-app chat panel)
- Uses OpenRouter Chat Completions API (Nemotron free model configured)
- Smart intent detection and redirects:
  - “Suggest me a doctor” → `/appointments` (with specialty detection when possible)
  - “I have chest pain” → emergency alert → `/emergency`
  - “Check my symptoms” → `/symptoms`
  - “Health tips” → `/health-tips`
  - “Order medicine” → `/order-medicine`
- Optimized keyboard behavior: chat panel pops above the keyboard; input never hidden

## 🛠️ Tech Stack

- React Native (Expo) + TypeScript
- Expo Router
- OpenRouter API (chat)
- React Native Vector Icons
- Safe Area Context

## 📦 Setup

1) Install
```bash
npm install
```

2) Configure OpenRouter
- Create an API key at `https://openrouter.ai/`
- In `app/components/ChatBot.tsx`, set:
  - `OPENROUTER_API_KEY = 'YOUR_KEY'`
  - Optionally update `HTTP-Referer` and `X-Title`

3) Android keyboard optimization
- Already configured in `app.json`:
  - `android.windowSoftInputMode: "adjustResize"`
  - `android.edgeToEdgeEnabled: true`

4) Run
```bash
npx expo start
# press i (iOS) or a (Android) or scan QR with Expo Go
```

## 🏗️ Project Structure

```
app/
├── _layout.tsx
├── index.tsx                # Home (ChatBot mounted here)
├── symptoms.tsx
├── body-part-detail.tsx
├── ai-analysis.tsx
├── emergency.tsx
├── health-tips.tsx
├── appointments.tsx
├── order-medicine.tsx
├── components/
│   └── ChatBot.tsx
└── utils/
    ├── aiAnalysisData.ts
    ├── chatbotContext.ts
    └── chatbotRedirects.ts
```

## 🧭 Usage Tips

- Open the ChatBot and type your question. Quick Actions help first-time users.
- For booking, mention specialties (e.g., “cardiologist”) to pre-fill appointments.
- Emergency phrases trigger alerts and redirect to the emergency page.

## 🔒 Safety & Disclaimer

- Not a medical device; for general information only
- Always consult a healthcare professional for serious concerns
- For emergencies in India, call 102/108 immediately

## 🧪 Scripts

```bash
npm run start      # same as npx expo start
npm run android    # open Android
npm run ios        # open iOS
```

## 📝 License

MIT

---

Built with ❤️ for accessible, elder-friendly care
