import { TextInput, StyleSheet, View, Text } from 'react-native';
import { useState } from 'react';
import { colors, radius } from '../theme';

export default function Input({ label, placeholder, value, onChangeText, secureTextEntry, keyboardType, maxLength, autoCapitalize }) {
  const [focused, setFocused] = useState(false);
  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      <TextInput
        style={[styles.input, focused && styles.inputFocused]}
        placeholder={placeholder}
        placeholderTextColor={colors.textDim}
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
        maxLength={maxLength}
        autoCapitalize={autoCapitalize}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { width: '100%', marginVertical: 6 },
  label: { fontSize: 12, color: colors.textMuted, marginBottom: 5, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.5 },
  input: {
    backgroundColor: colors.surfaceLight, padding: 14, borderRadius: radius.md, fontSize: 16,
    borderWidth: 1.5, borderColor: colors.border, color: colors.text,
  },
  inputFocused: { borderColor: colors.primaryBright, backgroundColor: colors.bgElevated },
});
