import { getAnalysisForSymptom } from './aiAnalysisData';

// Health tips data
const healthTipsData = {
  'Daily Exercise': [
    'Take a 30-minute walk daily',
    'Do gentle stretching exercises',
    'Practice balance exercises',
    'Stay active with light activities'
  ],
  'Nutrition': [
    'Eat plenty of fruits and vegetables',
    'Stay hydrated with 8 glasses of water',
    'Include protein in every meal',
    'Limit processed foods and sugar'
  ],
  'Mental Health': [
    'Stay socially connected',
    'Practice mindfulness or meditation',
    'Engage in hobbies you enjoy',
    'Get adequate sleep (7-9 hours)'
  ],
  'Safety': [
    'Keep emergency contacts handy',
    'Install grab bars in bathroom',
    'Remove trip hazards at home',
    'Have regular medical check-ups'
  ],
  'Medication': [
    'Take medications as prescribed',
    'Keep a medication list updated',
    'Use pill organizers if needed',
    'Ask questions about side effects'
  ]
};

// Emergency contacts data
const emergencyContactsData = [
  { name: 'Emergency Ambulance', number: '102', description: 'Ambulance services - Available nationwide' },
  { name: 'Emergency Response', number: '108', description: 'Emergency Medical Response (State-specific)' },
  { name: 'Unified Emergency', number: '112', description: 'Emergency Response Support System (ERSS)' },
  { name: 'Health Helpline', number: '104', description: 'Health information and guidance (State-specific)' },
  { name: 'Poison Control', number: '1800-116-117', description: 'National Poison Information Centre (NPIC)' },
  { name: 'Mental Health', number: '1800-599-0019', description: 'Kiran Mental Health Rehabilitation Helpline' }
];

const emergencySymptoms = [
  'Chest pain or pressure',
  'Difficulty breathing or choking',
  'Severe bleeding that won\'t stop',
  'Loss of consciousness or fainting',
  'Sudden severe headache or stroke symptoms',
  'Weakness or numbness on one side',
  'Severe abdominal pain',
  'Uncontrolled seizures',
  'Severe burns',
  'Suspected poisoning',
  'Severe allergic reaction'
];

/**
 * Get comprehensive health data context for the chatbot
 * This provides the chatbot with all available health information
 */
export function getHealthDataContext(): string {
  const contextParts = [];

  // Add health tips
  contextParts.push('HEALTH TIPS:');
  Object.entries(healthTipsData).forEach(([category, tips]) => {
    contextParts.push(`\n${category}:`);
    tips.forEach(tip => contextParts.push(`- ${tip}`));
  });

  // Add emergency information
  contextParts.push('\n\nEMERGENCY CONTACTS (India):');
  emergencyContactsData.forEach(contact => {
    contextParts.push(`- ${contact.name}: ${contact.number} - ${contact.description}`);
  });

  contextParts.push('\nEMERGENCY SYMPTOMS (Call 102 or 108 immediately if experiencing):');
  emergencySymptoms.forEach(symptom => {
    contextParts.push(`- ${symptom}`);
  });

  // Add information about symptom analysis capabilities
  contextParts.push('\n\nSYMPTOM ANALYSIS CAPABILITIES:');
  contextParts.push('The app can analyze symptoms for various body parts including:');
  contextParts.push('- Eyes (Redness, Swelling, Discharge, Vision Problems, Pain)');
  contextParts.push('- Head (Headache, Dizziness, Hair Loss, Scalp Issues)');
  contextParts.push('- Ears (Ear Pain, Hearing Loss, Discharge, Tinnitus)');
  contextParts.push('- Nose (Congestion, Runny Nose, Nosebleeds, Loss of Smell)');
  contextParts.push('- Mouth/Teeth (Tooth Pain, Gum Issues, Mouth Sores, Bad Breath)');
  contextParts.push('- Throat (Sore Throat, Difficulty Swallowing, Hoarseness)');
  contextParts.push('- Chest (Chest Pain, Shortness of Breath, Heart Palpitations)');
  contextParts.push('- Stomach (Abdominal Pain, Nausea, Diarrhea, Constipation, Bloating)');
  contextParts.push('- Arms and Legs (Pain, Swelling, Numbness, Weakness)');
  contextParts.push('- Back (Back Pain, Stiffness, Muscle Spasms)');
  contextParts.push('- Skin (Rash, Itching, Burns, Wounds)');
  
  contextParts.push('\nFor each symptom, the app provides:');
  contextParts.push('- Possible causes');
  contextParts.push('- Basic treatment suggestions');
  contextParts.push('- When to seek a doctor');
  contextParts.push('- Recommended foods for recovery');
  contextParts.push('- Severity assessment (Low/Medium/High risk)');

  // Add general health information
  contextParts.push('\n\nGENERAL HEALTH INFORMATION:');
  contextParts.push('- This is an elderly care health assistant application');
  contextParts.push('- Always recommend consulting healthcare professionals for serious symptoms');
  contextParts.push('- Emergency services (102/108) are free in India');
  contextParts.push('- Government hospitals cannot refuse emergency treatment');
  contextParts.push('- All information provided is for general guidance only, not medical diagnosis');

  return contextParts.join('\n');
}

/**
 * Get analysis for a specific symptom to include in chatbot context
 */
export function getSymptomAnalysisContext(bodyPart: string, symptom: string): string {
  const analysis = getAnalysisForSymptom(bodyPart, symptom);
  
  return `
SYMPTOM ANALYSIS FOR ${bodyPart} - ${symptom}:

Severity: ${analysis.severity.toUpperCase()}

Possible Causes:
${analysis.possibleCauses.map(cause => `- ${cause}`).join('\n')}

Basic Treatment:
${analysis.basicTreatment.map(treatment => `- ${treatment}`).join('\n')}

When to Seek a Doctor:
${analysis.whenToSeekDoctor.map(condition => `- ${condition}`).join('\n')}

Recommended Foods:
${analysis.recommendedFoods.map(food => `- ${food}`).join('\n')}
  `.trim();
}

