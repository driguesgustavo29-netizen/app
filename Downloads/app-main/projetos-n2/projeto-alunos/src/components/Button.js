import { TouchableOpacity, Text, StyleSheet } from 'react-native';
export default function Button({ title, onPress, disabled, style }) {
  return (<TouchableOpacity style={[styles.button, disabled && styles.disabled, style]} onPress={onPress} disabled={disabled}><Text style={styles.text}>{title}</Text></TouchableOpacity>);
}
const styles = StyleSheet.create({ button: { backgroundColor: '#007bff', padding: 14, borderRadius: 8, alignItems: 'center', marginVertical: 8, width: '100%' }, disabled: { backgroundColor: '#ccc' }, text: { color: '#fff', fontSize: 16, fontWeight: 'bold' } });