import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useState } from 'react';
export default function ImagePickerComponent({ onImageSelected, label }) {
  const [imageUri, setImageUri] = useState(null);
  const pickImage = async (useCamera) => {
    const result = useCamera ? await ImagePicker.launchCameraAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images, quality: 1 }) : await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images, quality: 1 });
    if (!result.canceled) { setImageUri(result.assets[0].uri); onImageSelected(result.assets[0].uri); }
  };
  return (<View style={styles.container}><Text style={styles.label}>{label}</Text><View style={styles.buttonRow}><TouchableOpacity style={styles.smallButton} onPress={() => pickImage(false)}><Text>Galeria</Text></TouchableOpacity><TouchableOpacity style={styles.smallButton} onPress={() => pickImage(true)}><Text>Câmera</Text></TouchableOpacity></View>{imageUri && <Image source={{ uri: imageUri }} style={styles.preview} />}</View>);
}
const styles = StyleSheet.create({ container: { marginVertical: 10, alignItems: 'center' }, label: { fontSize: 16, fontWeight: 'bold' }, buttonRow: { flexDirection: 'row', gap: 10 }, smallButton: { backgroundColor: '#28a745', padding: 10, borderRadius: 5, marginHorizontal: 5 }, preview: { width: 100, height: 100, marginTop: 10, borderRadius: 8 } });