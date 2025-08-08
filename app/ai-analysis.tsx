import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface AnalysisResult {
  possibleCauses: string[];
  basicTreatment: string[];
  whenToSeekDoctor: string[];
  recommendedFoods: string[];
  severity: 'low' | 'medium' | 'high';
}

export default function AIAnalysisScreen() {
  const router = useRouter();
  const { part, symptom } = useLocalSearchParams<{ part: string; symptom: string }>();
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate AI analysis
    const performAnalysis = async () => {
      setIsLoading(true);
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock analysis result based on symptom
      const mockResult: AnalysisResult = {
        possibleCauses: [
          'Allergic reaction to environmental factors',
          'Bacterial or viral infection',
          'Dry eye syndrome',
          'Contact lens irritation',
          'Eye strain from digital devices'
        ],
        basicTreatment: [
          'Apply warm compress for 10-15 minutes',
          'Use over-the-counter eye drops',
          'Avoid rubbing your eyes',
          'Take breaks from screen time',
          'Keep the area clean and dry'
        ],
        whenToSeekDoctor: [
          'Severe pain or vision changes',
          'Symptoms lasting more than 48 hours',
          'Yellow or green discharge',
          'Swelling that affects vision',
          'Fever accompanying symptoms'
        ],
        recommendedFoods: [
          'Foods rich in Vitamin A (carrots, sweet potatoes)',
          'Omega-3 fatty acids (salmon, walnuts)',
          'Antioxidant-rich foods (berries, leafy greens)',
          'Zinc-rich foods (nuts, seeds)',
          'Stay hydrated with plenty of water'
        ],
        severity: 'medium'
      };
      
      setAnalysisResult(mockResult);
      setIsLoading(false);
    };

    performAnalysis();
  }, [part, symptom]);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'low':
        return '#2ecc71';
      case 'medium':
        return '#f39c12';
      case 'high':
        return '#e74c3c';
      default:
        return '#95a5a6';
    }
  };

  const getSeverityText = (severity: string) => {
    switch (severity) {
      case 'low':
        return 'Low Risk';
      case 'medium':
        return 'Moderate Risk';
      case 'high':
        return 'High Risk';
      default:
        return 'Unknown';
    }
  };

  if (isLoading) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={28} color="#2c3e50" />
            <Text style={styles.backText}>Back</Text>
          </TouchableOpacity>
          <Text style={styles.title}>AI Analysis</Text>
        </View>
        <View style={styles.loadingContainer}>
          <Ionicons name="medical" size={80} color="#3498db" />
          <Text style={styles.loadingText}>Analyzing your symptoms...</Text>
          <Text style={styles.loadingSubtext}>Please wait while our AI processes your information</Text>
        </View>
      </View>
    );
  }

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
        <Text style={styles.title}>Analysis Report</Text>
      </View>

      {/* Content */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Summary */}
        <View style={styles.summaryContainer}>
          <Text style={styles.summaryTitle}>Analysis Summary</Text>
          <Text style={styles.summaryText}>
            Body Part: <Text style={styles.highlight}>{part}</Text>
          </Text>
          <Text style={styles.summaryText}>
            Symptom: <Text style={styles.highlight}>{symptom}</Text>
          </Text>
          <View style={[styles.severityBadge, { backgroundColor: getSeverityColor(analysisResult?.severity || 'medium') }]}>
            <Text style={styles.severityText}>
              {getSeverityText(analysisResult?.severity || 'medium')}
            </Text>
          </View>
        </View>

        {/* Possible Causes */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Ionicons name="warning" size={24} color="#e74c3c" />
            <Text style={styles.sectionTitle}>Possible Causes</Text>
          </View>
          {analysisResult?.possibleCauses.map((cause, index) => (
            <View key={index} style={styles.listItem}>
              <Text style={styles.bulletPoint}>•</Text>
              <Text style={styles.listText}>{cause}</Text>
            </View>
          ))}
        </View>

        {/* Basic Treatment */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Ionicons name="medical" size={24} color="#3498db" />
            <Text style={styles.sectionTitle}>Basic Treatment</Text>
          </View>
          {analysisResult?.basicTreatment.map((treatment, index) => (
            <View key={index} style={styles.listItem}>
              <Text style={styles.bulletPoint}>•</Text>
              <Text style={styles.listText}>{treatment}</Text>
            </View>
          ))}
        </View>

        {/* When to Seek Doctor */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Ionicons name="alert-circle" size={24} color="#f39c12" />
            <Text style={styles.sectionTitle}>When to Seek a Doctor</Text>
          </View>
          {analysisResult?.whenToSeekDoctor.map((condition, index) => (
            <View key={index} style={styles.listItem}>
              <Text style={styles.bulletPoint}>•</Text>
              <Text style={styles.listText}>{condition}</Text>
            </View>
          ))}
        </View>

        {/* Recommended Foods */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Ionicons name="restaurant" size={24} color="#2ecc71" />
            <Text style={styles.sectionTitle}>Recommended Foods for Recovery</Text>
          </View>
          {analysisResult?.recommendedFoods.map((food, index) => (
            <View key={index} style={styles.listItem}>
              <Text style={styles.bulletPoint}>•</Text>
              <Text style={styles.listText}>{food}</Text>
            </View>
          ))}
        </View>

        {/* Disclaimer */}
        <View style={styles.disclaimerContainer}>
          <Text style={styles.disclaimerTitle}>Important Disclaimer</Text>
          <Text style={styles.disclaimerText}>
            This analysis is for informational purposes only and should not replace professional medical advice. 
            Always consult with a qualified healthcare provider for proper diagnosis and treatment.
          </Text>
        </View>
      </ScrollView>
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
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  loadingText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginTop: 20,
    textAlign: 'center',
  },
  loadingSubtext: {
    fontSize: 16,
    color: '#7f8c8d',
    marginTop: 10,
    textAlign: 'center',
  },
  content: {
    flex: 1,
  },
  summaryContainer: {
    backgroundColor: '#ffffff',
    padding: 20,
    margin: 20,
    borderRadius: 15,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  summaryTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 15,
  },
  summaryText: {
    fontSize: 18,
    color: '#34495e',
    marginBottom: 8,
  },
  highlight: {
    fontWeight: 'bold',
    color: '#3498db',
  },
  severityBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    marginTop: 10,
  },
  severityText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  sectionContainer: {
    backgroundColor: '#ffffff',
    padding: 20,
    margin: 20,
    borderRadius: 15,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginLeft: 10,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  bulletPoint: {
    fontSize: 18,
    color: '#3498db',
    marginRight: 10,
    marginTop: 2,
  },
  listText: {
    fontSize: 16,
    color: '#34495e',
    lineHeight: 22,
    flex: 1,
  },
  disclaimerContainer: {
    backgroundColor: '#fff3cd',
    padding: 20,
    margin: 20,
    borderRadius: 15,
    borderLeftWidth: 4,
    borderLeftColor: '#ffc107',
  },
  disclaimerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#856404',
    marginBottom: 10,
  },
  disclaimerText: {
    fontSize: 14,
    color: '#856404',
    lineHeight: 20,
  },
}); 