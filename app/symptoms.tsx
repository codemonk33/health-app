import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import * as Speech from 'expo-speech';
import { useEffect, useMemo, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, ScrollView } from 'react-native';
import { useResponsive } from './utils/responsive';
import { Theme } from './utils/theme';
import BottomNavBar from './components/BottomNavBar';

export default function SymptomsScreen() {
  const router = useRouter();
  const R = useResponsive();
  const [selectedPart, setSelectedPart] = useState<string | null>(null);

  useEffect(() => {
    // Play audio instruction on load
    try {
      Speech.speak("जिस जगह तकलीफ है वहाँ टैप करें", { language: 'hi-IN', rate: 0.75 });
      setTimeout(() => Speech.speak("Tap the area where you have a problem",
        { language: 'en-IN', rate: 0.8 }), 3000);
    } catch (error) {
      console.log('Speech error:', error);
    }

    return () => {
      Speech.stop();
    };
  }, []);

  const bodyParts = [
    { name: 'Head', hindiName: 'सिर', icon: 'person', color: Theme.colors.danger, position: 'top' },
    { name: 'Eyes', hindiName: 'आँखें', icon: 'eye', color: Theme.colors.primary, position: 'top' },
    { name: 'Ears', hindiName: 'कान', icon: 'ear', color: Theme.colors.purple, position: 'top' },
    { name: 'Nose', hindiName: 'नाक', icon: 'medical', color: Theme.colors.warning, position: 'top' },
    { name: 'Mouth', hindiName: 'मुँह', icon: 'medical', color: Theme.colors.secondary, position: 'top' },
    { name: 'Neck', hindiName: 'गर्दन', icon: 'body-outline', color: Theme.colors.neutralSecondaryText, position: 'middle' },
    { name: 'Chest', hindiName: 'सीना', icon: 'heart', color: Theme.colors.danger, position: 'middle' },
    { name: 'Stomach', hindiName: 'पेट', icon: 'fitness', color: Theme.colors.warning, position: 'middle' },
    { name: 'Left Arm', hindiName: 'बायाँ हाथ', icon: 'hand-left', color: Theme.colors.primary, position: 'middle' },
    { name: 'Right Arm', hindiName: 'दायाँ हाथ', icon: 'hand-right', color: Theme.colors.primary, position: 'middle' },
    { name: 'Left Leg', hindiName: 'बायाँ पैर', icon: 'walk', color: Theme.colors.purple, position: 'bottom' },
    { name: 'Right Leg', hindiName: 'दायाँ पैर', icon: 'walk', color: Theme.colors.purple, position: 'bottom' },
  ];

  const handlePartSelect = (partName: string, hindiName: string) => {
    setSelectedPart(partName);
    Speech.stop();
    Speech.speak(`${hindiName} — ${partName}`, { language: 'hi-IN', rate: 0.8 });
    router.push(`/body-part-detail?part=${encodeURIComponent(partName)}`);
  };

  const styles = useMemo(() => StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: Theme.colors.background,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingTop: R.spacing(60),
      paddingBottom: R.spacing(20),
      paddingHorizontal: R.spacing(20),
      backgroundColor: Theme.colors.surface,
      borderBottomWidth: 1,
      borderBottomColor: Theme.colors.border,
    },
    backButton: {
      flexDirection: 'row',
      alignItems: 'center',
      marginRight: R.spacing(20),
    },
    backText: {
      fontSize: R.font(Theme.typography.sizes.h3),
      color: Theme.colors.neutralText,
      marginLeft: R.spacing(8),
      lineHeight: R.font(28),
    },
    title: {
      fontSize: R.font(Theme.typography.sizes.h1),
      fontWeight: 'bold',
      color: Theme.colors.neutralText,
    },
    partsContainer: {
      flex: 1,
      backgroundColor: Theme.colors.surface,
    },
    partsContentContainer: {
      padding: R.spacing(20),
      paddingBottom: R.spacing(40),
    },
    partsTitle: {
      fontSize: R.font(Theme.typography.sizes.h2),
      fontWeight: 'bold',
      color: Theme.colors.neutralText,
      marginBottom: R.spacing(20),
      textAlign: 'center',
      lineHeight: Math.round(R.font(22) * 1.35),
    },
    partsGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
    },
    partButton: {
      width: '48%',
      flexDirection: 'row',
      alignItems: 'center',
      padding: R.spacing(20),
      borderRadius: R.size(Theme.rounding.large),
      marginBottom: R.spacing(15),
      ...Theme.shadows.button,
    },
    selectedPart: {
      borderWidth: 3,
      borderColor: Theme.colors.primary,
    },
    partText: {
      color: '#ffffff',
      fontSize: R.font(Theme.typography.sizes.body),
      fontWeight: '600',
      marginLeft: R.spacing(12),
      lineHeight: Math.round(R.font(18) * 1.35),
      flexShrink: 1,
    },
  }), [R]);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={28} color={Theme.colors.neutralText} />
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Select Body Part</Text>
      </View>

      {/* Body Parts Grid */}
      <ScrollView style={styles.partsContainer} contentContainerStyle={styles.partsContentContainer} showsVerticalScrollIndicator={false}>
        <Text style={styles.partsTitle}>Tap the affected area:</Text>
        <View style={styles.partsGrid}>
          {bodyParts.map((part, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.partButton,
                { backgroundColor: part.color },
                selectedPart === part.name && styles.selectedPart
              ]}
              onPress={() => handlePartSelect(part.name, part.hindiName)}
              activeOpacity={0.8}
            >
              <Ionicons name={part.icon as any} size={32} color="#ffffff" />
              <Text style={styles.partText}>{part.name}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* Bottom Navigation Bar */}
      <BottomNavBar />
    </View>
  );
}
