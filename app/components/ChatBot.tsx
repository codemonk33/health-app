import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert,
  Keyboard,
  useWindowDimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { getHealthDataContext } from '../utils/chatbotContext';
import { detectRedirectIntent, RedirectType } from '../utils/chatbotRedirects';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const OPENROUTER_API_KEY = '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';
const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions';

// Memoize health context to avoid recalculating on every render
let cachedHealthContext: string | null = null;
function getCachedHealthContext() {
  if (!cachedHealthContext) {
    cachedHealthContext = getHealthDataContext();
  }
  return cachedHealthContext;
}

export default function ChatBot() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { height: screenHeight } = useWindowDimensions();
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: 'Hello! I\'m your health assistant. I can help you with questions about symptoms, health tips, emergency information, and general health advice. How can I help you today?',
      timestamp: new Date(),
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isMinimized, setIsMinimized] = useState(true);
  const scrollViewRef = useRef<ScrollView>(null);
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const [keyboardVisible, setKeyboardVisible] = useState(false);

  // Memoize health context
  const healthContext = useMemo(() => getCachedHealthContext(), []);

  const scrollToBottom = useCallback(() => {
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  }, []);

  useEffect(() => {
    if (messages.length > 0) {
      scrollToBottom();
    }
  }, [messages, scrollToBottom]);

  // Keyboard listeners to adjust height so the sheet sits on the keyboard
  useEffect(() => {
    const showEvent = Platform.OS === 'android' ? 'keyboardDidShow' : 'keyboardWillShow';
    const hideEvent = Platform.OS === 'android' ? 'keyboardDidHide' : 'keyboardWillHide';

    const onShow = (e: any) => {
      setKeyboardVisible(true);
      setKeyboardHeight(e?.endCoordinates?.height || 0);
    };
    const onHide = () => {
      setKeyboardVisible(false);
      setKeyboardHeight(0);
    };

    const subShow = Keyboard.addListener(showEvent, onShow);
    const subHide = Keyboard.addListener(hideEvent, onHide);

    return () => {
      subShow.remove();
      subHide.remove();
    };
  }, []);

  // Compute dynamic chat height to "pop" onto keyboard
  const chatHeight = useMemo(() => {
    const maxHeight = Math.min(screenHeight * 0.9, 560);
    const baseHeight = Math.max(420, screenHeight * 0.55);
    if (!keyboardVisible) return Math.min(maxHeight, baseHeight);
    const available = screenHeight - keyboardHeight - insets.bottom - 16;
    return Math.max(360, Math.min(maxHeight, available));
  }, [keyboardVisible, keyboardHeight, screenHeight, insets.bottom]);

  // Handle navigation based on redirect type
  const handleRedirect = useCallback((type: RedirectType, params?: Record<string, string>) => {
    if (!type) return;

    let route = '';
    switch (type) {
      case 'appointments':
        route = params?.specialty 
          ? `/appointments?specialty=${encodeURIComponent(params.specialty)}`
          : '/appointments';
        break;
      case 'symptoms':
        route = '/symptoms';
        break;
      case 'emergency':
        route = '/emergency';
        break;
      case 'health-tips':
        route = '/health-tips';
        break;
      case 'order-medicine':
        route = '/order-medicine';
        break;
      default:
        return;
    }

    // Minimize chat before navigation
    setIsMinimized(true);
    
    // Small delay to allow chat to minimize smoothly
    setTimeout(() => {
      router.push(route as any);
    }, 300);
  }, [router]);

  const sendMessage = useCallback(async () => {
    if (!inputText.trim() || isLoading) return;

    const userMessageText = inputText.trim();
    const userMessage: Message = {
      role: 'user',
      content: userMessageText,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);

    // Check for redirect intent before sending to API
    const redirectIntent = detectRedirectIntent(userMessageText);
    
    if (redirectIntent && redirectIntent.confidence >= 0.7) {
      // Show confirmation before redirecting
      const redirectMessages: Record<RedirectType, string> = {
        'appointments': 'I can help you book an appointment with a doctor. Let me take you to the appointments page.',
        'symptoms': 'I can help you check your symptoms. Let me take you to the symptom checker.',
        'emergency': 'This sounds like an emergency! Let me take you to the emergency help page immediately.',
        'health-tips': 'I can show you helpful health tips. Let me take you to the health tips page.',
        'order-medicine': 'I can help you order medicine. Let me take you to the medicine ordering page.',
        null: '',
      };

      const confirmationMessage = redirectMessages[redirectIntent.type!];
      
      // Add assistant message about redirect
      const redirectMessage: Message = {
        role: 'assistant',
        content: confirmationMessage,
        timestamp: new Date(),
      };
      
      setMessages((prev) => [...prev, redirectMessage]);
      setIsLoading(false);

      // Show alert and redirect
      setTimeout(() => {
        if (redirectIntent.type === 'emergency') {
          Alert.alert(
            'Emergency Detected',
            'Taking you to emergency help. For immediate assistance, call 102 or 108.',
            [
              {
                text: 'OK',
                onPress: () => handleRedirect(redirectIntent.type!, redirectIntent.params),
              },
            ]
          );
        } else {
          handleRedirect(redirectIntent.type!, redirectIntent.params);
        }
      }, 1000);
      return;
    }

    try {
      // Make API call
      const response = await fetch(OPENROUTER_API_URL, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
          'HTTP-Referer': 'https://health-assistant-app.com',
          'X-Title': 'Health Assistant App',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'nvidia/nemotron-nano-12b-v2-vl:free',
          messages: [
            {
              role: 'system' as const,
              content: `You are a helpful health assistant for an elderly care mobile application. You have access to comprehensive health data including:

${healthContext}

IMPORTANT GUIDELINES:
- Always provide clear, easy-to-understand advice
- Use simple language suitable for elderly users
- If asked about symptoms, provide helpful information but always remind users to consult a doctor for serious concerns
- For emergency situations, direct users to call emergency services (102 or 108 in India)
- Be empathetic and supportive
- Never provide medical diagnoses - only general information and guidance
- Always recommend consulting healthcare professionals for serious symptoms`,
            },
            ...messages.map((msg) => ({
              role: msg.role,
              content: msg.content,
            })),
            {
              role: 'user' as const,
              content: userMessageText,
            },
          ],
        }),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();
      let assistantContent = data.choices?.[0]?.message?.content || 'I apologize, but I encountered an error. Please try again.';
      
      // Check if response contains redirect intent
      const responseRedirectIntent = detectRedirectIntent(assistantContent);
      if (responseRedirectIntent && responseRedirectIntent.confidence >= 0.7) {
        const redirectMessages: Record<RedirectType, string> = {
          'appointments': 'I can help you book an appointment. Would you like me to take you to the appointments page?',
          'symptoms': 'I can help you check your symptoms. Would you like me to take you to the symptom checker?',
          'emergency': 'This sounds serious! Let me take you to the emergency help page immediately.',
          'health-tips': 'I can show you helpful health tips. Would you like me to take you there?',
          'order-medicine': 'I can help you order medicine. Would you like me to take you to the medicine ordering page?',
          null: '',
        };
        assistantContent = redirectMessages[responseRedirectIntent.type!] || assistantContent;
      }

      const assistantMessage: Message = {
        role: 'assistant',
        content: assistantContent,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);

      // Auto-redirect if high confidence intent detected in response
      if (responseRedirectIntent && responseRedirectIntent.confidence >= 0.85) {
        setTimeout(() => {
          handleRedirect(responseRedirectIntent.type!, responseRedirectIntent.params);
        }, 2000);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage: Message = {
        role: 'assistant',
        content: 'I apologize, but I\'m having trouble connecting right now. Please check your internet connection and try again, or consult a healthcare professional for urgent matters.',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  }, [inputText, isLoading, healthContext, messages, handleRedirect]);

  if (isMinimized) {
    return (
      <TouchableOpacity
        style={styles.chatButton}
        onPress={() => setIsMinimized(false)}
        activeOpacity={0.8}
      >
        <Ionicons name="chatbubbles" size={28} color="#ffffff" />
        <View style={styles.notificationBadge}>
          <Text style={styles.notificationText}>AI</Text>
        </View>
      </TouchableOpacity>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={'padding'}
      keyboardVerticalOffset={insets.top}
    >
      <View style={[styles.chatContainer, { height: chatHeight }]}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Ionicons name="medical" size={24} color="#3498db" />
            <Text style={styles.headerTitle}>Health Assistant</Text>
          </View>
          <TouchableOpacity
            onPress={() => setIsMinimized(true)}
            style={styles.minimizeButton}
          >
            <Ionicons name="chevron-down" size={24} color="#2c3e50" />
          </TouchableOpacity>
        </View>

        {/* Messages */}
        <ScrollView
          ref={scrollViewRef}
          style={styles.messagesContainer}
          contentContainerStyle={[styles.messagesContent, { paddingBottom: 8 + insets.bottom + 64 }]}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          automaticallyAdjustKeyboardInsets={true}
          onContentSizeChange={scrollToBottom}
        >
          {messages.map((message, index) => (
            <View
              key={`${message.timestamp.getTime()}-${index}`}
              style={[
                styles.messageWrapper,
                message.role === 'user' ? styles.userMessageWrapper : styles.assistantMessageWrapper,
              ]}
            >
              <View
                style={[
                  styles.messageBubble,
                  message.role === 'user' ? styles.userMessage : styles.assistantMessage,
                ]}
              >
                <Text
                  style={[
                    styles.messageText,
                    message.role === 'user' ? styles.userMessageText : styles.assistantMessageText,
                  ]}
                >
                  {message.content}
                </Text>
              </View>
            </View>
          ))}
          {isLoading && (
            <View style={styles.loadingWrapper}>
              <View style={styles.assistantMessage}>
                <ActivityIndicator size="small" color="#3498db" />
                <Text style={styles.loadingText}>Thinking...</Text>
              </View>
            </View>
          )}
        </ScrollView>

        {/* Quick Action Buttons */}
        {messages.length <= 2 && (
          <View style={styles.quickActionsContainer}>
            <Text style={styles.quickActionsTitle}>Quick Actions:</Text>
            <View style={styles.quickActionsRow}>
              <TouchableOpacity
                style={styles.quickActionButton}
                onPress={() => {
                  setInputText('I need to book an appointment with a doctor');
                  setTimeout(() => sendMessage(), 100);
                }}
              >
                <Ionicons name="calendar" size={16} color="#3498db" />
                <Text style={styles.quickActionText}>Book Doctor</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.quickActionButton}
                onPress={() => {
                  setInputText('I have some symptoms I want to check');
                  setTimeout(() => sendMessage(), 100);
                }}
              >
                <Ionicons name="medical" size={16} color="#3498db" />
                <Text style={styles.quickActionText}>Check Symptoms</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.quickActionButton}
                onPress={() => {
                  setInputText('Show me health tips');
                  setTimeout(() => sendMessage(), 100);
                }}
              >
                <Ionicons name="heart" size={16} color="#3498db" />
                <Text style={styles.quickActionText}>Health Tips</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Input */}
        <View style={[styles.inputContainer, { paddingBottom: 8 + insets.bottom }]}>
          <TextInput
            style={styles.input}
            value={inputText}
            onChangeText={setInputText}
            placeholder="Ask me anything about health..."
            placeholderTextColor="#95a5a6"
            multiline
            maxLength={500}
            onSubmitEditing={sendMessage}
            returnKeyType="send"
            editable={!isLoading}
          />
          <TouchableOpacity
            style={[styles.sendButton, (!inputText.trim() || isLoading) && styles.sendButtonDisabled]}
            onPress={sendMessage}
            disabled={!inputText.trim() || isLoading}
          >
            {isLoading ? (
              <ActivityIndicator size="small" color="#ffffff" />
            ) : (
              <Ionicons name="send" size={20} color="#ffffff" />
            )}
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
  },
  chatButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#3498db',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    zIndex: 1000,
  },
  notificationBadge: {
    position: 'absolute',
    top: -2,
    right: -2,
    backgroundColor: '#2ecc71',
    borderRadius: 10,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#ffffff',
  },
  notificationText: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  chatContainer: {
    height: 500,
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
    backgroundColor: '#f8f9fa',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  minimizeButton: {
    padding: 4,
  },
  messagesContainer: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  messagesContent: {
    padding: 16,
    paddingBottom: 8,
  },
  messageWrapper: {
    marginBottom: 12,
  },
  userMessageWrapper: {
    alignItems: 'flex-end',
  },
  assistantMessageWrapper: {
    alignItems: 'flex-start',
  },
  messageBubble: {
    maxWidth: '80%',
    padding: 12,
    borderRadius: 16,
  },
  userMessage: {
    backgroundColor: '#3498db',
    borderBottomRightRadius: 4,
  },
  assistantMessage: {
    backgroundColor: '#ffffff',
    borderBottomLeftRadius: 4,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
  },
  userMessageText: {
    color: '#ffffff',
  },
  assistantMessageText: {
    color: '#2c3e50',
  },
  loadingWrapper: {
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  loadingText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#7f8c8d',
    fontStyle: 'italic',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    padding: 12,
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#e9ecef',
    gap: 8,
  },
  input: {
    flex: 1,
    minHeight: 44,
    maxHeight: 100,
    backgroundColor: '#f8f9fa',
    borderRadius: 22,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#2c3e50',
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#3498db',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: '#bdc3c7',
  },
  quickActionsContainer: {
    padding: 12,
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#e9ecef',
  },
  quickActionsTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#7f8c8d',
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  quickActionsRow: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
  quickActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#e8f4f8',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#3498db',
  },
  quickActionText: {
    fontSize: 12,
    color: '#3498db',
    fontWeight: '600',
  },
});

