const fs = require('fs');
const path = require('path');

const rootDir = path.join(process.cwd(), 'projetos-n2');

function writeFile(projectDir, filePath, content) {
  const fullPath = path.join(rootDir, projectDir, filePath);
  const dir = path.dirname(fullPath);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(fullPath, content, 'utf8');
  console.log(`✅ ${projectDir} / ${filePath}`);
}

// ==================== PROJETO 1: CADASTRO DE ALUNOS ====================
function criarProjetoAlunos() {
  const p = 'projeto-alunos';

  writeFile(p, 'package.json', JSON.stringify({
    name: "projeto-alunos", version: "1.0.0", main: "node_modules/expo/AppEntry.js",
    scripts: { start: "expo start", android: "expo start --android", ios: "expo start --ios" },
    dependencies: {
      "expo": "~54.0.0", "expo-status-bar": "~2.0.0", "react": "18.3.1", "react-native": "0.76.7",
      "expo-image-picker": "~16.0.6", "expo-image-manipulator": "~13.0.6", "expo-file-system": "~18.0.11",
      "@react-navigation/native": "^7.0.14", "@react-navigation/stack": "^7.1.1",
      "react-native-screens": "~4.4.0", "react-native-safe-area-context": "4.12.0", "firebase": "^11.0.0"
    }
  }, null, 2));

  writeFile(p, 'app.json', JSON.stringify({
    expo: {
      name: "Sistema de Cadastro de Alunos", slug: "cadastro-alunos", version: "1.0.0", orientation: "portrait",
      userInterfaceStyle: "light", assetBundlePatterns: ["**/*"], ios: { supportsTablet: true, infoPlist: { NSPhotoLibraryUsageDescription: "Precisamos acessar suas fotos.", NSCameraUsageDescription: "Precisamos acessar a câmera." } },
      android: { adaptiveIcon: { foregroundImage: "./assets/adaptive-icon.png", backgroundColor: "#ffffff" }, permissions: ["CAMERA", "READ_EXTERNAL_STORAGE", "WRITE_EXTERNAL_STORAGE"] },
      plugins: [["expo-image-picker", { photosPermission: "O app precisa acessar suas fotos.", cameraPermission: "O app precisa acessar a câmera." }]]
    }
  }, null, 2));

  writeFile(p, 'firebaseConfig.js', `import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
const firebaseConfig = { apiKey: "SUA_API_KEY", authDomain: "SEU_AUTH_DOMAIN", projectId: "SEU_PROJECT_ID", storageBucket: "SEU_STORAGE_BUCKET", messagingSenderId: "SEU_MESSAGING_SENDER_ID", appId: "SEU_APP_ID" };
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);`);

  writeFile(p, 'App.js', `import AppNavigator from './src/navigation/AppNavigator';
import { StatusBar } from 'expo-status-bar';
export default function App() { return (<><StatusBar style="auto" /><AppNavigator /></>); }`);

  // Componentes
  writeFile(p, 'src/components/Input.js', `import { TextInput, StyleSheet, View } from 'react-native';
export default function Input({ placeholder, value, onChangeText, secureTextEntry, keyboardType }) {
  return (<View style={styles.container}><TextInput style={styles.input} placeholder={placeholder} value={value} onChangeText={onChangeText} secureTextEntry={secureTextEntry} keyboardType={keyboardType} /></View>);
}
const styles = StyleSheet.create({ container: { width: '100%', marginVertical: 8 }, input: { backgroundColor: '#f5f5f5', padding: 12, borderRadius: 8, fontSize: 16 } });`);

  writeFile(p, 'src/components/Button.js', `import { TouchableOpacity, Text, StyleSheet } from 'react-native';
export default function Button({ title, onPress, disabled, style }) {
  return (<TouchableOpacity style={[styles.button, disabled && styles.disabled, style]} onPress={onPress} disabled={disabled}><Text style={styles.text}>{title}</Text></TouchableOpacity>);
}
const styles = StyleSheet.create({ button: { backgroundColor: '#007bff', padding: 14, borderRadius: 8, alignItems: 'center', marginVertical: 8, width: '100%' }, disabled: { backgroundColor: '#ccc' }, text: { color: '#fff', fontSize: 16, fontWeight: 'bold' } });`);

  writeFile(p, 'src/components/ImagePickerComponent.js', `import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
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
const styles = StyleSheet.create({ container: { marginVertical: 10, alignItems: 'center' }, label: { fontSize: 16, fontWeight: 'bold' }, buttonRow: { flexDirection: 'row', gap: 10 }, smallButton: { backgroundColor: '#28a745', padding: 10, borderRadius: 5, marginHorizontal: 5 }, preview: { width: 100, height: 100, marginTop: 10, borderRadius: 8 } });`);

  // Services (Auth, Firestore, Image)
  writeFile(p, 'src/services/authService.js', `import { auth } from '../../firebaseConfig';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'firebase/auth';
export const registerUser = async (email, password) => { try { const userCredential = await createUserWithEmailAndPassword(auth, email, password); return { success: true, user: userCredential.user }; } catch (error) { return { success: false, error: error.message }; } };
export const loginUser = async (email, password) => { try { const userCredential = await signInWithEmailAndPassword(auth, email, password); return { success: true, user: userCredential.user }; } catch (error) { return { success: false, error: error.message }; } };
export const logoutUser = async () => { try { await signOut(auth); return { success: true }; } catch (error) { return { success: false, error: error.message }; } };`);

  writeFile(p, 'src/services/firestoreService.js', `import { db } from '../../firebaseConfig';
import { collection, addDoc, updateDoc, doc, onSnapshot, setDoc, getDoc } from 'firebase/firestore';
export const salvarAluno = async (alunoData) => { try { const docRef = await addDoc(collection(db, 'alunos'), alunoData); return { success: true, id: docRef.id }; } catch (error) { return { success: false, error: error.message }; } };
export const listarAlunos = (callback) => { return onSnapshot(collection(db, 'alunos'), (snapshot) => { const alunos = []; snapshot.forEach((doc) => alunos.push({ id: doc.id, ...doc.data() })); callback(alunos); }); };
export const atualizarStatusAluno = async (alunoId, novoStatus) => { try { await updateDoc(doc(db, 'alunos', alunoId), { status: novoStatus }); return { success: true }; } catch (error) { return { success: false, error: error.message }; } };
export const salvarPerfilUsuario = async (userId, perfil) => { try { await setDoc(doc(db, 'usuarios', userId), { perfil }); return { success: true }; } catch (error) { return { success: false, error: error.message }; } };
export const getPerfilUsuario = async (userId) => { try { const docSnap = await getDoc(doc(db, 'usuarios', userId)); if (docSnap.exists()) return { success: true, perfil: docSnap.data().perfil }; else return { success: false, error: 'Perfil não encontrado' }; } catch (error) { return { success: false, error: error.message }; } };`);

  writeFile(p, 'src/services/imageService.js', `import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';
import * as FileSystem from 'expo-file-system';
export const pickImage = async (useCamera = false) => { const result = useCamera ? await ImagePicker.launchCameraAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images, allowsEditing: true, quality: 1 }) : await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images, allowsEditing: true, quality: 1 }); if (!result.canceled) return result.assets[0].uri; return null; };
export const processImage = async (imageUri) => { try { const manipulatedImage = await ImageManipulator.manipulateAsync(imageUri, [{ resize: { width: 800 } }], { compress: 0.7, format: ImageManipulator.SaveFormat.JPEG }); return manipulatedImage.uri; } catch (error) { return null; } };
export const saveImageLocally = async (imageUri, userId, tipo) => { try { const timestamp = Date.now(); const fileName = \`\${userId}_\${tipo}_\${timestamp}.jpg\`; const newUri = FileSystem.documentDirectory + fileName; await FileSystem.copyAsync({ from: imageUri, to: newUri }); return newUri; } catch (error) { return null; } };
export const getAndProcessImage = async (userId, tipo, useCamera = false) => { const rawUri = await pickImage(useCamera); if (!rawUri) return null; const processedUri = await processImage(rawUri); if (!processedUri) return null; const localUri = await saveImageLocally(processedUri, userId, tipo); return localUri; };`);

  // Telas
  writeFile(p, 'src/screens/LoginScreen.js', `import { View, Text, StyleSheet, Alert } from 'react-native'; import { useState } from 'react'; import Input from '../components/Input'; import Button from '../components/Button'; import { loginUser } from '../services/authService'; import { getPerfilUsuario } from '../services/firestoreService';
export default function LoginScreen({ navigation }) { const [email, setEmail] = useState(''); const [password, setPassword] = useState(''); const [loading, setLoading] = useState(false);
const handleLogin = async () => { if (!email || !password) { Alert.alert('Erro', 'Preencha todos os campos'); return; } setLoading(true); const result = await loginUser(email, password); if (result.success) { const perfilResult = await getPerfilUsuario(result.user.uid); if (perfilResult.success && perfilResult.perfil === 'atendente') navigation.replace('Atendente'); else navigation.replace('CadastroAluno'); } else { Alert.alert('Erro', result.error); } setLoading(false); };
return (<View style={styles.container}><Text style={styles.title}>Login</Text><Input placeholder="E-mail" value={email} onChangeText={setEmail} keyboardType="email-address" /><Input placeholder="Senha" value={password} onChangeText={setPassword} secureTextEntry /><Button title="Entrar" onPress={handleLogin} disabled={loading} /><Button title="Cadastrar-se" onPress={() => navigation.navigate('Register')} style={styles.secondary} /></View>); }
const styles = StyleSheet.create({ container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }, title: { fontSize: 28, fontWeight: 'bold', marginBottom: 30 }, secondary: { backgroundColor: '#6c757d' } });`);

  writeFile(p, 'src/screens/RegisterScreen.js', `import { View, Text, StyleSheet, Alert } from 'react-native'; import { useState } from 'react'; import Input from '../components/Input'; import Button from '../components/Button'; import { registerUser } from '../services/authService'; import { salvarPerfilUsuario } from '../services/firestoreService';
export default function RegisterScreen({ navigation }) { const [email, setEmail] = useState(''); const [password, setPassword] = useState(''); const [confirm, setConfirm] = useState(''); const [perfil, setPerfil] = useState('aluno'); const [loading, setLoading] = useState(false);
const handleRegister = async () => { if (!email || !password || !confirm) { Alert.alert('Erro', 'Preencha todos os campos'); return; } if (password !== confirm) { Alert.alert('Erro', 'Senhas não coincidem'); return; } setLoading(true); const result = await registerUser(email, password); if (result.success) { await salvarPerfilUsuario(result.user.uid, perfil); Alert.alert('Sucesso', 'Cadastro realizado! Faça login.'); navigation.navigate('Login'); } else { Alert.alert('Erro', result.error); } setLoading(false); };
return (<View style={styles.container}><Text style={styles.title}>Cadastro</Text><Input placeholder="E-mail" value={email} onChangeText={setEmail} keyboardType="email-address" /><Input placeholder="Senha" value={password} onChangeText={setPassword} secureTextEntry /><Input placeholder="Confirmar senha" value={confirm} onChangeText={setConfirm} secureTextEntry /><View style={styles.perfilContainer}><Text>Perfil:</Text><View style={styles.perfilOptions}><Button title="Aluno" onPress={() => setPerfil('aluno')} style={perfil === 'aluno' ? styles.selected : styles.unselected} /><Button title="Atendente" onPress={() => setPerfil('atendente')} style={perfil === 'atendente' ? styles.selected : styles.unselected} /></View></View><Button title="Cadastrar" onPress={handleRegister} disabled={loading} /><Button title="Voltar" onPress={() => navigation.goBack()} style={styles.secondary} /></View>); }
const styles = StyleSheet.create({ container: { flex: 1, justifyContent: 'center', padding: 20 }, title: { fontSize: 28, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' }, perfilContainer: { marginVertical: 10 }, perfilOptions: { flexDirection: 'row', justifyContent: 'space-around' }, selected: { backgroundColor: '#007bff', width: '45%' }, unselected: { backgroundColor: '#6c757d', width: '45%' }, secondary: { backgroundColor: '#6c757d' } });`);

  writeFile(p, 'src/screens/CadastroAlunoScreen.js', `import { View, Text, TextInput, StyleSheet, ScrollView, Alert } from 'react-native'; import { useState } from 'react'; import Button from '../components/Button'; import { getAndProcessImage } from '../services/imageService'; import { salvarAluno } from '../services/firestoreService'; import { auth } from '../../firebaseConfig';
export default function CadastroAlunoScreen({ navigation }) { const [nome, setNome] = useState(''); const [cpf, setCpf] = useState(''); const [dataNasc, setDataNasc] = useState(''); const [email, setEmail] = useState(''); const [telefone, setTelefone] = useState(''); const [curso, setCurso] = useState(''); const [docUri, setDocUri] = useState(null); const [certUri, setCertUri] = useState(null); const [loading, setLoading] = useState(false);
const handleUpload = async (tipo, useCamera) => { const userId = auth.currentUser?.uid; if (!userId) return; const localUri = await getAndProcessImage(userId, tipo, useCamera); if (localUri) { if (tipo === 'documento') setDocUri(localUri); else setCertUri(localUri); } };
const handleSalvar = async () => { if (!nome || !cpf || !dataNasc || !email || !telefone || !curso) { Alert.alert('Erro', 'Preencha todos os campos'); return; } if (!docUri || !certUri) { Alert.alert('Erro', 'Envie os documentos'); return; } setLoading(true); const alunoData = { nome, cpf, dataNascimento: dataNasc, email, telefone, curso, status: 'Pendente', caminhoDocumento: docUri, caminhoCertificado: certUri, criadoEm: new Date(), userId: auth.currentUser?.uid }; const result = await salvarAluno(alunoData); if (result.success) { Alert.alert('Sucesso', 'Cadastro realizado!'); navigation.replace('Login'); } else { Alert.alert('Erro', result.error); } setLoading(false); };
return (<ScrollView contentContainerStyle={styles.container}><Text style={styles.title}>Cadastro de Aluno</Text><TextInput style={styles.input} placeholder="Nome completo" value={nome} onChangeText={setNome} /><TextInput style={styles.input} placeholder="CPF" value={cpf} onChangeText={setCpf} keyboardType="numeric" /><TextInput style={styles.input} placeholder="Data nascimento (DD/MM/AAAA)" value={dataNasc} onChangeText={setDataNasc} /><TextInput style={styles.input} placeholder="E-mail" value={email} onChangeText={setEmail} keyboardType="email-address" /><TextInput style={styles.input} placeholder="Telefone" value={telefone} onChangeText={setTelefone} keyboardType="phone-pad" /><TextInput style={styles.input} placeholder="Curso" value={curso} onChangeText={setCurso} /><Text style={styles.subtitle}>Documento pessoal</Text><View style={styles.buttonRow}><Button title="Galeria" onPress={() => handleUpload('documento', false)} style={styles.smallButton} /><Button title="Câmera" onPress={() => handleUpload('documento', true)} style={styles.smallButton} /></View><Text style={styles.subtitle}>Certificado</Text><View style={styles.buttonRow}><Button title="Galeria" onPress={() => handleUpload('certificado', false)} style={styles.smallButton} /><Button title="Câmera" onPress={() => handleUpload('certificado', true)} style={styles.smallButton} /></View><Button title="Salvar Cadastro" onPress={handleSalvar} disabled={loading} /></ScrollView>); }
const styles = StyleSheet.create({ container: { padding: 20, alignItems: 'center' }, title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 }, subtitle: { fontSize: 18, fontWeight: 'bold', marginTop: 15 }, input: { width: '100%', backgroundColor: '#f5f5f5', padding: 12, borderRadius: 8, marginVertical: 8 }, buttonRow: { flexDirection: 'row', gap: 10 }, smallButton: { width: '45%' } });`);

  writeFile(p, 'src/screens/AtendenteScreen.js', `import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert } from 'react-native'; import { useEffect, useState } from 'react'; import { listarAlunos, atualizarStatusAluno } from '../services/firestoreService';
export default function AtendenteScreen({ navigation }) { const [alunos, setAlunos] = useState([]); useEffect(() => { const unsubscribe = listarAlunos(setAlunos); return unsubscribe; }, []);
const handleStatus = async (id, status) => { if (status === 'Pendente') { const result = await atualizarStatusAluno(id, 'Entregue'); if (!result.success) Alert.alert('Erro', result.error); } else Alert.alert('Aviso', 'Já entregue'); };
const renderItem = ({ item }) => (<TouchableOpacity style={styles.card} onPress={() => navigation.navigate('VisualizarDocumentos', { aluno: item })}><Text style={styles.nome}>{item.nome}</Text><Text>CPF: {item.cpf}</Text><Text>Curso: {item.curso}</Text><Text>Status: {item.status}</Text>{item.status === 'Pendente' && <TouchableOpacity style={styles.buttonAprovar} onPress={() => handleStatus(item.id, item.status)}><Text style={styles.buttonText}>Marcar Entregue</Text></TouchableOpacity>}</TouchableOpacity>);
return (<View style={styles.container}><Text style={styles.title}>Painel do Atendente</Text><FlatList data={alunos} keyExtractor={(item) => item.id} renderItem={renderItem} /></View>); }
const styles = StyleSheet.create({ container: { flex: 1, padding: 20 }, title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' }, card: { backgroundColor: '#f9f9f9', padding: 15, borderRadius: 10, marginVertical: 8 }, nome: { fontSize: 18, fontWeight: 'bold' }, buttonAprovar: { backgroundColor: '#28a745', padding: 10, borderRadius: 5, marginTop: 10, alignItems: 'center' }, buttonText: { color: '#fff' } });`);

  writeFile(p, 'src/screens/VisualizarDocumentosScreen.js', `import { View, Text, Image, StyleSheet, ScrollView } from 'react-native'; import * as FileSystem from 'expo-file-system';
export default function VisualizarDocumentosScreen({ route }) { const { aluno } = route.params; const getSource = (uri) => uri && uri.startsWith(FileSystem.documentDirectory) ? { uri } : null;
return (<ScrollView contentContainerStyle={styles.container}><Text style={styles.title}>Documentos</Text><Text>Nome: {aluno.nome}</Text><Text>Status: {aluno.status}</Text><Text style={styles.subtitle}>Documento Pessoal</Text>{aluno.caminhoDocumento ? <Image source={getSource(aluno.caminhoDocumento)} style={styles.image} /> : <Text>Não enviado</Text>}<Text style={styles.subtitle}>Certificado</Text>{aluno.caminhoCertificado ? <Image source={getSource(aluno.caminhoCertificado)} style={styles.image} /> : <Text>Não enviado</Text>}</ScrollView>); }
const styles = StyleSheet.create({ container: { padding: 20, alignItems: 'center' }, title: { fontSize: 24, fontWeight: 'bold' }, subtitle: { fontSize: 20, fontWeight: 'bold', marginTop: 20 }, image: { width: 300, height: 300, resizeMode: 'contain', marginVertical: 10, borderWidth: 1 } });`);

  writeFile(p, 'src/navigation/AppNavigator.js', `import { NavigationContainer } from '@react-navigation/native'; import { createStackNavigator } from '@react-navigation/stack'; import LoginScreen from '../screens/LoginScreen'; import RegisterScreen from '../screens/RegisterScreen'; import CadastroAlunoScreen from '../screens/CadastroAlunoScreen'; import AtendenteScreen from '../screens/AtendenteScreen'; import VisualizarDocumentosScreen from '../screens/VisualizarDocumentosScreen';
const Stack = createStackNavigator();
export default function AppNavigator() { return (<NavigationContainer><Stack.Navigator initialRouteName="Login"><Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} /><Stack.Screen name="Register" component={RegisterScreen} title="Cadastro" /><Stack.Screen name="CadastroAluno" component={CadastroAlunoScreen} title="Cadastro do Aluno" /><Stack.Screen name="Atendente" component={AtendenteScreen} title="Atendente" /><Stack.Screen name="VisualizarDocumentos" component={VisualizarDocumentosScreen} title="Documentos" /></Stack.Navigator></NavigationContainer>); }`);

  writeFile(p, 'README.md', `# Projeto 1 - Cadastro de Alunos\n\n1. cd projeto-alunos\n2. npm install\n3. Configure firebaseConfig.js\n4. npx expo start`);
}

// ==================== PROJETO 2: APP DE COMPRAS ====================
function criarProjetoCompras() {
  const p = 'projeto-compras';

  writeFile(p, 'package.json', JSON.stringify({
    name: "app-conferencia-compras", version: "1.0.0", main: "node_modules/expo/AppEntry.js",
    scripts: { start: "expo start", android: "expo start --android", ios: "expo start --ios" },
    dependencies: {
      "expo": "~54.0.0", "expo-status-bar": "~2.0.0", "react": "18.3.1", "react-native": "0.76.7",
      "expo-camera": "~16.0.0", "expo-image-picker": "~16.0.6", "expo-image-manipulator": "~13.0.6", "expo-file-system": "~18.0.11",
      "@react-navigation/native": "^7.0.14", "@react-navigation/stack": "^7.1.1",
      "react-native-screens": "~4.4.0", "react-native-safe-area-context": "4.12.0", "firebase": "^11.0.0"
    }
  }, null, 2));

  writeFile(p, 'app.json', JSON.stringify({
    expo: {
      name: "App Conferência de Compras", slug: "app-conferencia-compras", version: "1.0.0", orientation: "portrait",
      plugins: [["expo-camera", { cameraPermission: "Permita o acesso à câmera para fotografar produtos." }],
      ["expo-image-picker", { photosPermission: "Permita o acesso à galeria." }]]
    }
  }, null, 2));

  writeFile(p, 'firebaseConfig.js', `import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
const firebaseConfig = { apiKey: "SUA_API_KEY", authDomain: "SEU_AUTH_DOMAIN", projectId: "SEU_PROJECT_ID", storageBucket: "SEU_STORAGE_BUCKET", messagingSenderId: "SEU_MESSAGING_SENDER_ID", appId: "SEU_APP_ID" };
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);`);

  writeFile(p, 'App.js', `import AppNavigator from './src/navigation/AppNavigator';
import { StatusBar } from 'expo-status-bar';
export default function App() { return (<><StatusBar style="auto" /><AppNavigator /></>); }`);

  // Componentes (reutiliza alguns, mas vou criar específicos)
  writeFile(p, 'src/components/Input.js', `import { TextInput, StyleSheet, View } from 'react-native';
export default function Input({ placeholder, value, onChangeText, keyboardType }) {
  return (<View style={styles.container}><TextInput style={styles.input} placeholder={placeholder} value={value} onChangeText={onChangeText} keyboardType={keyboardType} /></View>);
}
const styles = StyleSheet.create({ container: { width: '100%', marginVertical: 8 }, input: { backgroundColor: '#f5f5f5', padding: 12, borderRadius: 8 } });`);

  writeFile(p, 'src/components/Button.js', `import { TouchableOpacity, Text, StyleSheet } from 'react-native';
export default function Button({ title, onPress, disabled }) {
  return (<TouchableOpacity style={[styles.button, disabled && styles.disabled]} onPress={onPress} disabled={disabled}><Text style={styles.text}>{title}</Text></TouchableOpacity>);
}
const styles = StyleSheet.create({ button: { backgroundColor: '#007bff', padding: 14, borderRadius: 8, alignItems: 'center', marginVertical: 8, width: '100%' }, disabled: { backgroundColor: '#ccc' }, text: { color: '#fff', fontWeight: 'bold' } });`);

  // Services
  writeFile(p, 'src/services/authService.js', `import { auth } from '../../firebaseConfig';
import { signInWithEmailAndPassword, signOut } from 'firebase/auth';
export const loginUser = async (email, password) => { try { const userCredential = await signInWithEmailAndPassword(auth, email, password); return { success: true, user: userCredential.user }; } catch (error) { return { success: false, error: error.message }; } };
export const logoutUser = async () => { try { await signOut(auth); return { success: true }; } catch (error) { return { success: false, error: error.message }; } };`);

  writeFile(p, 'src/services/firestoreService.js', `import { db } from '../../firebaseConfig';
import { collection, addDoc, getDocs, deleteDoc, doc, updateDoc, query, where } from 'firebase/firestore';
export const salvarItem = async (userId, item) => { try { const docRef = await addDoc(collection(db, 'compras'), { ...item, userId, criadoEm: new Date() }); return { success: true, id: docRef.id }; } catch (error) { return { success: false, error: error.message }; } };
export const listarItens = async (userId) => { try { const q = query(collection(db, 'compras'), where('userId', '==', userId)); const snapshot = await getDocs(q); const itens = []; snapshot.forEach((doc) => itens.push({ id: doc.id, ...doc.data() })); return { success: true, itens }; } catch (error) { return { success: false, error: error.message }; } };
export const atualizarItem = async (id, dados) => { try { await updateDoc(doc(db, 'compras', id), dados); return { success: true }; } catch (error) { return { success: false, error: error.message }; } };
export const deletarItem = async (id) => { try { await deleteDoc(doc(db, 'compras', id)); return { success: true }; } catch (error) { return { success: false, error: error.message }; } };`);

  writeFile(p, 'src/services/imageService.js', `import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';
import * as FileSystem from 'expo-file-system';
export const tirarFoto = async () => { const { status } = await ImagePicker.requestCameraPermissionsAsync(); if (status !== 'granted') return null; const result = await ImagePicker.launchCameraAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images, quality: 1 }); if (!result.canceled) return result.assets[0].uri; return null; };
export const processImage = async (uri) => { try { const processed = await ImageManipulator.manipulateAsync(uri, [{ resize: { width: 800 } }], { compress: 0.7, format: ImageManipulator.SaveFormat.JPEG }); return processed.uri; } catch (error) { return null; } };
export const salvarLocal = async (uri, userId, produtoId) => { const fileName = \`\${userId}_\${produtoId}_\${Date.now()}.jpg\`; const newUri = FileSystem.documentDirectory + fileName; await FileSystem.copyAsync({ from: uri, to: newUri }); return newUri; };`);

  // Telas
  writeFile(p, 'src/screens/LoginScreen.js', `import { View, Text, StyleSheet, Alert } from 'react-native'; import { useState } from 'react'; import Input from '../components/Input'; import Button from '../components/Button'; import { loginUser } from '../services/authService';
export default function LoginScreen({ navigation }) { const [email, setEmail] = useState(''); const [password, setPassword] = useState(''); const [loading, setLoading] = useState(false);
const handleLogin = async () => { if (!email || !password) { Alert.alert('Erro', 'Preencha os campos'); return; } setLoading(true); const result = await loginUser(email, password); if (result.success) navigation.replace('ListaCompras'); else Alert.alert('Erro', result.error); setLoading(false); };
return (<View style={styles.container}><Text style={styles.title}>Login</Text><Input placeholder="E-mail" value={email} onChangeText={setEmail} keyboardType="email-address" /><Input placeholder="Senha" value={password} onChangeText={setPassword} secureTextEntry /><Button title="Entrar" onPress={handleLogin} disabled={loading} /></View>); }
const styles = StyleSheet.create({ container: { flex: 1, justifyContent: 'center', padding: 20 }, title: { fontSize: 28, fontWeight: 'bold', marginBottom: 30, textAlign: 'center' } });`);

  writeFile(p, 'src/screens/ListaComprasScreen.js', `import { View, Text, FlatList, TouchableOpacity, TextInput, StyleSheet, Alert, Image } from 'react-native'; import { useState, useEffect } from 'react'; import { auth } from '../../firebaseConfig'; import { listarItens, atualizarItem, deletarItem } from '../services/firestoreService'; import Button from '../components/Button';
export default function ListaComprasScreen({ navigation }) { const [itens, setItens] = useState([]); const [totalGeral, setTotalGeral] = useState(0); const carregarItens = async () => { const result = await listarItens(auth.currentUser.uid); if (result.success) setItens(result.itens); };
useEffect(() => { carregarItens(); }, []); useEffect(() => { let total = 0; itens.forEach(item => total += (item.valorUnitario * item.quantidade)); setTotalGeral(total); }, [itens]);
const alterarQuantidade = async (id, novaQuantidade) => { if (novaQuantidade < 0) return; const item = itens.find(i => i.id === id); if (item) { const novoTotalItem = item.valorUnitario * novaQuantidade; await atualizarItem(id, { quantidade: novaQuantidade, totalItem: novoTotalItem }); carregarItens(); } };
const excluirItem = async (id) => { Alert.alert('Confirmar', 'Excluir item?', [{ text: 'Sim', onPress: async () => { await deletarItem(id); carregarItens(); } }, { text: 'Não' }]); };
const renderItem = ({ item }) => (<View style={styles.card}><Image source={{ uri: item.imagemUri }} style={styles.imagem} /><View style={styles.info}><Text style={styles.nome}>{item.nome}</Text><Text>Valor unit: R$ {item.valorUnitario.toFixed(2)}</Text><View style={styles.qtd}><Text>Qtd: </Text><TextInput style={styles.inputQtd} value={String(item.quantidade)} keyboardType="numeric" onChangeText={(text) => { const q = parseInt(text) || 0; alterarQuantidade(item.id, q); }} /></View><Text>Total item: R$ {(item.valorUnitario * item.quantidade).toFixed(2)}</Text><TouchableOpacity onPress={() => excluirItem(item.id)}><Text style={styles.excluir}>Excluir</Text></TouchableOpacity></View></View>);
return (<View style={styles.container}><Button title="+ Adicionar Produto" onPress={() => navigation.navigate('CadastroProduto')} /><FlatList data={itens} keyExtractor={(item) => item.id} renderItem={renderItem} /><Text style={styles.total}>Total Geral: R$ {totalGeral.toFixed(2)}</Text></View>); }
const styles = StyleSheet.create({ container: { flex: 1, padding: 10 }, card: { flexDirection: 'row', backgroundColor: '#fff', margin: 8, padding: 10, borderRadius: 10 }, imagem: { width: 80, height: 80, borderRadius: 8 }, info: { flex: 1, marginLeft: 10 }, nome: { fontSize: 16, fontWeight: 'bold' }, qtd: { flexDirection: 'row', alignItems: 'center', marginVertical: 5 }, inputQtd: { borderWidth: 1, width: 50, textAlign: 'center' }, excluir: { color: 'red', marginTop: 5 }, total: { fontSize: 20, fontWeight: 'bold', textAlign: 'center', margin: 20 } });`);

  writeFile(p, 'src/screens/CadastroProdutoScreen.js', `import { View, Text, TextInput, StyleSheet, Alert, Image } from 'react-native'; import { useState } from 'react'; import { auth } from '../../firebaseConfig'; import { tirarFoto, processImage, salvarLocal } from '../services/imageService'; import { salvarItem } from '../services/firestoreService'; import Button from '../components/Button';
export default function CadastroProdutoScreen({ navigation }) { const [nome, setNome] = useState(''); const [valor, setValor] = useState(''); const [quantidade, setQuantidade] = useState('1'); const [imagemUri, setImagemUri] = useState(null); const [loading, setLoading] = useState(false);
const tirarFotoProduto = async () => { const uri = await tirarFoto(); if (uri) { const processed = await processImage(uri); if (processed) setImagemUri(processed); else Alert.alert('Erro', 'Falha ao processar imagem'); } };
const salvar = async () => { if (!nome || !valor || !imagemUri) { Alert.alert('Erro', 'Preencha todos os campos e tire uma foto'); return; } const userId = auth.currentUser.uid; const produtoId = Date.now().toString(); const localUri = await salvarLocal(imagemUri, userId, produtoId); const item = { nome, valorUnitario: parseFloat(valor), quantidade: parseInt(quantidade), totalItem: parseFloat(valor) * parseInt(quantidade), imagemUri: localUri }; const result = await salvarItem(userId, item); if (result.success) { Alert.alert('Sucesso', 'Produto adicionado'); navigation.goBack(); } else Alert.alert('Erro', result.error); };
return (<View style={styles.container}><Text style={styles.title}>Novo Produto</Text><TextInput style={styles.input} placeholder="Nome do produto" value={nome} onChangeText={setNome} /><TextInput style={styles.input} placeholder="Valor unitário" value={valor} onChangeText={setValor} keyboardType="numeric" /><TextInput style={styles.input} placeholder="Quantidade" value={quantidade} onChangeText={setQuantidade} keyboardType="numeric" /><Button title="Tirar Foto" onPress={tirarFotoProduto} />{imagemUri && <Image source={{ uri: imagemUri }} style={styles.preview} />}<Button title="Salvar" onPress={salvar} disabled={loading} /></View>); }
const styles = StyleSheet.create({ container: { padding: 20 }, title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 }, input: { backgroundColor: '#f5f5f5', padding: 12, borderRadius: 8, marginVertical: 8 }, preview: { width: 150, height: 150, marginVertical: 10, alignSelf: 'center' } });`);

  writeFile(p, 'src/navigation/AppNavigator.js', `import { NavigationContainer } from '@react-navigation/native'; import { createStackNavigator } from '@react-navigation/stack'; import LoginScreen from '../screens/LoginScreen'; import ListaComprasScreen from '../screens/ListaComprasScreen'; import CadastroProdutoScreen from '../screens/CadastroProdutoScreen';
const Stack = createStackNavigator();
export default function AppNavigator() { return (<NavigationContainer><Stack.Navigator initialRouteName="Login"><Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} /><Stack.Screen name="ListaCompras" component={ListaComprasScreen} title="Lista de Compras" /><Stack.Screen name="CadastroProduto" component={CadastroProdutoScreen} title="Adicionar Produto" /></Stack.Navigator></NavigationContainer>); }`);

  writeFile(p, 'README.md', `# Projeto 2 - App Conferência de Compras\n\n1. cd projeto-compras\n2. npm install\n3. Configure firebaseConfig.js\n4. npx expo start`);
}

// Executar
if (fs.existsSync(rootDir)) {
  console.log(`⚠️ Pasta ${rootDir} já existe. Remova ou renomeie e execute novamente.`);
} else {
  fs.mkdirSync(rootDir, { recursive: true });
  console.log(`📁 Criando projetos em ${rootDir}\n`);
  criarProjetoAlunos();
  criarProjetoCompras();
  console.log(`\n🎉 Ambos os projetos criados com sucesso!`);
  console.log(`\n📌 Instruções:`);
  console.log(`   cd projetos-n2/projeto-alunos  (para o projeto 1)`);
  console.log(`   cd projetos-n2/projeto-compras (para o projeto 2)`);
  console.log(`   npm install, configurar Firebase e npx expo start\n`);
}