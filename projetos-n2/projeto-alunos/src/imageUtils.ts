import * as ImageManipulator from 'expo-image-manipulator';
import * as FileSystem from 'expo-file-system';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../../firebaseConfig';

export const compressImage = async (uri: string): Promise<string> => {
  const result = await ImageManipulator.manipulateAsync(
    uri,
    [{ resize: { width: 800 } }],
    { compress: 0.7, format: ImageManipulator.SaveFormat.JPEG }
  );
  return result.uri;
};

export const uploadDocument = async (userId: string, tipo: string, localUri: string): Promise<string> => {
  try {
    const compressed = await compressImage(localUri);
    const response = await fetch(compressed);
    const blob = await response.blob();
    const fileName = `alunos/${userId}/${tipo}_${Date.now()}.jpg`;
    const storageRef = ref(storage, fileName);
    await uploadBytes(storageRef, blob);
    const url = await getDownloadURL(storageRef);
    return url;
  } catch (error) {
    console.error('Erro no upload:', error);
    throw new Error('Falha ao enviar imagem. Verifique sua conexão e as regras do Storage.');
  }
};