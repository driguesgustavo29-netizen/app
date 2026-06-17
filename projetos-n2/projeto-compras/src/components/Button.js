import { TouchableOpacity, Text, StyleSheet } from 'react-native';
export default function Button({ title, onPress, disabled }) {
  return (<TouchableOpacity style={[styles.button, disabled && styles.disabled]} onPress={onPress} disabled={disabled}><Text style={styles.text}>{title}</Text></TouchableOpacity>);
}
const styles = StyleSheet.create({ button: { backgroundColor: '#007bff', padding: 14, borderRadius: 8, alignItems: 'center', marginVertical: 8, width: '100%' }, disabled: { backgroundColor: '#ccc' }, text: { color: '#fff', fontWeight: 'bold' } });