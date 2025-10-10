import { useMemo } from 'react';
import { useWindowDimensions } from 'react-native';

// Base sizes approximate iPhone X logical resolution
const BASE_WIDTH = 375;
const BASE_HEIGHT = 812;

export function useResponsive() {
  const { width, height } = useWindowDimensions();

  return useMemo(() => {
    const horizontalScale = width / BASE_WIDTH;
    const verticalScale = height / BASE_HEIGHT;
    const minScale = Math.min(horizontalScale, verticalScale);

    const clamp = (value: number, min: number, max: number) =>
      Math.max(min, Math.min(value, max));

    const size = (s: number, options?: { min?: number; max?: number }) => {
      const scaled = s * minScale;
      if (!options) return scaled;
      const { min = s * 0.7, max = s * 1.4 } = options;
      return clamp(scaled, min, max);
    };

    const font = (s: number) => size(s, { min: s * 0.8, max: s * 1.3 });
    const spacing = (s: number) => size(s, { min: s * 0.7, max: s * 1.5 });
    const icon = (s: number) => size(s, { min: s * 0.8, max: s * 1.4 });

    return { size, font, spacing, icon, scales: { horizontalScale, verticalScale, minScale } };
  }, [width, height]);
}


