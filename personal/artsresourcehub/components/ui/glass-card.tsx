import { BlurView } from 'expo-blur';
import * as React from 'react';
import { Platform, StyleSheet, View, type ViewProps } from 'react-native';

const IOS_VERSION = Platform.OS === 'ios' ? parseInt(String(Platform.Version), 10) : 0;
const IS_IOS_26 = IOS_VERSION >= 26;

type GlassCardProps = ViewProps & {
  intensity?: number;
  variant?: 'light' | 'dark';
  children?: React.ReactNode;
};

export function GlassCard({ intensity = 60, variant = 'light', style, children, ...rest }: GlassCardProps) {
  if (Platform.OS === 'android' || Platform.OS === 'web') {
    return (
      <View
        style={[
          styles.fallback,
          variant === 'dark' ? styles.fallbackDark : styles.fallbackLight,
          style,
        ]}
        {...rest}>
        {children}
      </View>
    );
  }

  const tint = IS_IOS_26
    ? variant === 'dark' ? 'systemUltraThinMaterialDark' : 'systemUltraThinMaterial'
    : variant === 'dark' ? 'dark' : 'light';

  return (
    <BlurView
      intensity={IS_IOS_26 ? 80 : intensity}
      tint={tint as any}
      style={[styles.base, IS_IOS_26 && styles.liquidBorder, style]}
      {...rest}>
      {IS_IOS_26 && (
        <View
          pointerEvents="none"
          style={[StyleSheet.absoluteFill, variant === 'dark' ? styles.shimmerDark : styles.shimmerLight]}
        />
      )}
      {children}
    </BlurView>
  );
}

const styles = StyleSheet.create({
  base: {
    overflow: 'hidden',
    borderRadius: 20,
  },
  liquidBorder: {
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(255, 255, 255, 0.45)',
  },
  shimmerLight: {
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.18)',
  },
  shimmerDark: {
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.12)',
  },
  fallback: {
    borderRadius: 20,
    overflow: 'hidden',
    elevation: 2,
  },
  fallbackLight: {
    backgroundColor: 'rgba(255, 255, 255, 0.82)',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(0, 0, 0, 0.08)',
  },
  fallbackDark: {
    backgroundColor: 'rgba(30, 30, 30, 0.82)',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
});
