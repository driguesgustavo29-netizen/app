import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { colors, radius, shadow } from '../theme';

// variant: 'primary' | 'secondary' | 'outline' | 'ghost'
export default function Button({ title, onPress, disabled, style, variant = 'primary' }) {
  const variantStyle =
    variant === 'secondary' ? styles.secondary :
    variant === 'outline' ? styles.outline :
    variant === 'ghost' ? styles.ghost : styles.primary;
  const textStyle =
    variant === 'outline' ? styles.textOutline :
    variant === 'ghost' ? styles.textGhost : styles.text;

  return (
    <TouchableOpacity
      style={[styles.button, variantStyle, variant === 'primary' && shadow.glow, disabled && styles.disabled, style]}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.85}
    >
      <Text style={[textStyle, disabled && styles.textDisabled]}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: { padding: 15, borderRadius: radius.md, alignItems: 'center', marginVertical: 7, width: '100%' },
  primary: { backgroundColor: colors.primary },
  secondary: { backgroundColor: colors.surfaceLight },
  outline: { backgroundColor: 'transparent', borderWidth: 1.5, borderColor: colors.primary },
  ghost: { backgroundColor: 'transparent' },
  disabled: { backgroundColor: colors.border, shadowOpacity: 0 },
  text: { color: colors.onPrimary, fontSize: 16, fontWeight: '800', letterSpacing: 0.3 },
  textOutline: { color: colors.primaryBright, fontSize: 16, fontWeight: '700', letterSpacing: 0.3 },
  textGhost: { color: colors.textMuted, fontSize: 15, fontWeight: '600' },
  textDisabled: { color: colors.textDim },
});
