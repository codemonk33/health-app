import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import * as Speech from 'expo-speech';
import { useEffect, useMemo, useState } from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useResponsive } from './utils/responsive';

export default function SymptomsScreen() {
  const router = useRouter();
  const R = useResponsive();
  const [selectedPart, setSelectedPart] = useState<string | null>(null);

  useEffect(() => {
    // Play audio instruction on load
    const speakInstruction = async () => {
      try {
        await Speech.speak("Select the part where you are having a problem", {
          language: 'en',
          pitch: 1.0,
          rate: 0.8,
        });
      } catch (error) {
        console.log('Speech error:', error);
      }
    };

    speakInstruction();
  }, []);

  const bodyParts = [
    { name: 'Head', icon: 'headset', color: '#e74c3c', position: 'top' },
    { name: 'Eyes', icon: 'eye', color: '#3498db', position: 'top' },
    { name: 'Ears', icon: 'ear', color: '#9b59b6', position: 'top' },
    { name: 'Nose', icon: 'medical', color: '#f39c12', position: 'top' },
    { name: 'Mouth', icon: 'medical', color: '#e67e22', position: 'top' },
    { name: 'Neck', icon: 'body', color: '#34495e', position: 'middle' },
    { name: 'Chest', icon: 'body', color: '#e74c3c', position: 'middle' },
    { name: 'Stomach', icon: 'body', color: '#f39c12', position: 'middle' },
    { name: 'Left Arm', icon: 'hand-left', color: '#3498db', position: 'middle' },
    { name: 'Right Arm', icon: 'hand-right', color: '#3498db', position: 'middle' },
    { name: 'Left Leg', icon: 'football', color: '#9b59b6', position: 'bottom' },
    { name: 'Right Leg', icon: 'football', color: '#9b59b6', position: 'bottom' },
  ];

  const handlePartSelect = (partName: string) => {
    setSelectedPart(partName);
    Alert.alert(
      'Body Part Selected',
      `You selected: ${partName}\n\nThis will show you related symptoms and conditions.`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Continue', 
          onPress: () => router.push(`/body-part-detail?part=${encodeURIComponent(partName)}`)
        }
      ]
    );
  };

  const styles = useMemo(() => StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#f8f9fa',
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingTop: R.spacing(60),
      paddingBottom: R.spacing(20),
      paddingHorizontal: R.spacing(20),
      backgroundColor: '#ffffff',
      borderBottomWidth: 1,
      borderBottomColor: '#e9ecef',
    },
    backButton: {
      flexDirection: 'row',
      alignItems: 'center',
      marginRight: R.spacing(20),
    },
    backText: {
      fontSize: R.font(18),
      color: '#2c3e50',
      marginLeft: R.spacing(8),
      lineHeight: R.font(28),
    },
    title: {
      fontSize: R.font(28),
      fontWeight: 'bold',
      color: '#2c3e50',
    },
    bodyModelContainer: {
      flex: 1,
      margin: R.spacing(20),
      backgroundColor: '#ffffff',
      borderRadius: R.size(20),
      elevation: 8,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      overflow: 'hidden',
    },
    bodyModel: { flex: 1 },
    partsContainer: {
      padding: R.spacing(20),
      backgroundColor: '#ffffff',
    },
    partsTitle: {
      fontSize: R.font(22),
      fontWeight: 'bold',
      color: '#2c3e50',
      marginBottom: R.spacing(20),
      textAlign: 'center',
      lineHeight: Math.round(R.font(22) * 1.35),
    },
    partsGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
      gap: R.spacing(10),
    },
    partButton: {
      width: '48%',
      flexDirection: 'row',
      alignItems: 'center',
      padding: R.spacing(20),
      borderRadius: R.size(15),
      marginBottom: R.spacing(15),
      elevation: 4,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 4,
    },
    selectedPart: {
      borderWidth: 3,
      borderColor: '#2c3e50',
    },
    partText: {
      color: '#ffffff',
      fontSize: R.font(18),
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
          <Ionicons name="arrow-back" size={28} color="#2c3e50" />
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Select Body Part</Text>
      </View>

      {/* 2D Body Model Redirect */}
      <View style={styles.bodyModelContainer}>
        <TouchableOpacity
          style={styles.modelRedirect}
          onPress={() => router.push('/body-model')}
          activeOpacity={0.85}
        >
          <Ionicons name="body" size={28} color="#2c3e50" />
          <Text style={styles.modelRedirectText}>Open Interactive Body Model</Text>
          <Ionicons name="chevron-forward" size={24} color="#2c3e50" />
        </TouchableOpacity>
      </View>

      {/* Body Parts Grid */}
      <View style={styles.partsContainer}>
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
              onPress={() => handlePartSelect(part.name)}
            >
              <Ionicons name={part.icon as any} size={32} color="#ffffff" />
              <Text style={styles.partText}>{part.name}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 20,
  },
  backText: {
    fontSize: 18,
    color: '#2c3e50',
    marginLeft: 8,
    lineHeight: 28,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  bodyModelContainer: {
    flex: 1,
    margin: 20,
    backgroundColor: '#ffffff',
    borderRadius: 20,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    overflow: 'hidden',
  },
  bodyModel: {
    flex: 1,
  },
  modelRedirect: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    backgroundColor: '#ecf0f1',
  },
  modelRedirectText: {
    fontSize: 18,
    color: '#2c3e50',
    fontWeight: '600',
  },
  partsContainer: {
    padding: 20,
    backgroundColor: '#ffffff',
  },
  partsTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 20,
    textAlign: 'center',
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
    padding: 20,
    borderRadius: 15,
    marginBottom: 15,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  selectedPart: {
    borderWidth: 3,
    borderColor: '#2c3e50',
  },
  partText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 12,
  },
}); 