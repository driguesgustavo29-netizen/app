import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';

// Abre a câmera e retorna a URI da foto original.
export const tirarFoto = async () => {
  const { status } = await ImagePicker.requestCameraPermissionsAsync();
  if (status !== 'granted') return null;
  const result = await ImagePicker.launchCameraAsync({ mediaTypes: ['images'], quality: 1 });
  if (!result.canceled && result.assets && result.assets.length > 0) {
    return result.assets[0].uri;
  }
  return null;
};

// Trata a imagem: redimensiona (800px), comprime (0.7) e converte para JPEG.
// O arquivo gerado já fica salvo em diretório persistente do app,
// então a URI retornada serve como armazenamento local.
export const processImage = async (uri) => {
  try {
    const processed = await ImageManipulator.manipulateAsync(
      uri,
      [{ resize: { width: 800 } }],
      { compress: 0.7, format: ImageManipulator.SaveFormat.JPEG }
    );
    return processed.uri;
  } catch (error) {
    console.log('Erro ao tratar imagem:', error);
    return uri; // usa a original se o tratamento falhar
  }
};
