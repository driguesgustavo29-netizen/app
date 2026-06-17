import { TextInput, StyleSheet, View } from 'react-native';
export default function Input({ placeholder, value, onChangeText, keyboardType, secureTextEntry }) {
  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        value={value}
        onChangeText={onChangeText}
        keyboardType={keyboardType}
        secureTextEntry={secureTextEntry}
        autoCapitalize="none"
      />
    </View>
  );
}
const styles = StyleSheet.create({ container: { width: '100%', marginVertical: 8 }, input: { backgroundColor: '#f5f5f5', padding: 12, borderRadius: 8, fontSize: 16 } });
