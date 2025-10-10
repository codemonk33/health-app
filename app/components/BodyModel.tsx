import { useMemo } from 'react';
import { StyleSheet, useWindowDimensions, View } from 'react-native';

interface BodyModelProps {
  // Optional container style override
  style?: any;
  // Optional explicit size override (in dp). If omitted, size is computed responsively
  sizeDp?: number;
}

export default function BodyModel({ style, sizeDp }: BodyModelProps) {
  const { width, height } = useWindowDimensions();

  // Compute a robust body size: responsive to orientation with min/max clamps
  const bodySize = useMemo(() => {
    const minWindowDim = Math.min(width, height);
    const computed = sizeDp ?? minWindowDim * 0.6;
    const CLAMP_MIN = 160; // dp
    const CLAMP_MAX = 420; // dp
    return Math.max(CLAMP_MIN, Math.min(computed, CLAMP_MAX));
  }, [width, height, sizeDp]);

  // Proportions (as fractions of bodySize)
  const P = useMemo(() => ({
    headW: 0.22, headH: 0.22,
    neckW: 0.08, neckH: 0.06,
    torsoW: 0.34, torsoH: 0.46,
    armW: 0.06, armH: 0.30,
    legW: 0.09, legH: 0.38,
    eyeD: 0.018,
  }), []);

  // Derived absolute sizes
  const S = useMemo(() => ({
    headW: bodySize * P.headW, headH: bodySize * P.headH,
    neckW: bodySize * P.neckW, neckH: bodySize * P.neckH,
    torsoW: bodySize * P.torsoW, torsoH: bodySize * P.torsoH,
    armW: bodySize * P.armW, armH: bodySize * P.armH,
    legW: bodySize * P.legW, legH: bodySize * P.legH,
    eyeD: bodySize * P.eyeD,
  }), [bodySize, P]);

  // Vertical layout (top positions) with slight overlaps for continuity
  const positions = useMemo(() => {
    const headTop = 0;
    const neckTop = headTop + S.headH - bodySize * 0.02;
    const torsoTop = neckTop + S.neckH - bodySize * 0.01;
    const armsTop = torsoTop + bodySize * 0.04;
    const legsTop = torsoTop + S.torsoH - bodySize * 0.02;
    const canvasHeight = Math.ceil(legsTop + S.legH);

    // Eyes centered horizontally inside head
    const centerX = bodySize / 2;
    const headLeft = centerX - S.headW / 2;
    const eyeY = headTop + S.headH * 0.42;
    const eyeOffsetX = S.headW * 0.20;

    return {
      headTop,
      neckTop,
      torsoTop,
      armsTop,
      legsTop,
      canvasHeight,
      headLeft,
      leftEye: { x: centerX - eyeOffsetX - S.eyeD / 2, y: eyeY },
      rightEye: { x: centerX + eyeOffsetX - S.eyeD / 2, y: eyeY },
    };
  }, [S, bodySize]);

  return (
    <View style={[styles.container, style]}>
      <View style={[styles.bodyContainer, { width: bodySize, height: positions.canvasHeight }]}>
        {/* Head */}
        <View
          style={[
            styles.head,
            {
              width: S.headW,
              height: S.headH,
              top: positions.headTop,
              left: positions.headLeft,
            },
          ]}
        />

        {/* Neck */}
        <View
          style={[
            styles.neck,
            {
              width: S.neckW,
              height: S.neckH,
              top: positions.neckTop,
              left: bodySize / 2 - S.neckW / 2,
            },
          ]}
        />

        {/* Torso */}
        <View
          style={[
            styles.torso,
            {
              width: S.torsoW,
              height: S.torsoH,
              top: positions.torsoTop,
              left: bodySize / 2 - S.torsoW / 2,
            },
          ]}
        />

        {/* Left Arm */}
        <View
          style={[
            styles.limb,
            styles.leftArm,
            {
              width: S.armW,
              height: S.armH,
              top: positions.armsTop,
              left: bodySize / 2 - S.torsoW / 2 - S.armW,
            },
          ]}
        />

        {/* Right Arm */}
        <View
          style={[
            styles.limb,
            styles.rightArm,
            {
              width: S.armW,
              height: S.armH,
              top: positions.armsTop,
              left: bodySize / 2 + S.torsoW / 2,
            },
          ]}
        />

        {/* Left Leg */}
        <View
          style={[
            styles.limb,
            styles.leftLeg,
            {
              width: S.legW,
              height: S.legH,
              top: positions.legsTop,
              left: bodySize / 2 - S.torsoW * 0.25 - S.legW,
            },
          ]}
        />

        {/* Right Leg */}
        <View
          style={[
            styles.limb,
            styles.rightLeg,
            {
              width: S.legW,
              height: S.legH,
              top: positions.legsTop,
              left: bodySize / 2 + S.torsoW * 0.25,
            },
          ]}
        />

        {/* Eyes */}
        <View
          style={[
            styles.eye,
            {
              width: S.eyeD,
              height: S.eyeD,
              top: positions.leftEye.y,
              left: positions.leftEye.x,
            },
          ]}
        />
        <View
          style={[
            styles.eye,
            {
              width: S.eyeD,
              height: S.eyeD,
              top: positions.rightEye.y,
              left: positions.rightEye.x,
            },
          ]}
        />
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
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  neck: {
    backgroundColor: '#fdbcb4',
    borderRadius: 25,
    position: 'absolute',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  torso: {
    backgroundColor: '#fdbcb4',
    borderRadius: 40,
    position: 'absolute',
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
  },
  limb: {
    backgroundColor: '#fdbcb4',
    position: 'absolute',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  leftArm: {
    borderRadius: 20,
    position: 'absolute',
  },
  rightArm: {
    borderRadius: 20,
    position: 'absolute',
  },
  leftLeg: {
    borderRadius: 25,
    position: 'absolute',
  },
  rightLeg: {
    borderRadius: 25,
    position: 'absolute',
  },
  eye: {
    backgroundColor: '#2c3e50',
    borderRadius: 50,
    position: 'absolute',
  },
}); 