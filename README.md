# Health Assistant - Elderly Care App

A comprehensive React Native (Expo CLI) mobile application designed specifically for elderly users to help identify possible health symptoms using an image-based selection system.

## 🎯 Features

### 🏠 **Home Page**
- Three large, clearly labeled clickable buttons
- Senior-friendly UI with large text and high contrast
- Easy navigation to symptom selection, emergency help, and health tips

### 🔍 **Symptom Selection Screen**
- Interactive 3D male human body model (neutral pose)
- Audio instruction: "Select the part where you are having a problem"
- Tap-to-select body parts (head, eyes, arms, legs, torso, etc.)
- Visual feedback for selected body parts

### 🖼️ **Body Part Detail Screen**
- Grid of medical images related to the selected body part
- Clear symptom descriptions and visual representations
- Tap-to-analyze functionality for AI processing

### 🤖 **AI Analysis Result Page**
- Comprehensive health report including:
  - **Possible causes** of symptoms
  - **Basic treatment suggestions**
  - **When to seek a doctor**
  - **Recommended healthy foods for recovery**
- Large, readable text optimized for elderly users
- Severity indicators (Low/Medium/High risk)

### 🚨 **Emergency Help Screen**
- Quick access to emergency contacts (911, Poison Control, Local Hospital)
- List of emergency symptoms requiring immediate attention
- One-tap calling functionality
- Clear instructions for emergency situations

### 💡 **Health Tips Screen**
- Daily wellness advice categorized by:
  - Daily Exercise
  - Nutrition
  - Mental Health
  - Safety
  - Medication
- Practical tips for maintaining health and wellness

## 🛠️ Technology Stack

- **React Native**: Cross-platform mobile development
- **Expo CLI**: Development platform and tools
- **Expo Router**: File-based routing
- **TypeScript**: Type-safe development
- **React Three Fiber**: 3D graphics rendering
- **Expo Speech**: Text-to-speech functionality
- **Expo AV**: Audio/Video capabilities
- **React Native Vector Icons**: Beautiful icons

## 📱 Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- Expo CLI
- iOS Simulator or Android Emulator (optional)

### Installation Steps

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd cureAi
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npx expo start
   ```

4. **Run on device/simulator**
   - Press `i` for iOS simulator
   - Press `a` for Android emulator
   - Scan QR code with Expo Go app on your phone

## 🏗️ Project Structure

```
app/
├── _layout.tsx                    # Navigation layout
├── index.tsx                     # Home page with 3 main buttons
├── symptoms.tsx                  # 3D body model and symptom selection
├── body-part-detail.tsx          # Medical images grid
├── ai-analysis.tsx               # AI analysis results
├── emergency.tsx                 # Emergency contacts and help
├── health-tips.tsx               # Daily wellness tips
└── components/
    └── BodyModel.tsx             # 3D male body model component
```

## 🎨 Design Features

### Elderly-Friendly Design
- **Large Text**: Minimum 16px font sizes
- **High Contrast**: Clear color combinations
- **Simple Navigation**: Intuitive button layouts
- **Touch-Friendly**: Large touch targets (minimum 44px)
- **Clear Icons**: Meaningful visual representations

### Accessibility Features
- **Audio Instructions**: Text-to-speech for key interactions
- **Visual Feedback**: Clear selection indicators
- **Consistent Layout**: Predictable navigation patterns
- **Error Prevention**: Confirmation dialogs for important actions

## 🔧 Key Components

### 3D Body Model
- Built with React Three Fiber
- Interactive male human body model
- Rotatable and zoomable
- Neutral standing pose
- Color-coded body parts

### AI Analysis System
- Mock AI analysis (ready for real AI integration)
- Comprehensive health reports
- Severity assessment
- Treatment recommendations
- Nutritional advice

### Audio Integration
- Text-to-speech instructions
- Configurable speech rate and pitch
- Error handling for speech failures

## 🚀 Usage Guide

### For Elderly Users

1. **Start the App**
   - Open the app on your device
   - You'll see three large buttons on the home screen

2. **Check Symptoms**
   - Tap "Check Symptoms" button
   - Listen to the audio instruction
   - Tap on the 3D body model or use the buttons below
   - Select the body part where you're experiencing issues

3. **View Medical Images**
   - Browse through medical images related to your selected body part
   - Tap on the image that best matches your symptoms

4. **Get AI Analysis**
   - Review the comprehensive health report
   - Check the severity level
   - Read treatment suggestions and when to see a doctor

5. **Emergency Help**
   - Use the "Emergency Help" button for urgent situations
   - Quick access to emergency contacts
   - One-tap calling functionality

6. **Health Tips**
   - Access daily wellness advice
   - Browse tips by category
   - Get practical health recommendations

## 🔒 Safety & Disclaimers

### Important Notes
- **Not a Medical Device**: This app is for informational purposes only
- **Consult Healthcare Providers**: Always seek professional medical advice
- **Emergency Situations**: Call 911 for life-threatening emergencies
- **Data Privacy**: No personal health data is stored or transmitted

### Medical Disclaimer
This application is designed to provide general health information and should not replace professional medical advice, diagnosis, or treatment. Always consult with qualified healthcare providers for proper medical care.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly with elderly users
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Check the Expo documentation
- Review React Native best practices
- Open an issue in the repository
- Contact the development team

## 🔄 Future Enhancements

- **Real AI Integration**: Connect to actual AI health analysis services
- **Voice Commands**: Add voice recognition for hands-free operation
- **Caregiver Mode**: Add features for family members and caregivers
- **Health Tracking**: Integrate with health monitoring devices
- **Multilingual Support**: Add support for multiple languages
- **Offline Mode**: Enable basic functionality without internet connection

---

**Built with ❤️ for elderly care and wellness**
