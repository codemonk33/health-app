# CureAI - Health Assistant Application

## Overview
**CureAI** is a comprehensive, mobile-first health assistant application designed specifically for prioritizing accessible, unified elderly care. Built on top of React Native and Expo, the application provides an intuitive and rapid interface for users to check symptoms, securely manage health records, order medicines, and consult an AI assistant for active guidance.

## Key Features

1. **Interactive AI Chatbot (`app/components/ChatBot.tsx`)**
   - Positioned pervasively throughout the app as a floating UI layer.
   - Powered by OpenRouter (Nvidia Nemotron).
   - Detects natural language user intentions (e.g., "I need a doctor" or "Emergency!") and intelligently routes them automatically to the correct application screens while providing contextual advice based on the injected health dataset.

2. **Symptom Checker (`app/symptoms.tsx` & `app/body-part-detail.tsx`)**
   - An interactive, visual body map where users tap their affected areas.
   - Designed for accessibility by natively employing text-to-speech (`expo-speech`) to verbally prompt users.
   - Associated symptoms link directly to common conditions, graphical previews, and specialist doctor recommendations.

3. **E-Pharmacy Order System (`app/order-medicine.tsx`)**
   - Users can securely input their details and medicine quantities.
   - Leverages `expo-image-picker` enabling users to upload live shots of real prescriptions using their device's camera.
   - Integrates with the backend **MedPay APIs** (currently mocked via Postman) to handle active order states and process order cancellations securely with their API Key.

4. **Diagnostics & Lab Bookings (`app/book-diagnostics.tsx`)**
   - Built securely upon MedPay's Diagnostics services.
   - Validates user input through the Pincode Serviceability constraint.
   - Includes an ultra-fast query autocomplete for fetching real Pathology diagnostic SKUs (CBC, CBCT) directly onto the user's interface.

5. **Health Records Vault (`app/health-records.tsx`)**
   - A centralized, unified storage solution for maintaining lifetime medical history.
   - Allows users to dynamically:
     - **Scan Reports**: Utilizing Expo's native camera integrations.
     - **Import from Cloud**: Designed to abstract iCloud/G-Drive document selectors.
     - **ABHA Connection**: Mock implementation tracking 14-digit Ayushman Bharat Health Accounts (India's national framework) to securely bind clinical notes onto their platform history.

6. **Emergency & Health Tips (`app/emergency.tsx` & `app/health-tips.tsx`)**
   - Dedicated rapid views for urgent assistance shortcuts and categorized wellness articles.

## Technology Stack
- **Framework:** React Native + Expo (Expo Router for navigation)
- **Language:** TypeScript
- **State Management:** React hooks (`useState`, `useCallback`, `useMemo`)
- **AI Integrations:** OpenRouter API (Nemotron LLM)
- **Partner Integrations:** MedPay Backend APIs (Mocked Postman environment)
- **Native Hooks/Utilities:**
  - `expo-speech` (TTS voice instructions)
  - `expo-image-picker` (Native camera access)
- **Design Structure:** Modular frontend utilizing centralized Application Theme files (`app/utils/theme.ts`).

## Codebase Architecture Directory
```text
CureAI/health-app/
├── app/
│   ├── index.tsx                  # Main Gateway Dashboard
│   ├── _layout.tsx                # Context Wrapper / Expo Setup
│   ├── symptoms.tsx               # Entry Screen: Voice + Body part selection
│   ├── body-part-detail.tsx       # Symptom drilling and specialist routing
│   ├── order-medicine.tsx         # MedPay Pharmacy Integration
│   ├── book-diagnostics.tsx       # MedPay Pincode & SKU Integrations
│   ├── health-records.tsx         # Camera/Cloud/ABHA vault system
│   ├── emergency.tsx              # Panic & Helpline dashboard
│   ├── appointments.tsx           # Doctor matching flow
│   ├── components/                
│   │   └── ChatBot.tsx            # Expandable LLM interface overlay
│   └── utils/
│       ├── theme.ts               # Color and shadow dictionaries
│       ├── responsive.ts          # Normalization functions for screens capabilities
│       ├── medpay-api.ts          # MedPay fetch utilities & payload builders
│       └── chatbotRedirects.ts    # Custom NLP intent processing for AI routing
└── package.json                   # Expo specifications
```

## Local Installation & Setup

1. **Clone the repository.**
2. **Install node dependencies:**
   ```bash
   npm install
   ```
3. **Start the Metro build server:**
   ```bash
   npx expo start
   ```
4. **Run on Device/Simulator:** 
   - Scan the generated QR code via the **Expo Go app** on your personal phone.
   - Press `i` to open an iOS simulator or `a` to open an Android emulator on your desktop.

## Scaling Constraints & Future Roadmap
- Setup global State Management libraries (e.g., Redux or Zustand) to universally cache active Shopping Carts or Health Records arrays across router navigation stacks.
- Migrate the Health Vault from transient memory (`useState`) over to persistent `AsyncStorage`, SQLite, or a protected encrypted Cloud Database.
- Plug MedPay interactions from the staged `d3e10503...mock.pstmn.io` sandbox URL to their production environment variables, including actual OAuth/HMAC hashing for real application keys.
- Inject a genuine OCR module to natively parse prescription images into structured arrays during the scanning processes.
