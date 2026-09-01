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
  Keyboard,
  useWindowDimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { aiChatService, ChatMessage } from '../services/aiChatService';
import { RedirectType } from '../utils/chatbotRedirects';

export default function ChatBot() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { height: screenHeight } = useWindowDimensions();

  const [messages, setMessages] = useState<ChatMessage[]>(() => aiChatService.getInitialMessages());
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isMinimized, setIsMinimized] = useState(true);
  const scrollViewRef = useRef<ScrollView>(null);
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const [keyboardVisible, setKeyboardVisible] = useState(false);

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

  // Keyboard listeners to adjust height
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

  const chatHeight = useMemo(() => {
    const maxHeight = Math.min(screenHeight * 0.9, 560);
    const baseHeight = Math.max(420, screenHeight * 0.55);
    if (!keyboardVisible) return Math.min(maxHeight, baseHeight);
    const available = screenHeight - keyboardHeight - insets.bottom - 16;
    return Math.max(360, Math.min(maxHeight, available));
  }, [keyboardVisible, keyboardHeight, screenHeight, insets.bottom]);

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

    setIsMinimized(true);
    setTimeout(() => {
      router.push(route as any);
    }, 300);
  }, [router]);

  const sendMessage = useCallback(async () => {
    if (!inputText.trim() || isLoading) return;

    const userText = inputText.trim();
    const userMessage: ChatMessage = {
      id: `usr_${Date.now()}`,
      role: 'user',
      content: userText,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);

    try {
      const { assistantMessage, redirectIntent } = await aiChatService.sendMessage(userText, messages);
      setMessages((prev) => [...prev, assistantMessage]);

      if (redirectIntent && redirectIntent.confidence >= 0.8) {
        setTimeout(() => {
          handleRedirect(redirectIntent.type, redirectIntent.params);
        }, 1200);
      }
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setIsLoading(false);
    }
  }, [inputText, isLoading, messages, handleRedirect]);

  if (isMinimized) {
    return (
      <TouchableOpacity
        style={styles.chatButton}
        onPress={() => setIsMinimized(false)}
        activeOpacity={0.85}
      >
        <Ionicons name="chatbubbles" size={26} color="#ffffff" />
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
            <Ionicons name="medical" size={22} color="#0056D2" />
            <Text style={styles.headerTitle}>NEX-AI Assistant</Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
            <TouchableOpacity onPress={() => { setIsMinimized(true); router.push('/chat' as any); }}>
              <Ionicons name="expand-outline" size={20} color="#2c3e50" />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setIsMinimized(true)}
              style={styles.minimizeButton}
            >
              <Ionicons name="chevron-down" size={24} color="#2c3e50" />
            </TouchableOpacity>
          </View>
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
          {messages.map((message) => (
            <View
              key={message.id}
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

                {/* Embedded Card */}
                {message.embeddedCard && (
                  <TouchableOpacity
                    style={styles.floatingEmbeddedCard}
                    onPress={() => {
                      setIsMinimized(true);
                      router.push(message.embeddedCard!.route as any);
                    }}
                  >
                    <Ionicons name={message.embeddedCard.icon as any} size={16} color="#0056D2" />
                    <Text style={styles.floatingEmbeddedText}>{message.embeddedCard.actionText}</Text>
                    <Ionicons name="arrow-forward" size={12} color="#0056D2" />
                  </TouchableOpacity>
                )}
              </View>
            </View>
          ))}

          {isLoading && (
            <View style={styles.loadingWrapper}>
              <View style={styles.assistantMessage}>
                <ActivityIndicator size="small" color="#0056D2" />
                <Text style={styles.loadingText}>Thinking...</Text>
              </View>
            </View>
          )}
        </ScrollView>

        {/* Quick Action Buttons */}
        {messages.length <= 3 && (
          <View style={styles.quickActionsContainer}>
            <View style={styles.quickActionsRow}>
              <TouchableOpacity
                style={styles.quickActionButton}
                onPress={() => {
                  setInputText('I need to consult a doctor');
                  setTimeout(() => sendMessage(), 100);
                }}
              >
                <Ionicons name="calendar" size={14} color="#0056D2" />
                <Text style={styles.quickActionText}>Consult Doctor</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.quickActionButton}
                onPress={() => {
                  setInputText('I want to check symptoms');
                  setTimeout(() => sendMessage(), 100);
                }}
              >
                <Ionicons name="medical" size={14} color="#0056D2" />
                <Text style={styles.quickActionText}>Check Symptoms</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.quickActionButton}
                onPress={() => {
                  setInputText('Refill my medicines');
                  setTimeout(() => sendMessage(), 100);
                }}
              >
                <Ionicons name="cart" size={14} color="#0056D2" />
                <Text style={styles.quickActionText}>Refill Pills</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Input Bar */}
        <View style={[styles.inputContainer, { paddingBottom: 8 + insets.bottom }]}>
          <TextInput
            style={styles.input}
            value={inputText}
            onChangeText={setInputText}
            placeholder="Ask anything about health..."
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
              <Ionicons name="send" size={18} color="#ffffff" />
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
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#0056D2',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    zIndex: 1000,
  },
  notificationBadge: {
    position: 'absolute',
    top: -2,
    right: -2,
    backgroundColor: '#10b981',
    borderRadius: 10,
    width: 22,
    height: 22,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#ffffff',
  },
  notificationText: {
    color: '#ffffff',
    fontSize: 9,
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
    shadowOpacity: 0.25,
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
    gap: 8,
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#2c3e50',
  },
  minimizeButton: {
    padding: 2,
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
    maxWidth: '82%',
    padding: 12,
    borderRadius: 16,
  },
  userMessage: {
    backgroundColor: '#0056D2',
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
  },
  messageText: {
    fontSize: 14,
    lineHeight: 20,
  },
  userMessageText: {
    color: '#ffffff',
  },
  assistantMessageText: {
    color: '#2c3e50',
  },
  floatingEmbeddedCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F0FE',
    padding: 8,
    borderRadius: 6,
    marginTop: 8,
    gap: 6,
  },
  floatingEmbeddedText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0056D2',
    flex: 1,
  },
  loadingWrapper: {
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  loadingText: {
    marginLeft: 8,
    fontSize: 13,
    color: '#7f8c8d',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#e9ecef',
    gap: 8,
  },
  input: {
    flex: 1,
    minHeight: 40,
    maxHeight: 90,
    backgroundColor: '#f8f9fa',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 8,
    fontSize: 14,
    color: '#2c3e50',
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#0056D2',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: '#bdc3c7',
  },
  quickActionsContainer: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#e9ecef',
  },
  quickActionsRow: {
    flexDirection: 'row',
    gap: 6,
    flexWrap: 'wrap',
  },
  quickActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 6,
    backgroundColor: '#e8f4f8',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#0056D2',
  },
  quickActionText: {
    fontSize: 11,
    color: '#0056D2',
    fontWeight: '600',
  },
});
