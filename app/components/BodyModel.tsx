import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';

interface BodyModelProps {
  style?: any;
  onError?: () => void;
}

export default function BodyModel({ style }: BodyModelProps) {
  const { width } = Dimensions.get('window');
  const bodySize = Math.min(width * 0.6, 300);

  return (
    <View style={[styles.container, style]}>
      <View style={styles.bodyContainer}>
        {/* Head */}
        <View style={[styles.head, { width: bodySize * 0.2, height: bodySize * 0.2 }]} />
        
        {/* Neck */}
        <View style={[styles.neck, { width: bodySize * 0.08, height: bodySize * 0.08 }]} />
        
        {/* Torso */}
        <View style={[styles.torso, { width: bodySize * 0.3, height: bodySize * 0.4 }]} />
        
        {/* Left Arm */}
        <View style={[styles.leftArm, { width: bodySize * 0.06, height: bodySize * 0.25 }]} />
        
        {/* Right Arm */}
        <View style={[styles.rightArm, { width: bodySize * 0.06, height: bodySize * 0.25 }]} />
        
        {/* Left Leg */}
        <View style={[styles.leftLeg, { width: bodySize * 0.08, height: bodySize * 0.35 }]} />
        
        {/* Right Leg */}
        <View style={[styles.rightLeg, { width: bodySize * 0.08, height: bodySize * 0.35 }]} />
        
        {/* Eyes */}
        <View style={[styles.leftEye, { width: bodySize * 0.015, height: bodySize * 0.015 }]} />
        <View style={[styles.rightEye, { width: bodySize * 0.015, height: bodySize * 0.015 }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bodyContainer: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  head: {
    backgroundColor: '#fdbcb4',
    borderRadius: 50,
    position: 'absolute',
    top: 0,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  neck: {
    backgroundColor: '#fdbcb4',
    borderRadius: 25,
    position: 'absolute',
    top: '20%',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  torso: {
    backgroundColor: '#fdbcb4',
    borderRadius: 40,
    position: 'absolute',
    top: '28%',
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.25,
    shadowRadius: 6,
  },
  leftArm: {
    backgroundColor: '#fdbcb4',
    borderRadius: 20,
    position: 'absolute',
    top: '30%',
    left: '-25%',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  rightArm: {
    backgroundColor: '#fdbcb4',
    borderRadius: 20,
    position: 'absolute',
    top: '30%',
    right: '-25%',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  leftLeg: {
    backgroundColor: '#fdbcb4',
    borderRadius: 25,
    position: 'absolute',
    top: '68%',
    left: '-12%',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  rightLeg: {
    backgroundColor: '#fdbcb4',
    borderRadius: 25,
    position: 'absolute',
    top: '68%',
    right: '-12%',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  leftEye: {
    backgroundColor: '#2c3e50',
    borderRadius: 50,
    position: 'absolute',
    top: '8%',
    left: '35%',
  },
  rightEye: {
    backgroundColor: '#2c3e50',
    borderRadius: 50,
    position: 'absolute',
    top: '8%',
    right: '35%',
  },
}); 