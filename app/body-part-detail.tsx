import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface MedicalImage {
  id: string;
  name: string;
  description: string;
  imageUrl?: string;
  image?: any; // For local require() images
  symptoms: string[];
}

// Map body parts to doctor specialties
const bodyPartToSpecialty: Record<string, string> = {
  'Head': 'Neurologist',
  'Eyes': 'Ophthalmologist',
  'Ears': 'ENT Specialist',
  'Nose': 'ENT Specialist',
  'Mouth': 'Dentist',
  'Neck': 'ENT Specialist',
  'Chest': 'Cardiologist',
  'Stomach': 'Gastroenterologist',
  'Left Arm': 'Orthopedic Surgeon',
  'Right Arm': 'Orthopedic Surgeon',
  'Left Leg': 'Orthopedic Surgeon',
  'Right Leg': 'Orthopedic Surgeon',
};

// Mock medical images data - in real app, this would come from an API
const bodyPartSymptoms: Record<string, MedicalImage[]> = {
  'Eyes': [
    {
      id: '1',
      name: 'Redness',
      description: 'Eye redness and irritation',
      image: require('../assets/images/eye redness.jpg'),
      symptoms: ['Redness', 'Irritation', 'Itching', 'Watery eyes']
    },
    {
      id: '2',
      name: 'Swelling',
      description: 'Swollen and puffy appearance',
      image: require('../assets/images/swelling eye.jpeg'),
      symptoms: ['Swelling', 'Pain', 'Tenderness', 'Difficulty opening']
    },
    {
      id: '3',
      name: 'Discharge',
      description: 'Yellow or green discharge',
      image: require('../assets/images/eye discharge.jpg'),
      symptoms: ['Discharge', 'Crusting', 'Sticky eyelids', 'Blurred vision']
    },
    {
      id: '4',
      name: 'Dryness',
      description: 'Dry and irritated eyes',
      image: require('../assets/images/dry eyes.jpg'),
      symptoms: ['Dryness', 'Burning', 'Gritty feeling', 'Light sensitivity']
    },
    {
      id: '5',
      name: 'Bruising',
      description: 'Dark circles and bruising',
      image: require('../assets/images/eye bruising.webp'),
      symptoms: ['Bruising', 'Dark circles', 'Pain', 'Tenderness']
    },
    {
      id: '6',
      name: 'Rash',
      description: 'Skin rash around the area',
      image: require('../assets/images/eye rash.jpg'),
      symptoms: ['Rash', 'Itching', 'Redness', 'Bumps']
    }
  ],
  'Head': [
    {
      id: '7',
      name: 'Headache',
      description: 'Severe headache',
      image: require('../assets/images/Headache.png'),
      symptoms: ['Headache', 'Nausea', 'Vomiting', 'Sensitivity to light']
    },
    {
      id: '8',
      name: 'Dizziness',
      description: 'Feeling lightheaded or dizzy',
      image: require('../assets/images/Dizziness.png'),
      symptoms: ['Dizziness', 'Vertigo', 'Balance problems', 'Fainting']
    },
    {
      id: '9',
      name: 'Tinnitus',
      description: 'Ringing or buzzing in the ears',
      image: require('../assets/images/Tinnitus.png'),
      symptoms: ['Tinnitus', 'Hearing loss', 'Ear pain', 'Vertigo']
    },
    {
      id: '10',
      name: 'Migraine',
      description: 'Severe headache with visual disturbances',
      image: require('../assets/images/Migraine.png'),
      symptoms: ['Migraine', 'Aura', 'Nausea', 'Sensitivity to light']
    },
    {
      id: '11',
      name: 'Concussion',
      description: 'Head injury causing confusion',
      image: require('../assets/images/Concussion.png'),
      symptoms: ['Confusion', 'Memory loss', 'Headache', 'Dizziness']
    },
    {
      id: '12',
      name: 'Facial Pain',
      description: 'Pain or numbness in the face',
      image: require('../assets/images/Facial Pain.jpg'),
      symptoms: ['Facial pain', 'Numbness', 'Tingling', 'Headache']
    }
  ],
  'Ears': [
    {
      id: '13',
      name: 'Earache',
      description: 'Pain in the ear',
      image: require('../assets/images/Earache.png'),
      symptoms: ['Earache', 'Hearing loss', 'Tinnitus', 'Dizziness']
    },
    {
      id: '14',
      name: 'Ear Infection',
      description: 'Inflammation or infection in the ear',
      image: require('../assets/images/Ear Infection.png'),
      symptoms: ['Earache', 'Fever', 'Drainage', 'Hearing loss']
    },
    {
      id: '15',
      name: 'Tinnitus',
      description: 'Ringing or buzzing in the ears',
      image: require('../assets/images/Tinnitus.png'),
      symptoms: ['Tinnitus', 'Hearing loss', 'Ear pain', 'Vertigo']
    },
    {
      id: '16',
      name: 'Earwax Buildup',
      description: 'Excessive earwax accumulation',
      image: require('../assets/images/Earwax Buildup.png'),
      symptoms: ['Earwax buildup', 'Itching', 'Hearing loss', 'Dizziness']
    },
    {
      id: '17',
      name: 'Ear Injury',
      description: 'Injury to the outer ear',
      image: require('../assets/images/Ear Injury.jpg'),
      symptoms: ['Ear pain', 'Bleeding', 'Hearing loss', 'Dizziness']
    },
    {
      id: '18',
      name: 'Ear Deafness',
      description: 'Loss of hearing in the ear',
      image: require('../assets/images/Ear Deafness.png'),
      symptoms: ['Hearing loss', 'Tinnitus', 'Balance problems', 'Vertigo']
    }
  ],
  'Nose': [
    {
      id: '19',
      name: 'Nasal Congestion',
      description: 'Blocked nose',
      image: require('../assets/images/Nasal Congestion.png'),
      symptoms: ['Nasal congestion', 'Sneezing', 'Runny nose', 'Postnasal drip']
    },
    {
      id: '20',
      name: 'Sinus Infection',
      description: 'Inflammation or infection in the sinuses',
      image: require('../assets/images/Sinus Infection.png'),
      symptoms: ['Nasal congestion', 'Facial pain', 'Headache', 'Fever']
    },
    {
      id: '21',
      name: 'Nosebleed',
      description: 'Bleeding from the nose',
      image: require('../assets/images/Nosebleed.png'),
      symptoms: ['Nosebleed', 'Nasal congestion', 'Headache', 'Dizziness']
    },
    {
      id: '22',
      name: 'Nasal Polyps',
      description: 'Noncancerous growths in the nasal passages',
      image: require('../assets/images/Nasal Polyps.png'),
      symptoms: ['Nasal congestion', 'Sneezing', 'Postnasal drip', 'Facial pain']
    },
    {
      id: '23',
      name: 'Nose Injury',
      description: 'Injury to the nose',
      image: require('../assets/images/Nose Injury.jpg'),
      symptoms: ['Nosebleed', 'Nasal congestion', 'Facial pain', 'Headache']
    },
    {
      id: '24',
      name: 'Nose Deformity',
      description: 'Abnormal shape or structure of the nose',
      image: require('../assets/images/Nose Deformity.png'),
      symptoms: ['Nasal obstruction', 'Facial asymmetry', 'Breathing difficulties', 'Cosmetic concerns']
    }
  ],
  'Mouth': [
    {
      id: '25',
      name: 'Toothache',
      description: 'Pain in a tooth',
      image: require('../assets/images/Toothache.png'),
      symptoms: ['Toothache', 'Sensitivity to heat/cold', 'Swelling', 'Pus']
    },
    {
      id: '26',
      name: 'Gum Infection',
      description: 'Inflammation or infection of the gums',
      image: require('../assets/images/Gum Infection.png'),
      symptoms: ['Gum pain', 'Redness', 'Swelling', 'Bleeding']
    },
    {
      id: '27',
      name: 'Bad Breath',
      description: 'Persistent bad breath',
      image: require('../assets/images/Bad Breath.png'),
      symptoms: ['Bad breath', 'Halitosis', 'Dental plaque', 'Gum disease']
    },
    {
      id: '28',
      name: 'Tooth Decay',
      description: 'Holes or cavities in the teeth',
      image: require('../assets/images/Tooth Decay.png'),
      symptoms: ['Toothache', 'Sensitivity to sweet foods', 'Tooth discoloration', 'Tooth loss']
    },
    {
      id: '29',
      name: 'Tooth Loss',
      description: 'Loss of one or more teeth',
      image: require('../assets/images/Tooth Loss.png'),
      symptoms: ['Tooth loss', 'Gum recession', 'Bite problems', 'Speech difficulties']
    },
    {
      id: '30',
      name: 'Mouth Injury',
      description: 'Injury to the mouth or lips',
      image: require('../assets/images/Mouth Injury.png'),
      symptoms: ['Mouth pain', 'Bleeding', 'Swelling', 'Lip injury']
    }
  ],
  'Neck': [
    {
      id: '31',
      name: 'Neck Pain',
      description: 'Pain or discomfort in the neck',
      image: require('../assets/images/Neck Pain.png'),
      symptoms: ['Neck pain', 'Headache', 'Stiffness', 'Limited mobility']
    },
    {
      id: '32',
      name: 'Whiplash',
      description: 'Neck injury from a sudden jerking motion',
      image: require('../assets/images/Whiplash.png'),
      symptoms: ['Neck pain', 'Headache', 'Stiffness', 'Dizziness']
    },
    {
      id: '33',
      name: 'Neck Injury',
      description: 'Injury to the neck',
      image: require('../assets/images/Neck Injury.jpg.webp'),
      symptoms: ['Neck pain', 'Headache', 'Stiffness', 'Numbness']
    },
    {
      id: '34',
      name: 'Neck Swelling',
      description: 'Swelling in the neck area',
      image: require('../assets/images/Neck Swelling.png'),
      symptoms: ['Neck swelling', 'Pain', 'Limited mobility', 'Breathing difficulties']
    },
    {
      id: '35',
      name: 'Neck Stiffness',
      description: 'Neck stiffness or limited mobility',
      image: require('../assets/images/Neck Stiffness.png'),
      symptoms: ['Neck stiffness', 'Limited mobility', 'Headache', 'Dizziness']
    },
    {
      id: '36',
      name: 'Neck Lump',
      description: 'Lump or growth in the neck area',
      image: require('../assets/images/Neck Lump.jpg'),
      symptoms: ['Neck lump', 'Pain', 'Swelling', 'Headache']
    }
  ],
  'Chest': [
    {
      id: '37',
      name: 'Chest Pain',
      description: 'Pain or discomfort in the chest',
      image: require('../assets/images/Chest Pain.png'),
      symptoms: ['Chest pain', 'Shortness of breath', 'Heartburn', 'Cough']
    },
    {
      id: '38',
      name: 'Heart Attack',
      description: 'Severe chest pain or discomfort',
      image: require('../assets/images/Heart Attack.png'),
      symptoms: ['Chest pain', 'Shortness of breath', 'Nausea', 'Sweating']
    },
    {
      id: '39',
      name: 'Breathing Difficulties',
      description: 'Difficulty breathing',
      image: require('../assets/images/Breathing Difficulties.png'),
      symptoms: ['Shortness of breath', 'Wheezing', 'Cough', 'Chest tightness']
    },
    {
      id: '40',
      name: 'Chest Injury',
      description: 'Injury to the chest',
      image: require('../assets/images/Chest Injury.png'),
      symptoms: ['Chest pain', 'Bruising', 'Swelling', 'Breathing difficulties']
    },
    {
      id: '41',
      name: 'Chest Lump',
      description: 'Lump or growth in the chest area',
      imageUrl: 'https://via.placeholder.com/150/FFEAA7/FFFFFF?text=Chest+Lump',
      symptoms: ['Chest lump', 'Pain', 'Swelling', 'Breathing difficulties']
    },
    {
      id: '42',
      name: 'Chest Swelling',
      description: 'Swelling in the chest area',
      imageUrl: 'https://via.placeholder.com/150/DDA0DD/FFFFFF?text=Chest+Swelling',
      symptoms: ['Chest swelling', 'Pain', 'Breathing difficulties', 'Cough']
    }
  ],
  'Stomach': [
    {
      id: '43',
      name: 'Stomachache',
      description: 'Pain or discomfort in the stomach',
      image: require('../assets/images/Stomachache.png'),
      symptoms: ['Stomachache', 'Nausea', 'Vomiting', 'Bloating']
    },
    {
      id: '44',
      name: 'Indigestion',
      description: 'Difficulty digesting food',
      image: require('../assets/images/indigestion stomach.png'),
      symptoms: ['Stomachache', 'Bloating', 'Heartburn', 'Nausea']
    },
    {
      id: '45',
      name: 'Heartburn',
      description: 'Burning sensation in the chest',
      image: require('../assets/images/Heartburn.png'),
      symptoms: ['Heartburn', 'Chest pain', 'Regurgitation', 'Nausea']
    },
    {
      id: '46',
      name: 'Stomach Infection',
      description: 'Infection in the stomach',
      image: require('../assets/images/Stomach Infection.png'),
      symptoms: ['Stomachache', 'Nausea', 'Vomiting', 'Fever']
    },
    {
      id: '47',
      name: 'Stomach Ulcer',
      description: 'Sore or ulcer in the stomach',
      image: require('../assets/images/Stomach Ulcer.png'),
      symptoms: ['Stomachache', 'Bloating', 'Nausea', 'Vomiting']
    },
    {
      id: '48',
      name: 'Stomach Lump',
      description: 'Lump or growth in the stomach area',
      image: require('../assets/images/Stomach Lump.jpg'),
      symptoms: ['Stomach lump', 'Pain', 'Swelling', 'Bloating']
    }
  ],
  'Left Arm': [
    {
      id: '49',
      name: 'Arm Pain',
      description: 'Pain or discomfort in the arm',
      image: require('../assets/images/Arm Pain.png'),
      symptoms: ['Arm pain', 'Numbness', 'Tingling', 'Weakness']
    },
    {
      id: '50',
      name: 'Arm Injury',
      description: 'Injury to the arm',
      image: require('../assets/images/Arm Injury.png'),
      symptoms: ['Arm pain', 'Bruising', 'Swelling', 'Limited mobility']
    },
    {
      id: '51',
      name: 'Arm Swelling',
      description: 'Swelling in the arm',
      image: require('../assets/images/Arm Swelling.jpeg'),
      symptoms: ['Arm swelling', 'Pain', 'Limited mobility', 'Redness']
    },
    {
      id: '52',
      name: 'Arm Numbness',
      description: 'Numbness or tingling in the arm',
      image: require('../assets/images/Arm Numbness.png'),
      symptoms: ['Numbness', 'Tingling', 'Weakness', 'Pain']
    },
    {
      id: '53',
      name: 'Arm Lump',
      description: 'Lump or growth in the arm',
      image: require('../assets/images/Arm Lump.jpg'),
      symptoms: ['Arm lump', 'Pain', 'Swelling', 'Limited mobility']
    },
    {
      id: '54',
      name: 'Arm Weakness',
      description: 'Weakness or loss of strength in the arm',
      image: require('../assets/images/Arm Weakness.jpg'),
      symptoms: ['Weakness', 'Limited mobility', 'Pain', 'Numbness']
    }
  ],
  'Right Arm': [
    {
      id: '55',
      name: 'Arm Pain',
      description: 'Pain or discomfort in the arm',
      image: require('../assets/images/Arm Pain.png'),
      symptoms: ['Arm pain', 'Numbness', 'Tingling', 'Weakness']
    },
    {
      id: '56',
      name: 'Arm Injury',
      description: 'Injury to the arm',
      image: require('../assets/images/Arm Injury.png'),
      symptoms: ['Arm pain', 'Bruising', 'Swelling', 'Limited mobility']
    },
    {
      id: '57',
      name: 'Arm Swelling',
      description: 'Swelling in the arm',
      image: require('../assets/images/Arm Swelling.jpeg'),
      symptoms: ['Arm swelling', 'Pain', 'Limited mobility', 'Redness']
    },
    {
      id: '58',
      name: 'Arm Numbness',
      description: 'Numbness or tingling in the arm',
      image: require('../assets/images/Arm Numbness.png'),
      symptoms: ['Numbness', 'Tingling', 'Weakness', 'Pain']
    },
    {
      id: '59',
      name: 'Arm Lump',
      description: 'Lump or growth in the arm',
      image: require('../assets/images/Arm Lump.jpg'),
      symptoms: ['Arm lump', 'Pain', 'Swelling', 'Limited mobility']
    },
    {
      id: '60',
      name: 'Arm Weakness',
      description: 'Weakness or loss of strength in the arm',
      image: require('../assets/images/Arm Weakness.jpg'),
      symptoms: ['Weakness', 'Limited mobility', 'Pain', 'Numbness']
    }
  ],
  'Left Leg': [
    {
      id: '61',
      name: 'Leg Pain',
      description: 'Pain or discomfort in the leg',
      image: require('../assets/images/Leg Pain.png'),
      symptoms: ['Leg pain', 'Numbness', 'Tingling', 'Weakness']
    },
    {
      id: '62',
      name: 'Leg Injury',
      description: 'Injury to the leg',
      image: require('../assets/images/Leg Injury.jpg'),
      symptoms: ['Leg pain', 'Bruising', 'Swelling', 'Limited mobility']
    },
    {
      id: '63',
      name: 'Leg Swelling',
      description: 'Swelling in the leg',
      image: require('../assets/images/Leg Swelling.jpg'),
      symptoms: ['Leg swelling', 'Pain', 'Limited mobility', 'Redness']
    },
    {
      id: '64',
      name: 'Leg Numbness',
      description: 'Numbness or tingling in the leg',
      image: require('../assets/images/Leg Numbness.jpeg'),
      symptoms: ['Numbness', 'Tingling', 'Weakness', 'Pain']
    },
    {
      id: '65',
      name: 'Leg Lump',
      description: 'Lump or growth in the leg',
      image: require('../assets/images/Leg Lump.jpg'),
      symptoms: ['Leg lump', 'Pain', 'Swelling', 'Limited mobility']
    },
    {
      id: '66',
      name: 'Leg Weakness',
      description: 'Weakness or loss of strength in the leg',
      image: require('../assets/images/Leg Weakness.jpg'),
      symptoms: ['Weakness', 'Limited mobility', 'Pain', 'Numbness']
    }
  ],
  'Right Leg': [
    {
      id: '67',
      name: 'Leg Pain',
      description: 'Pain or discomfort in the leg',
      image: require('../assets/images/Leg Pain.png'),
      symptoms: ['Leg pain', 'Numbness', 'Tingling', 'Weakness']
    },
    {
      id: '68',
      name: 'Leg Injury',
      description: 'Injury to the leg',
      image: require('../assets/images/Leg Injury.jpg'),
      symptoms: ['Leg pain', 'Bruising', 'Swelling', 'Limited mobility']
    },
    {
      id: '69',
      name: 'Leg Swelling',
      description: 'Swelling in the leg',
      image: require('../assets/images/Leg Swelling.jpg'),
      symptoms: ['Leg swelling', 'Pain', 'Limited mobility', 'Redness']
    },
    {
      id: '70',
      name: 'Leg Numbness',
      description: 'Numbness or tingling in the leg',
      image: require('../assets/images/Leg Numbness.jpeg'),
      symptoms: ['Numbness', 'Tingling', 'Weakness', 'Pain']
    },
    {
      id: '71',
      name: 'Leg Lump',
      description: 'Lump or growth in the leg',
      image: require('../assets/images/Leg Lump.jpg'),
      symptoms: ['Leg lump', 'Pain', 'Swelling', 'Limited mobility']
    },
    {
      id: '72',
      name: 'Leg Weakness',
      description: 'Weakness or loss of strength in the leg',
      image: require('../assets/images/Leg Weakness.jpg'),
      symptoms: ['Weakness', 'Limited mobility', 'Pain', 'Numbness']
    }
  ],
};

export default function BodyPartDetailScreen() {
  const router = useRouter();
  const { part } = useLocalSearchParams<{ part: string }>();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  // Get symptoms for the selected body part, default to Eyes if not found
  const medicalImages: MedicalImage[] = bodyPartSymptoms[part || 'Eyes'] || bodyPartSymptoms['Eyes'];
  
  // Get the appropriate doctor specialty for this body part
  const doctorSpecialty = bodyPartToSpecialty[part || ''] || 'General Physician';

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

  const handleBookDoctor = () => {
    router.push(`/appointments?specialty=${encodeURIComponent(doctorSpecialty)}`);
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
        {/* Book Doctor Button - Add this new section */}
        <View style={styles.bookDoctorContainer}>
          <TouchableOpacity
            style={styles.bookDoctorButton}
            onPress={handleBookDoctor}
            activeOpacity={0.9}
          >
            <Ionicons name="medical" size={24} color="#ffffff" />
            <Text style={styles.bookDoctorText}>Book {doctorSpecialty}</Text>
            <Ionicons name="chevron-forward" size={20} color="#ffffff" />
          </TouchableOpacity>
          <Text style={styles.bookDoctorSubtext}>
            Consult a specialist for {part} related issues
          </Text>
        </View>

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
                    source={image.image || { uri: image.imageUrl }}
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
  
  // Add these new styles:
  bookDoctorContainer: {
    padding: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  bookDoctorButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#27ae60',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 12,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    gap: 10,
  },
  bookDoctorText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '700',
    flex: 1,
    textAlign: 'center',
  },
  bookDoctorSubtext: {
    fontSize: 14,
    color: '#7f8c8d',
    textAlign: 'center',
    marginTop: 8,
  },
});