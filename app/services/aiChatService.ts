import { getHealthDataContext } from '../utils/chatbotContext';
import { detectRedirectIntent, RedirectType } from '../utils/chatbotRedirects';

export interface EmbeddedHealthCard {
  type: 'doctor' | 'medicine' | 'lab_test' | 'vital_alert' | 'emergency';
  title: string;
  subtitle: string;
  actionText: string;
  route: string;
  icon: string;
  data?: any;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  embeddedCard?: EmbeddedHealthCard;
}

const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions';
const OPENROUTER_API_KEY = process.env.EXPO_PUBLIC_OPENROUTER_API_KEY || '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';

export interface ConversationThread {
  id: string;
  title: string;
  timestampStr: string;
  messages: ChatMessage[];
  suggestedPills?: string[];
}

export const RECENT_CONVERSATIONS: ConversationThread[] = [
  {
    id: 'conv_vitamin_d',
    title: 'Is my Vitamin D level okay?',
    timestampStr: '10:30 AM',
    suggestedPills: ['Yes, suggest please', 'What foods help?', 'How much sunlight?'],
    messages: [
      {
        id: 'msg_v1',
        role: 'user',
        content: 'Is my blood sugar level normal?',
        timestamp: new Date(Date.now() - 1000 * 60 * 15),
      },
      {
        id: 'msg_v2',
        role: 'assistant',
        content: 'Hey Ramesh,\nYes, your fasting blood sugar (98 mg/dL) is within the normal range (70-100 mg/dL).',
        timestamp: new Date(Date.now() - 1000 * 60 * 14),
      },
      {
        id: 'msg_v3',
        role: 'user',
        content: 'What about my Vitamin D?',
        timestamp: new Date(Date.now() - 1000 * 60 * 5),
      },
      {
        id: 'msg_v4',
        role: 'assistant',
        content: "Your Vitamin D is a bit low (18 ng/mL). It's common!\nYou can improve it with sunlight, foods like salmon, eggs and maybe a supplement. Want me to suggest some options?",
        timestamp: new Date(Date.now() - 1000 * 60 * 4),
      },
    ],
  },
  {
    id: 'conv_cbc',
    title: 'Explain my CBC report',
    timestampStr: 'Yesterday',
    suggestedPills: ['Is my hemoglobin normal?', 'Should I take iron?', 'Share with doctor'],
    messages: [
      {
        id: 'msg_cbc1',
        role: 'user',
        content: 'Can you analyze my recent Complete Blood Count (CBC) report?',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24),
      },
      {
        id: 'msg_cbc2',
        role: 'assistant',
        content: 'Your CBC report shows a healthy Total White Blood Count (7,200/µL) and Platelets (240,000/µL). Your Hemoglobin is 13.6 g/dL, which is optimal for your age.',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 + 1000),
      },
    ],
  },
  {
    id: 'conv_sleep',
    title: 'Best food for better sleep?',
    timestampStr: '2 days ago',
    suggestedPills: ['Best herbal teas', 'Bedtime routine tips', 'Melatonin safe?'],
    messages: [
      {
        id: 'msg_sl1',
        role: 'user',
        content: 'I have trouble sleeping past 4 AM. What natural foods or remedies help?',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48),
      },
      {
        id: 'msg_sl2',
        role: 'assistant',
        content: 'Warm turmeric milk with a pinch of nutmeg, a handful of almonds or walnuts, and chamomile tea are excellent natural aids for seniors to improve deep melatonin production.',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48 + 1000),
      },
    ],
  },
  {
    id: 'conv_lab',
    title: 'How do I book a lab test?',
    timestampStr: '3 days ago',
    suggestedPills: ['Book Senior Health Package', 'Fasting required?', 'Home sample collection'],
    messages: [
      {
        id: 'msg_lb1',
        role: 'user',
        content: 'How do I book a home blood sample collection?',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 72),
      },
      {
        id: 'msg_lb2',
        role: 'assistant',
        content: 'You can easily book our NABL-certified Home Sample Collection! A certified phlebotomist will arrive at your home with safe vacuum containers.',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 72 + 1000),
        embeddedCard: {
          type: 'lab_test',
          title: 'Senior Citizen Health Package',
          subtitle: '68 tests including HbA1c, Lipid, Kidney Profile • ₹1,299',
          actionText: 'Book Home Sample Collection',
          route: '/book-diagnostics',
          icon: 'pulse',
        },
      },
    ],
  },
];

export const aiChatService = {
  getRecentConversations(): ConversationThread[] {
    return RECENT_CONVERSATIONS;
  },

  getInitialMessages(): ChatMessage[] {
    return [
      {
        id: 'msg_welcome',
        role: 'assistant',
        content: 'Namaste! I am Nex AI, your personal health buddy. How can I help you get smarter about your health today?',
        timestamp: new Date(),
      }
    ];
  },

  async sendMessage(userText: string, messageHistory: ChatMessage[]): Promise<{
    assistantMessage: ChatMessage;
    redirectIntent?: { type: RedirectType; params?: Record<string, string>; confidence: number } | null;
    suggestedPills?: string[];
  }> {
    const trimmed = userText.trim();
    const intent = detectRedirectIntent(trimmed);

    // Contextual health data injection
    const healthContext = getHealthDataContext();

    // Check for direct embedded card suggestions based on intent or query
    let embeddedCard: EmbeddedHealthCard | undefined;
    const lower = trimmed.toLowerCase();

    if (lower.includes('doctor') || lower.includes('cardiologist') || lower.includes('appointment')) {
      embeddedCard = {
        type: 'doctor',
        title: 'Recommended: Dr. Aisha Verma',
        subtitle: 'Cardiologist • 4.9 ★ • Next slot: Today 04:30 PM',
        actionText: 'Book Video Consultation',
        route: '/appointments?specialty=Cardiologist',
        icon: 'calendar',
      };
    } else if (lower.includes('medicine') || lower.includes('tablet') || lower.includes('order') || lower.includes('refill')) {
      embeddedCard = {
        type: 'medicine',
        title: 'Medicine Quick Refill',
        subtitle: 'Telmisartan 40mg & Metformin 500mg available for 2hr delivery',
        actionText: 'Order Medicines',
        route: '/order-medicine',
        icon: 'cart',
      };
    } else if (lower.includes('blood test') || lower.includes('lab') || lower.includes('sugar test') || lower.includes('checkup')) {
      embeddedCard = {
        type: 'lab_test',
        title: 'Senior Citizen Health Package',
        subtitle: '68 tests including HbA1c, Lipid, Kidney Profile • ₹1,299',
        actionText: 'Book Home Sample Collection',
        route: '/book-diagnostics',
        icon: 'pulse',
      };
    } else if (lower.includes('chest pain') || lower.includes('choking') || lower.includes('fainted') || lower.includes('emergency')) {
      embeddedCard = {
        type: 'emergency',
        title: 'Urgent Medical Emergency',
        subtitle: 'Call 108 Unified Ambulance Helpline immediately',
        actionText: 'Open Emergency SOS',
        route: '/emergency',
        icon: 'warning',
      };
    }

    try {
      const response = await fetch(OPENROUTER_API_URL, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
          'HTTP-Referer': 'https://cureai.health',
          'X-Title': 'CureAI Health Assistant',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'nvidia/nemotron-nano-12b-v2-vl:free',
          messages: [
            {
              role: 'system',
              content: `You are NEX-AI, a gentle, highly empathetic, and clinically sound medical AI assistant for elderly care in India.
Current Health Context of the Senior Patient:
${healthContext}

Guidelines:
- Keep sentences concise, warm, respectful, and simple.
- Emphasize safety and non-medical diagnosis: give practical care tips and remind to consult physicians.
- If emergency symptoms occur, immediately advise dialing 108/102 in India.`,
            },
            ...messageHistory.map(m => ({ role: m.role, content: m.content })),
            { role: 'user', content: trimmed },
          ],
        }),
      });

      let suggestedPills: string[] = ['Tell me more', 'What precautions to take?', 'Suggest lifestyle tips'];
      if (lower.includes('sugar') || lower.includes('glucose') || lower.includes('diabetes')) {
        suggestedPills = ['What about my Vitamin D?', 'Fasting sugar range', 'Best diet plan'];
      } else if (lower.includes('vitamin') || lower.includes('d3') || lower.includes('calcium')) {
        suggestedPills = ['Yes, suggest please', 'What foods help?', 'How much sunlight?'];
      } else if (lower.includes('cbc') || lower.includes('report') || lower.includes('blood test')) {
        suggestedPills = ['Is my hemoglobin normal?', 'Should I take iron?', 'Share with doctor'];
      } else if (lower.includes('bp') || lower.includes('pressure') || lower.includes('heart')) {
        suggestedPills = ['Morning vs evening BP', 'Salt reduction tips', 'Book cardiologist'];
      }

      if (response.ok) {
        const data = await response.json();
        const content = data.choices?.[0]?.message?.content || 'I am here to support your health. Could you please specify your question?';
        return {
          assistantMessage: {
            id: `msg_${Date.now()}`,
            role: 'assistant',
            content,
            timestamp: new Date(),
            embeddedCard,
          },
          redirectIntent: intent,
          suggestedPills,
        };
      }
    } catch (err) {
      console.warn('OpenRouter fetch failed, using smart offline fallback response:', err);
    }

    // Smart Local Fallback if offline
    let fallbackContent = 'I have noted your health query. Please ensure you take your scheduled medications on time and keep hydrated. For any severe symptoms, please reach out to your doctor directly.';
    let fallbackPills = ['Tell me more', 'What precautions to take?', 'Consult a doctor'];
    if (lower.includes('headache') || lower.includes('pain')) {
      fallbackContent = 'For mild headaches, rest in a quiet, dark room and drink a glass of water. If the headache is severe, sudden, or accompanied by blurred vision, please seek immediate medical evaluation.';
      fallbackPills = ['When to see a doctor?', 'Safe pain relievers', 'Track migraine'];
    } else if (lower.includes('bp') || lower.includes('blood pressure')) {
      fallbackContent = 'Your latest logged BP was in the stable range (128/82 mmHg). Continue taking your morning Telmisartan 40mg after breakfast and maintain a low-sodium diet.';
      fallbackPills = ['Log morning BP', 'Low-sodium foods', 'Doctor consultation'];
    } else if (lower.includes('sugar') || lower.includes('diabetes')) {
      fallbackContent = 'Your HbA1c is well-controlled at 6.4%. Remember to take Metformin 500mg with your meals and avoid processed sugars.';
      fallbackPills = ['What about my Vitamin D?', 'Fasting sugar range', 'Best diet plan'];
    } else if (lower.includes('vitamin')) {
      fallbackContent = "Your Vitamin D is a bit low (18 ng/mL). It's common!\nYou can improve it with sunlight, foods like salmon, eggs and maybe a supplement. Want me to suggest some options?";
      fallbackPills = ['Yes, suggest please', 'What foods help?', 'How much sunlight?'];
    }

    return {
      assistantMessage: {
        id: `msg_${Date.now()}`,
        role: 'assistant',
        content: fallbackContent,
        timestamp: new Date(),
        embeddedCard,
      },
      redirectIntent: intent,
      suggestedPills: fallbackPills,
    };
  }
};
