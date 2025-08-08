import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface MedicalImage {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  symptoms: string[];
}

export default function BodyPartDetailScreen() {
  const router = useRouter();
  const { part } = useLocalSearchParams<{ part: string }>();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  // Mock medical images data - in real app, this would come from an API
  const medicalImages: MedicalImage[] = [
    {
      id: '1',
      name: 'Redness',
      description: 'Eye redness and irritation',
      imageUrl: 'https://via.placeholder.com/150/FF6B6B/FFFFFF?text=Redness',
      symptoms: ['Redness', 'Irritation', 'Itching', 'Watery eyes']
    },
    {
      id: '2',
      name: 'Swelling',
      description: 'Swollen and puffy appearance',
      imageUrl: 'https://via.placeholder.com/150/4ECDC4/FFFFFF?text=Swelling',
      symptoms: ['Swelling', 'Pain', 'Tenderness', 'Difficulty opening']
    },
    {
      id: '3',
      name: 'Discharge',
      description: 'Yellow or green discharge',
      imageUrl: 'https://via.placeholder.com/150/45B7D1/FFFFFF?text=Discharge',
      symptoms: ['Discharge', 'Crusting', 'Sticky eyelids', 'Blurred vision']
    },
    {
      id: '4',
      name: 'Dryness',
      description: 'Dry and irritated eyes',
      imageUrl: 'https://via.placeholder.com/150/96CEB4/FFFFFF?text=Dryness',
      symptoms: ['Dryness', 'Burning', 'Gritty feeling', 'Light sensitivity']
    },
    {
      id: '5',
      name: 'Bruising',
      description: 'Dark circles and bruising',
      imageUrl: 'https://via.placeholder.com/150/FFEAA7/FFFFFF?text=Bruising',
      symptoms: ['Bruising', 'Dark circles', 'Pain', 'Tenderness']
    },
    {
      id: '6',
      name: 'Rash',
      description: 'Skin rash around the area',
      imageUrl: 'https://via.placeholder.com/150/DDA0DD/FFFFFF?text=Rash',
      symptoms: ['Rash', 'Itching', 'Redness', 'Bumps']
    }
  ];

  const handleImageSelect = (imageId: string) => {
    setSelectedImage(imageId);
    const selectedImageData = medicalImages.find(img => img.id === imageId);
    
    if (selectedImageData) {
      Alert.alert(
        'Analyze Symptoms',
        `Would you like to analyze "${selectedImageData.name}" symptoms?`,
        [
          { text: 'Cancel', style: 'cancel' },
          { 
            text: 'Analyze', 
            onPress: () => router.push(`/ai-analysis?part=${encodeURIComponent(part || '')}&symptom=${encodeURIComponent(selectedImageData.name)}`)
          }
        ]
      );
    }
  };

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
        <Text style={styles.title}>{part} Symptoms</Text>
      </View>

      {/* Content */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.infoContainer}>
          <Text style={styles.infoText}>
            Select the image that best matches your symptoms:
          </Text>
        </View>

        {/* Medical Images Grid */}
        <View style={styles.imagesContainer}>
          <Text style={styles.imagesTitle}>Common Symptoms:</Text>
          <View style={styles.imagesGrid}>
            {medicalImages.map((image) => (
              <TouchableOpacity
                key={image.id}
                style={[
                  styles.imageCard,
                  selectedImage === image.id && styles.selectedImageCard
                ]}
                onPress={() => handleImageSelect(image.id)}
              >
                <View style={styles.imageContainer}>
                  <Image
                    source={{ uri: image.imageUrl }}
                    style={styles.image}
                    resizeMode="cover"
                  />
                </View>
                <View style={styles.imageInfo}>
                  <Text style={styles.imageName}>{image.name}</Text>
                  <Text style={styles.imageDescription}>{image.description}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Instructions */}
        <View style={styles.instructionsContainer}>
          <Text style={styles.instructionsTitle}>Instructions:</Text>
          <Text style={styles.instructionsText}>
            • Tap on the image that best matches your symptoms{'\n'}
            • The AI will analyze your selection and provide recommendations{'\n'}
            • Always consult a doctor for serious symptoms{'\n'}
            • This is for informational purposes only
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
  content: {
    flex: 1,
  },
  infoContainer: {
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
  infoText: {
    fontSize: 18,
    color: '#2c3e50',
    textAlign: 'center',
    lineHeight: 24,
  },
  imagesContainer: {
    padding: 20,
  },
  imagesTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 20,
    textAlign: 'center',
  },
  imagesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  imageCard: {
    width: '48%',
    backgroundColor: '#ffffff',
    borderRadius: 15,
    marginBottom: 20,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  selectedImageCard: {
    borderWidth: 3,
    borderColor: '#3498db',
  },
  imageContainer: {
    height: 120,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  imageInfo: {
    padding: 15,
  },
  imageName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 5,
  },
  imageDescription: {
    fontSize: 14,
    color: '#7f8c8d',
    lineHeight: 18,
  },
  instructionsContainer: {
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
  instructionsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 15,
  },
  instructionsText: {
    fontSize: 16,
    color: '#34495e',
    lineHeight: 24,
  },
}); 