import { Alert } from 'react-native';
import * as Location from 'expo-location';

export interface LocationData {
  latitude: number;
  longitude: number;
  pincode: string;
  city: string;
  address: string;
}

export const fetchCurrentLocation = async (): Promise<LocationData | null> => {
  try {
    const { status } = await Location.requestForegroundPermissionsAsync();
    
    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'Location permission is required to find nearby doctors and labs.');
      return null;
    }

    const position = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.Balanced,
    });

    const { latitude, longitude } = position.coords;

    const geocode = await Location.reverseGeocodeAsync({
      latitude,
      longitude
    });

    let pincode = '560001'; // Default fallback
    let city = 'Bengaluru';
    let address = 'Current Location';

    if (geocode && geocode.length > 0) {
      const g = geocode[0];
      pincode = g.postalCode || pincode;
      city = g.city || g.subregion || city;
      
      const parts = [g.name, g.street, city].filter(Boolean);
      if (parts.length > 0) {
        address = parts.join(', ');
      }
    }

    return {
      latitude,
      longitude,
      pincode,
      city,
      address
    };
  } catch (error) {
    console.log("Location error", error);
    Alert.alert('Location Error', 'Unable to fetch your live location. Make sure GPS is enabled.');
    return null;
  }
};
