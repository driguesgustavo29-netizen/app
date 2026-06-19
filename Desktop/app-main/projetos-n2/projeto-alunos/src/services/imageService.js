import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';

// Seleciona a imagem (câmera ou galeria) e retorna a URI original.
export const pickImage = async (useCamera = false) => {
  if (useCamera) {
    const perm = await ImagePicker.requestCameraPermissionsAsync();
    if (!perm.granted) return null;
  } else {
    const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!perm.granted) return null;
  }

  const result = useCamera
    ? await ImagePicker.launchCameraAsync({ mediaTypes: ['images'], allowsEditing: true, quality: 1 })
    : await ImagePicker.launchImageLibraryAsync({ mediaTypes: ['images'], allowsEditing: true, quality: 1 });

  if (!result.canceled && result.assets && result.assets.length > 0) {
    return result.assets[0].uri;
  }
  return null;
};

// Trata a imagem: redimensiona (800px), comprime (0.7) e converte para JPEG.
// O arquivo gerado já fica salvo no diretório de cache persistente do app,
// então a própria URI retornada serve como armazenamento local.
export const processImage = async (imageUri) => {
  const manipulatedImage = await ImageManipulator.manipulateAsync(
    imageUri,
    [{ resize: { width: 800 } }],
    { compress: 0.7, format: ImageManipulator.SaveFormat.JPEG }
  );
  return manipulatedImage.uri;
};

// Fluxo completo: seleciona -> trata -> devolve a URI tratada.
// Lança erro com mensagem clara em vez de retornar null silencioso.
export const getAndProcessImage = async (userId, tipo, useCamera = false) => {
  const rawUri = await pickImage(useCamera);
  if (!rawUri) return null; // usuário cancelou ou negou permissão

  try {
    const processedUri = await processImage(rawUri);
    return processedUri;
  } catch (error) {
    console.log('Erro ao tratar imagem:', error);
    // se o tratamento falhar, usa a imagem original para não travar o cadastro
    return rawUri;
  }
};
