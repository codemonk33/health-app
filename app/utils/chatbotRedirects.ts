/**
 * Detect user intent from message and determine if redirect is needed
 */

export type RedirectType = 
  | 'appointments' 
  | 'symptoms' 
  | 'emergency' 
  | 'health-tips' 
  | 'order-medicine'
  | null;

export interface RedirectIntent {
  type: RedirectType;
  params?: Record<string, string>;
  confidence: number;
}

/**
 * Detect if user wants to book appointment or find doctor
 */
function detectAppointmentIntent(message: string): RedirectIntent | null {
  const lowerMessage = message.toLowerCase();
  
  const appointmentKeywords = [
    'doctor', 'appointment', 'book', 'schedule', 'consult', 'visit', 'physician',
    'specialist', 'cardiologist', 'dermatologist', 'neurologist', 'orthopedic',
    'gastroenterologist', 'endocrinologist', 'pulmonologist', 'urologist',
    'ophthalmologist', 'ent', 'dentist', 'psychiatrist', 'gynecologist',
    'find doctor', 'need doctor', 'want doctor', 'suggest doctor', 'recommend doctor',
    'book appointment', 'make appointment', 'schedule appointment'
  ];

  const matchedKeywords = appointmentKeywords.filter(keyword => 
    lowerMessage.includes(keyword)
  );

  if (matchedKeywords.length > 0) {
    // Try to extract specialty
    const specialties: Record<string, string> = {
      'heart': 'Cardiologist',
      'cardiac': 'Cardiologist',
      'skin': 'Dermatologist',
      'dermatology': 'Dermatologist',
      'brain': 'Neurologist',
      'neurology': 'Neurologist',
      'bone': 'Orthopedic',
      'joint': 'Orthopedic',
      'stomach': 'Gastroenterologist',
      'digestive': 'Gastroenterologist',
      'diabetes': 'Endocrinologist',
      'hormone': 'Endocrinologist',
      'lung': 'Pulmonologist',
      'breathing': 'Pulmonologist',
      'respiratory': 'Pulmonologist',
      'kidney': 'Urologist',
      'urinary': 'Urologist',
      'eye': 'Ophthalmologist',
      'vision': 'Ophthalmologist',
      'ear': 'ENT',
      'nose': 'ENT',
      'throat': 'ENT',
      'tooth': 'Dentist',
      'dental': 'Dentist',
      'mental': 'Psychiatrist',
      'psychology': 'Psychiatrist',
      'women': 'Gynecologist',
      'gynecology': 'Gynecologist',
    };

    let detectedSpecialty: string | undefined;
    for (const [keyword, specialty] of Object.entries(specialties)) {
      if (lowerMessage.includes(keyword)) {
        detectedSpecialty = specialty;
        break;
      }
    }

    return {
      type: 'appointments',
      params: detectedSpecialty ? { specialty: detectedSpecialty } : undefined,
      confidence: matchedKeywords.length > 2 ? 0.9 : 0.7,
    };
  }

  return null;
}

/**
 * Detect if user wants to check symptoms
 */
function detectSymptomsIntent(message: string): RedirectIntent | null {
  const lowerMessage = message.toLowerCase();
  
  const symptomKeywords = [
    'symptom', 'pain', 'ache', 'hurt', 'discomfort', 'problem', 'issue',
    'check symptom', 'body part', 'hurting', 'feeling unwell', 'not feeling well',
    'sick', 'illness', 'condition', 'diagnose', 'what is wrong'
  ];

  const matchedKeywords = symptomKeywords.filter(keyword => 
    lowerMessage.includes(keyword)
  );

  if (matchedKeywords.length > 0) {
    return {
      type: 'symptoms',
      confidence: matchedKeywords.length > 2 ? 0.85 : 0.65,
    };
  }

  return null;
}

/**
 * Detect if user has emergency
 */
function detectEmergencyIntent(message: string): RedirectIntent | null {
  const lowerMessage = message.toLowerCase();
  
  const emergencyKeywords = [
    'emergency', 'urgent', 'immediate', 'critical', 'serious', 'help now',
    'ambulance', 'hospital', '911', '102', '108', 'emergency help',
    'life threatening', 'can\'t breathe', 'chest pain', 'severe pain',
    'bleeding', 'unconscious', 'fainting', 'stroke', 'heart attack'
  ];

  const matchedKeywords = emergencyKeywords.filter(keyword => 
    lowerMessage.includes(keyword)
  );

  if (matchedKeywords.length > 0) {
    return {
      type: 'emergency',
      confidence: matchedKeywords.length > 2 ? 0.95 : 0.75,
    };
  }

  return null;
}

/**
 * Detect if user wants health tips
 */
function detectHealthTipsIntent(message: string): RedirectIntent | null {
  const lowerMessage = message.toLowerCase();
  
  const tipsKeywords = [
    'health tip', 'wellness', 'exercise', 'diet', 'nutrition', 'healthy',
    'fitness', 'wellbeing', 'lifestyle', 'advice', 'recommendation',
    'how to stay healthy', 'health advice', 'daily tips', 'wellness tips'
  ];

  const matchedKeywords = tipsKeywords.filter(keyword => 
    lowerMessage.includes(keyword)
  );

  if (matchedKeywords.length > 0) {
    return {
      type: 'health-tips',
      confidence: matchedKeywords.length > 2 ? 0.8 : 0.6,
    };
  }

  return null;
}

/**
 * Detect if user wants to order medicine
 */
function detectMedicineIntent(message: string): RedirectIntent | null {
  const lowerMessage = message.toLowerCase();
  
  const medicineKeywords = [
    'medicine', 'medication', 'drug', 'prescription', 'pharmacy', 'order medicine',
    'buy medicine', 'get medicine', 'deliver medicine', 'medication delivery',
    'pharmacy near me', 'need medicine'
  ];

  const matchedKeywords = medicineKeywords.filter(keyword => 
    lowerMessage.includes(keyword)
  );

  if (matchedKeywords.length > 0) {
    return {
      type: 'order-medicine',
      confidence: matchedKeywords.length > 2 ? 0.85 : 0.65,
    };
  }

  return null;
}

/**
 * Main function to detect redirect intent from user message
 */
export function detectRedirectIntent(message: string): RedirectIntent | null {
  if (!message || message.trim().length === 0) {
    return null;
  }

  // Check for emergency first (highest priority)
  const emergencyIntent = detectEmergencyIntent(message);
  if (emergencyIntent && emergencyIntent.confidence >= 0.75) {
    return emergencyIntent;
  }

  // Check for appointments
  const appointmentIntent = detectAppointmentIntent(message);
  if (appointmentIntent && appointmentIntent.confidence >= 0.7) {
    return appointmentIntent;
  }

  // Check for symptoms
  const symptomsIntent = detectSymptomsIntent(message);
  if (symptomsIntent && symptomsIntent.confidence >= 0.65) {
    return symptomsIntent;
  }

  // Check for medicine
  const medicineIntent = detectMedicineIntent(message);
  if (medicineIntent && medicineIntent.confidence >= 0.65) {
    return medicineIntent;
  }

  // Check for health tips
  const tipsIntent = detectHealthTipsIntent(message);
  if (tipsIntent && tipsIntent.confidence >= 0.6) {
    return tipsIntent;
  }

  return null;
}

