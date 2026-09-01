import React, { useState, useRef, useEffect, useCallback } from 'react';
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
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Speech from 'expo-speech';
import * as Haptics from 'expo-haptics';
import BottomNavBar from './components/BottomNavBar';
import { aiChatService, ChatMessage, ConversationThread } from './services/aiChatService';

export default function NexAIChatScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  // 'hub' = Nex AI Home/Landing screen; 'chat' = Interactive Conversation view
  const [viewMode, setViewMode] = useState<'hub' | 'chat'>('hub');
  const [messages, setMessages] = useState<ChatMessage[]>(() => aiChatService.getInitialMessages());
  const [suggestedPills, setSuggestedPills] = useState<string[]>([
    'Yes, suggest please',
    'What foods help?',
    'How much sunlight?',
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isVoiceRecording, setIsVoiceRecording] = useState(false);
  const [recentThreads] = useState<ConversationThread[]>(() => aiChatService.getRecentConversations());
  const [activeThreadTitle, setActiveThreadTitle] = useState<string>('Nex AI');

  const scrollViewRef = useRef<ScrollView>(null);

  const scrollToBottom = useCallback(() => {
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  }, []);

  useEffect(() => {
    if (viewMode === 'chat') {
      scrollToBottom();
    }
  }, [messages, viewMode, scrollToBottom]);

  const handleOpenThread = (thread: ConversationThread) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    setMessages(thread.messages);
    setActiveThreadTitle(thread.title);
    if (thread.suggestedPills) {
      setSuggestedPills(thread.suggestedPills);
    }
    setViewMode('chat');
  };

  const handleQuickAction = (actionType: 'ask' | 'reports' | 'insights' | 'voice') => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    if (actionType === 'ask') {
      setMessages(aiChatService.getInitialMessages());
      setActiveThreadTitle('Nex AI');
      setSuggestedPills(['Check blood sugar', 'Analyze CBC report', 'Senior diet tips']);
      setViewMode('chat');
    } else if (actionType === 'reports') {
      const cbcThread = recentThreads.find(t => t.id === 'conv_cbc') || recentThreads[1];
      handleOpenThread(cbcThread);
    } else if (actionType === 'insights') {
      router.push('/health-score' as any);
    } else if (actionType === 'voice') {
      setMessages(aiChatService.getInitialMessages());
      setActiveThreadTitle('Nex AI Voice');
      setViewMode('chat');
      handleVoiceToggle();
    }
  };

  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend || inputText;
    if (!text.trim() || isLoading) return;

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});

    if (viewMode === 'hub') {
      setViewMode('chat');
    }

    const userMsg: ChatMessage = {
      id: `usr_${Date.now()}`,
      role: 'user',
      content: text.trim(),
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setIsLoading(true);

    try {
      const response = await aiChatService.sendMessage(text.trim(), messages);
      setMessages(prev => [...prev, response.assistantMessage]);
      if (response.suggestedPills) {
        setSuggestedPills(response.suggestedPills);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVoiceToggle = () => {
    if (!isVoiceRecording) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
      setIsVoiceRecording(true);
      try {
        Speech.speak("I'm listening, please tell me your symptoms or query", { language: 'en-IN', rate: 0.85 });
      } catch {}
      setTimeout(() => {
        setIsVoiceRecording(false);
        handleSendMessage('Is my Vitamin D level okay?');
      }, 3000);
    } else {
      Speech.stop();
      setIsVoiceRecording(false);
    }
  };

  const handleUploadReportDoc = () => {
    Alert.alert(
      'Attach Medical Report',
      'Select a document or scan to analyze with Nex AI:',
      [
        {
          text: 'Upload CBC Blood Report',
          onPress: () => handleSendMessage('Please analyze my CBC Blood Count Report from yesterday.'),
        },
        {
          text: 'Upload Lipid & Sugar Test',
          onPress: () => handleSendMessage('Here is my fasting blood sugar (98 mg/dL) and HbA1c report.'),
        },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  const handleClearChat = () => {
    Alert.alert('Reset Conversation', 'Do you want to start a fresh consultation with Nex AI?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Reset',
        style: 'destructive',
        onPress: () => {
          setMessages(aiChatService.getInitialMessages());
          setSuggestedPills(['Check blood sugar', 'Vitamin D status', 'Sleep advice']);
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      {/* HUB / LANDING VIEW */}
      {viewMode === 'hub' ? (
        <ScrollView
          style={styles.hubScroll}
          contentContainerStyle={[styles.hubContent, { paddingTop: Math.max(insets.top + 8, 20) }]}
          showsVerticalScrollIndicator={false}
        >
          {/* Header Title + 3D Robot Mascot */}
          <View style={styles.hubHeroRow}>
            <View style={styles.hubHeroTextWrapper}>
              <Text style={styles.hubBrandTitle}>Nex AI</Text>
              <Text style={styles.hubTaglineTeal}>Your Personal Health Buddy</Text>
              <Text style={styles.hubTaglineSub}>Ask anything, get smarter about your health</Text>
            </View>
            <View style={styles.mascotContainer}>
              <Image
                source={require('../assets/images/nex-mascot.png')}
                style={styles.mascotImage}
                resizeMode="contain"
              />
            </View>
          </View>

          {/* "How can I help you today?" Card with 4 Actions */}
          <View style={styles.helpBox}>
            <Text style={styles.helpBoxTitle}>How can I help you today?</Text>
            <View style={styles.helpGrid}>
              <TouchableOpacity
                style={styles.helpCard}
                onPress={() => handleQuickAction('ask')}
                activeOpacity={0.8}
              >
                <View style={[styles.helpIconCircle, { backgroundColor: '#EFF6FF' }]}>
                  <Ionicons name="chatbubbles-outline" size={24} color="#0066FF" />
                </View>
                <Text style={styles.helpCardLabel}>Ask{'\n'}anything</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.helpCard}
                onPress={() => handleQuickAction('reports')}
                activeOpacity={0.8}
              >
                <View style={[styles.helpIconCircle, { backgroundColor: '#F0FDF4' }]}>
                  <Ionicons name="document-text-outline" size={24} color="#10B981" />
                </View>
                <Text style={styles.helpCardLabel}>Understand{'\n'}reports</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.helpCard}
                onPress={() => handleQuickAction('insights')}
                activeOpacity={0.8}
              >
                <View style={[styles.helpIconCircle, { backgroundColor: '#EEF2FF' }]}>
                  <Ionicons name="trending-up-outline" size={24} color="#3B82F6" />
                </View>
                <Text style={styles.helpCardLabel}>Health{'\n'}insights</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.helpCard}
                onPress={() => handleQuickAction('voice')}
                activeOpacity={0.8}
              >
                <View style={[styles.helpIconCircle, { backgroundColor: '#ECFDF5' }]}>
                  <Ionicons name="mic-outline" size={24} color="#059669" />
                </View>
                <Text style={styles.helpCardLabel}>Voice{'\n'}Chat</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Recent Conversations */}
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionHeading}>Recent Conversations</Text>
            <TouchableOpacity onPress={() => handleQuickAction('ask')}>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.conversationsList}>
            {recentThreads.map((thread) => (
              <TouchableOpacity
                key={thread.id}
                style={styles.convCard}
                onPress={() => handleOpenThread(thread)}
                activeOpacity={0.75}
              >
                <View style={styles.convAvatarCircle}>
                  <Image
                    source={require('../assets/images/nex-avatar.png')}
                    style={styles.convAvatarImg}
                    resizeMode="contain"
                  />
                </View>
                <View style={styles.convTextContent}>
                  <Text style={styles.convTitle} numberOfLines={1}>
                    {thread.title}
                  </Text>
                  <Text style={styles.convTimestamp}>{thread.timestampStr}</Text>
                </View>
                <Ionicons name="chevron-forward" size={18} color="#94A3B8" />
              </TouchableOpacity>
            ))}
          </View>

          {/* Tip from Nex AI Card */}
          <View style={styles.tipCard}>
            <View style={styles.tipIconCircle}>
              <Ionicons name="sparkles" size={20} color="#0D9488" />
            </View>
            <View style={styles.tipTextWrapper}>
              <Text style={styles.tipHeading}>Tip from Nex AI</Text>
              <Text style={styles.tipBody}>
                Drinking enough water can improve your energy and focus throughout the day
              </Text>
            </View>
            <Image
              source={require('../assets/images/nex-avatar.png')}
              style={styles.tipMascotMini}
              resizeMode="contain"
            />
          </View>
        </ScrollView>
      ) : (
        /* INTERACTIVE CHAT VIEW */
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          keyboardVerticalOffset={Platform.OS === 'ios' ? insets.top : 0}
        >
          {/* Chat Navigation Header */}
          <View style={[styles.chatHeader, { paddingTop: Math.max(insets.top, 14) }]}>
            <TouchableOpacity
              style={styles.backBtn}
              onPress={() => setViewMode('hub')}
              activeOpacity={0.7}
            >
              <Ionicons name="arrow-back" size={24} color="#1E293B" />
            </TouchableOpacity>
            <View style={styles.chatHeaderCenter}>
              <Text style={styles.chatHeaderTitle} numberOfLines={1}>{activeThreadTitle}</Text>
            </View>
            <TouchableOpacity
              style={styles.optionsBtn}
              onPress={handleClearChat}
              activeOpacity={0.7}
            >
              <Ionicons name="ellipsis-horizontal" size={22} color="#1E293B" />
            </TouchableOpacity>
          </View>

          {/* Messages Stream */}
          <ScrollView
            ref={scrollViewRef}
            style={styles.messagesContainer}
            contentContainerStyle={styles.messagesContent}
            showsVerticalScrollIndicator={false}
          >
            {messages.map((msg) => {
              const isUser = msg.role === 'user';
              return (
                <View
                  key={msg.id}
                  style={[
                    styles.messageWrapper,
                    isUser ? styles.userMsgWrapper : styles.botMsgWrapper,
                  ]}
                >
                  {!isUser && (
                    <View style={styles.botAvatarCircle}>
                      <Image
                        source={require('../assets/images/nex-avatar.png')}
                        style={styles.botAvatarImg}
                        resizeMode="contain"
                      />
                    </View>
                  )}

                  <View
                    style={[
                      styles.bubble,
                      isUser ? styles.userBubble : styles.botBubble,
                    ]}
                  >
                    <Text
                      style={[
                        styles.msgText,
                        isUser ? styles.userMsgText : styles.botMsgText,
                      ]}
                    >
                      {msg.content}
                    </Text>

                    {/* Embedded Health Action Card if any */}
                    {msg.embeddedCard && (
                      <TouchableOpacity
                        style={styles.embeddedCard}
                        onPress={() => router.push(msg.embeddedCard!.route as any)}
                        activeOpacity={0.85}
                      >
                        <View style={styles.cardHeaderRow}>
                          <Ionicons name={msg.embeddedCard.icon as any} size={18} color="#0066FF" />
                          <Text style={styles.cardHeaderTitle}>{msg.embeddedCard.title}</Text>
                        </View>
                        <Text style={styles.cardHeaderSubtitle}>{msg.embeddedCard.subtitle}</Text>
                        <View style={styles.cardActionRow}>
                          <Text style={styles.cardActionText}>{msg.embeddedCard.actionText}</Text>
                          <Ionicons name="arrow-forward" size={14} color="#0066FF" />
                        </View>
                      </TouchableOpacity>
                    )}

                    <View style={styles.msgFooterRow}>
                      <Text style={[styles.timeText, isUser && styles.userTimeText]}>
                        {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </Text>
                      {isUser && <Ionicons name="checkmark-done" size={14} color="#93C5FD" style={{ marginLeft: 3 }} />}
                    </View>
                  </View>
                </View>
              );
            })}

            {isLoading && (
              <View style={[styles.messageWrapper, styles.botMsgWrapper]}>
                <View style={styles.botAvatarCircle}>
                  <Image
                    source={require('../assets/images/nex-avatar.png')}
                    style={styles.botAvatarImg}
                    resizeMode="contain"
                  />
                </View>
                <View style={[styles.bubble, styles.botBubble, { flexDirection: 'row', alignItems: 'center', gap: 8 }]}>
                  <ActivityIndicator size="small" color="#0066FF" />
                  <Text style={styles.botMsgText}>Nex AI is analyzing...</Text>
                </View>
              </View>
            )}

            {isVoiceRecording && (
              <View style={styles.voiceIndicatorBox}>
                <Ionicons name="mic" size={24} color="#EF4444" />
                <Text style={styles.voiceIndicatorText}>Listening... speak now</Text>
              </View>
            )}

            {/* Suggestion Follow-Up Pills */}
            {!isLoading && suggestedPills.length > 0 && (
              <View style={styles.suggestedPillsContainer}>
                {suggestedPills.map((pill, idx) => (
                  <TouchableOpacity
                    key={idx}
                    style={styles.suggestedPill}
                    onPress={() => handleSendMessage(pill)}
                    activeOpacity={0.75}
                  >
                    <Text style={styles.suggestedPillText}>{pill}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </ScrollView>

          {/* Bottom Chat Input Bar */}
          <View style={styles.chatInputBar}>
            <View style={styles.inputInnerWrapper}>
              <TextInput
                style={styles.chatTextInput}
                value={inputText}
                onChangeText={setInputText}
                placeholder="Ask me anything..."
                placeholderTextColor="#94A3B8"
                multiline={false}
                onSubmitEditing={() => handleSendMessage()}
              />
              <TouchableOpacity
                style={styles.inputIconBtn}
                onPress={handleUploadReportDoc}
                activeOpacity={0.7}
              >
                <Ionicons name="document-text-outline" size={20} color="#64748B" />
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.inputIconBtn, isVoiceRecording && styles.voiceActiveIcon]}
                onPress={handleVoiceToggle}
                activeOpacity={0.7}
              >
                <Ionicons
                  name={isVoiceRecording ? 'mic' : 'mic-outline'}
                  size={20}
                  color={isVoiceRecording ? '#EF4444' : '#64748B'}
                />
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={[styles.sendCircleBtn, !inputText.trim() && styles.sendCircleBtnDisabled]}
              onPress={() => handleSendMessage()}
              disabled={!inputText.trim() || isLoading}
              activeOpacity={0.85}
            >
              <Ionicons name="paper-plane" size={18} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      )}

      {/* Bottom Navigation Bar */}
      <BottomNavBar activeTab="chat" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },

  /* HUB STYLES */
  hubScroll: {
    flex: 1,
  },
  hubContent: {
    paddingHorizontal: 20,
    paddingBottom: 24,
  },
  hubHeroRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  hubHeroTextWrapper: {
    flex: 1,
    paddingRight: 10,
  },
  hubBrandTitle: {
    fontSize: 34,
    fontWeight: '800',
    color: '#0166ED',
    letterSpacing: -0.5,
    fontFamily: 'CormorantGaramond_700Bold',
  },
  hubTaglineTeal: {
    fontSize: 16,
    fontWeight: '700',
    color: '#15803D',
    fontFamily: 'Manrope_700Bold',
    marginTop: 4,
  },
  hubTaglineSub: {
    fontSize: 13,
    color: '#52525B',
    fontFamily: 'Manrope_400Regular',
    marginTop: 4,
    lineHeight: 18,
  },
  mascotContainer: {
    width: 100,
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mascotImage: {
    width: '100%',
    height: '100%',
  },

  /* Help Box */
  helpBox: {
    backgroundColor: '#EFF6FF',
    borderRadius: 20,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#DBEAFE',
  },
  helpBoxTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 14,
  },
  helpGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  helpCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 4,
    alignItems: 'center',
    justifyContent: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  helpIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  helpCardLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#334155',
    textAlign: 'center',
    lineHeight: 14,
  },

  /* Recent Conversations */
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionHeading: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1E293B',
  },
  seeAllText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#0066FF',
  },
  conversationsList: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.04,
        shadowRadius: 6,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  convCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  convAvatarCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#EFF6FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    borderWidth: 1,
    borderColor: '#DBEAFE',
  },
  convAvatarImg: {
    width: 28,
    height: 28,
  },
  convTextContent: {
    flex: 1,
  },
  convTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 3,
  },
  convTimestamp: {
    fontSize: 12,
    color: '#94A3B8',
  },

  /* Tip Card */
  tipCard: {
    backgroundColor: '#EEF6FF',
    borderRadius: 18,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0EEFF',
  },
  tipIconCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#CCFBF1',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  tipTextWrapper: {
    flex: 1,
    paddingRight: 8,
  },
  tipHeading: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F766E',
    marginBottom: 2,
  },
  tipBody: {
    fontSize: 12,
    color: '#334155',
    lineHeight: 16,
  },
  tipMascotMini: {
    width: 48,
    height: 48,
  },

  /* CHAT VIEW STYLES */
  chatHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  backBtn: {
    padding: 6,
  },
  chatHeaderCenter: {
    flex: 1,
    alignItems: 'center',
    marginHorizontal: 10,
  },
  chatHeaderTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#0F172A',
  },
  optionsBtn: {
    padding: 6,
  },
  messagesContainer: {
    flex: 1,
  },
  messagesContent: {
    padding: 16,
    paddingBottom: 16,
  },
  messageWrapper: {
    marginBottom: 16,
  },
  userMsgWrapper: {
    alignItems: 'flex-end',
  },
  botMsgWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },
  botAvatarCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#EFF6FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 2,
    borderWidth: 1,
    borderColor: '#DBEAFE',
  },
  botAvatarImg: {
    width: 24,
    height: 24,
  },
  bubble: {
    maxWidth: '82%',
    padding: 14,
    borderRadius: 18,
  },
  userBubble: {
    backgroundColor: '#0066FF',
    borderBottomRightRadius: 4,
    ...Platform.select({
      ios: {
        shadowColor: '#0066FF',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  botBubble: {
    backgroundColor: '#FFFFFF',
    borderBottomLeftRadius: 4,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 3,
      },
      android: {
        elevation: 1,
      },
    }),
  },
  msgText: {
    fontSize: 15,
    lineHeight: 22,
  },
  userMsgText: {
    color: '#FFFFFF',
    fontWeight: '400',
  },
  botMsgText: {
    color: '#1E293B',
    fontWeight: '400',
  },
  msgFooterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginTop: 4,
  },
  timeText: {
    fontSize: 10,
    color: '#94A3B8',
  },
  userTimeText: {
    color: '#BFDBFE',
  },

  /* Embedded Health Card */
  embeddedCard: {
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 12,
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
    gap: 6,
  },
  cardHeaderTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F172A',
  },
  cardHeaderSubtitle: {
    fontSize: 12,
    color: '#64748B',
    marginBottom: 8,
  },
  cardActionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  cardActionText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0066FF',
  },

  voiceIndicatorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEE2E2',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FECACA',
    marginBottom: 12,
    gap: 8,
  },
  voiceIndicatorText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#B91C1C',
  },

  /* Suggested Pills */
  suggestedPillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 10,
    paddingLeft: 42,
  },
  suggestedPill: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#22C55E',
  },
  suggestedPillText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#15803D',
  },

  /* Bottom Chat Input Bar */
  chatInputBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 10,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    gap: 10,
  },
  inputInnerWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    borderRadius: 24,
    paddingHorizontal: 14,
    height: 46,
  },
  chatTextInput: {
    flex: 1,
    fontSize: 14,
    color: '#0F172A',
    paddingVertical: 8,
  },
  inputIconBtn: {
    padding: 6,
    marginLeft: 2,
  },
  voiceActiveIcon: {
    backgroundColor: '#FEE2E2',
    borderRadius: 12,
  },
  sendCircleBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#0066FF',
    justifyContent: 'center',
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#0066FF',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  sendCircleBtnDisabled: {
    backgroundColor: '#94A3B8',
  },
});
