import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useResponsive } from './utils/responsive';

export default function OrderMedicineScreen() {
  const router = useRouter();
  const R = useResponsive();
  const [medicineName, setMedicineName] = useState('');
  const [quantity, setQuantity] = useState('1');
  const [address, setAddress] = useState('');
  const [notes, setNotes] = useState('');
  const [scanImageUri, setScanImageUri] = useState<string | null>(null);

  const placeOrder = () => {
    if (!medicineName || !quantity || !address) {
      Alert.alert('Missing details', 'Please fill medicine, quantity and delivery address');
      return;
    }
    Alert.alert(
      'Order Placed',
      `Medicine: ${medicineName}\nQty: ${quantity}\nAddress: ${address}\nNotes: ${notes || 'N/A'}`,
    );
  };

  const scanMedicine = async () => {
    // Request permissions
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission required', 'Camera permission is needed to scan medicine');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: false,
      quality: 0.7,
    });

    if (!result.canceled) {
      const uri = result.assets?.[0]?.uri ?? null;
      setScanImageUri(uri);
      // Placeholder: in real integration, run OCR/barcode scan and parse medicine
      if (!medicineName) {
        setMedicineName('Scanned Medicine');
      }
      setNotes(prev => (prev ? prev + '\n' : ''));
      setNotes(prev => prev + 'Scanned image captured for identification.');
      Alert.alert('Scan captured', 'Image captured. We will use it to detect medicine.');
    }
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
    content: {
      flex: 1,
      padding: R.spacing(20),
    },
    card: {
      backgroundColor: '#ffffff',
      borderRadius: R.size(16),
      padding: R.spacing(16),
      elevation: 8,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 8,
    },
    secondaryButton: {
      alignSelf: 'flex-start',
      flexDirection: 'row',
      alignItems: 'center',
      gap: R.spacing(8),
      backgroundColor: '#eaf4ff',
      borderWidth: 1,
      borderColor: '#cfe6ff',
      paddingHorizontal: R.spacing(12),
      paddingVertical: R.spacing(8),
      borderRadius: R.size(10),
    },
    secondaryText: {
      color: '#3498db',
      fontWeight: '700',
    },
    label: {
      fontSize: R.font(14),
      color: '#7f8c8d',
      marginTop: R.spacing(12),
      marginBottom: R.spacing(6),
    },
    input: {
      borderWidth: 1,
      borderColor: '#e1e8ed',
      borderRadius: R.size(10),
      paddingHorizontal: R.spacing(12),
      paddingVertical: R.spacing(10),
      fontSize: R.font(16),
      color: '#2c3e50',
    },
    textarea: {
      minHeight: R.size(90),
      textAlignVertical: 'top',
    },
    primaryButton: {
      marginTop: R.spacing(16),
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#2ecc71',
      paddingVertical: R.spacing(14),
      borderRadius: R.size(12),
      elevation: 4,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 4,
      gap: R.spacing(10),
    },
    primaryText: {
      color: '#ffffff',
      fontSize: R.font(18),
      fontWeight: '700',
    },
    noteBox: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: R.spacing(8),
      marginTop: R.spacing(16),
      padding: R.spacing(12),
      backgroundColor: '#ecf5ff',
      borderRadius: R.size(10),
    },
    noteText: {
      color: '#2c3e50',
      flex: 1,
    },
  }), [R]);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={28} color="#2c3e50" />
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Order Medicine</Text>
      </View>

      <View style={styles.content}>
        <View style={styles.card}>
          <TouchableOpacity style={styles.secondaryButton} onPress={scanMedicine} activeOpacity={0.9}>
            <Ionicons name="scan" size={20} color="#3498db" />
            <Text style={styles.secondaryText}>Scan Medicine</Text>
          </TouchableOpacity>

          <Text style={styles.label}>Medicine Name</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g., Paracetamol 500mg"
            value={medicineName}
            onChangeText={setMedicineName}
          />

          <Text style={styles.label}>Quantity</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g., 2"
            keyboardType="numeric"
            value={quantity}
            onChangeText={setQuantity}
          />

          <Text style={styles.label}>Delivery Address</Text>
          <TextInput
            style={[styles.input, styles.textarea]}
            placeholder="Your full address"
            value={address}
            onChangeText={setAddress}
            multiline
          />

          <Text style={styles.label}>Notes (optional)</Text>
          <TextInput
            style={[styles.input, styles.textarea]}
            placeholder="e.g., Preferred delivery time"
            value={notes}
            onChangeText={setNotes}
            multiline
            numberOfLines={3}
          />

          <TouchableOpacity style={styles.primaryButton} onPress={placeOrder} activeOpacity={0.9}>
            <Ionicons name="cart" size={22} color="#ffffff" />
            <Text style={styles.primaryText}>Place Order</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.noteBox}>
          <Ionicons name="information-circle" size={20} color="#3498db" />
          <Text style={styles.noteText}>
            This is a demo UI. Provide your API key to enable real ordering.
          </Text>
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
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },
  secondaryButton: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#eaf4ff',
    borderWidth: 1,
    borderColor: '#cfe6ff',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
  },
  secondaryText: {
    color: '#3498db',
    fontWeight: '700',
  },
  label: {
    fontSize: 14,
    color: '#7f8c8d',
    marginTop: 12,
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: '#e1e8ed',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    color: '#2c3e50',
  },
  textarea: {
    minHeight: 90,
    textAlignVertical: 'top',
  },
  primaryButton: {
    marginTop: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2ecc71',
    paddingVertical: 14,
    borderRadius: 12,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    gap: 10,
  },
  primaryText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '700',
  },
  noteBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 16,
    padding: 12,
    backgroundColor: '#ecf5ff',
    borderRadius: 10,
  },
  noteText: {
    color: '#2c3e50',
    flex: 1,
  },
});


