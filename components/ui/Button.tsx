import { Pressable, Text, StyleSheet } from 'react-native';

type ButtonProps = {
  label: string;
  onPress: () => void;
  variant?: 'primary' | 'success' | 'danger' | 'ghost';
  fullWidth?: boolean;
};

export default function Button({
  label,
  onPress,
  variant = 'primary',
  fullWidth = false,
}: ButtonProps) {
  return (
    <Pressable
      style={[styles.base, styles[variant], fullWidth && styles.fullWidth]}
      onPress={onPress}
    >
      <Text style={[styles.text, variant === 'ghost' && styles.ghostText]}>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
  },
  primary: {
    backgroundColor: '#6C63FF',
  },
  success: {
    backgroundColor: '#22c55e',
  },
  danger: {
    backgroundColor: '#ef4444',
  },
  ghost: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#6C63FF',
  },
  fullWidth: {
    width: '100%',
  },
  text: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  ghostText: {
    color: '#6C63FF',
  },
});
