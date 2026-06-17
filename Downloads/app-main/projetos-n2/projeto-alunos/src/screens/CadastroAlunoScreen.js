import { View, Text, TextInput, StyleSheet, ScrollView, Alert, Image } from 'react-native';
import { useState } from 'react';
import { Picker } from '@react-native-picker/picker';
import Button from '../components/Button';
import { getAndProcessImage } from '../services/imageService';
import { salvarAluno } from '../services/firestoreService';
import { auth } from '../../firebaseConfig';
import { cursos } from '../utils/cursos';
import {
  mascaraCPF, mascaraRG, mascaraData, mascaraTelefone,
  validarCPF, validarRG, validarData, validarEmail, validarTelefone
} from '../utils/validators';

export default function CadastroAlunoScreen({ navigation }) {
  const [nome, setNome] = useState('');
  const [cpf, setCpf] = useState('');
  const [rg, setRg] = useState('');
  const [dataNasc, setDataNasc] = useState('');
  const [email, setEmail] = useState('');
  const [telefone, setTelefone] = useState('');
  const [curso, setCurso] = useState('');
  const [docUri, setDocUri] = useState(null);
  const [certUri, setCertUri] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleUpload = async (tipo, useCamera) => {
    const userId = auth.currentUser?.uid;
    if (!userId) {
      Alert.alert('Erro', 'Sessão expirada. Faça login novamente.');
      return;
    }
    try {
      const localUri = await getAndProcessImage(userId, tipo, useCamera);
      if (localUri) {
        if (tipo === 'documento') setDocUri(localUri);
        else setCertUri(localUri);
      }
      // se localUri for null, o usuário apenas cancelou; não mostra erro
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível carregar a imagem: ' + error.message);
    }
  };

  const handleSalvar = async () => {
    // Validações campo a campo
    if (!nome.trim()) return Alert.alert('Erro', 'Informe o nome completo.');
    if (!validarCPF(cpf)) return Alert.alert('Erro', 'CPF inválido. Verifique os 11 dígitos.');
    if (!validarRG(rg)) return Alert.alert('Erro', 'RG inválido.');
    if (!validarData(dataNasc)) return Alert.alert('Erro', 'Data de nascimento inválida (DD/MM/AAAA).');
    if (!validarEmail(email)) return Alert.alert('Erro', 'E-mail inválido.');
    if (!validarTelefone(telefone)) return Alert.alert('Erro', 'Telefone inválido (DDD + número).');
    if (!curso) return Alert.alert('Erro', 'Selecione um curso.');
    if (!docUri || !certUri) return Alert.alert('Erro', 'Envie o documento pessoal e o certificado.');

    setLoading(true);
    const alunoData = {
      nome: nome.trim(),
      cpf: cpf.replace(/\D/g, ''),          // salva só números
      rg: rg.replace(/[^\dxX]/g, ''),
      dataNascimento: dataNasc,
      email: email.trim().toLowerCase(),
      telefone: telefone.replace(/\D/g, ''), // salva só números
      curso,
      status: 'Pendente',
      caminhoDocumento: docUri,
      caminhoCertificado: certUri,
      criadoEm: new Date(),
      userId: auth.currentUser?.uid,
    };
    const result = await salvarAluno(alunoData);
    if (result.success) {
      Alert.alert('Sucesso', 'Cadastro realizado!');
      navigation.replace('Login');
    } else {
      Alert.alert('Erro', result.error);
    }
    setLoading(false);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Cadastro de Aluno</Text>

      <TextInput style={styles.input} placeholder="Nome completo" value={nome} onChangeText={setNome} />

      <TextInput
        style={styles.input}
        placeholder="CPF"
        value={cpf}
        onChangeText={(t) => setCpf(mascaraCPF(t))}
        keyboardType="numeric"
        maxLength={14}
      />

      <TextInput
        style={styles.input}
        placeholder="RG"
        value={rg}
        onChangeText={(t) => setRg(mascaraRG(t))}
        keyboardType="default"
        maxLength={12}
      />

      <TextInput
        style={styles.input}
        placeholder="Data de nascimento (DD/MM/AAAA)"
        value={dataNasc}
        onChangeText={(t) => setDataNasc(mascaraData(t))}
        keyboardType="numeric"
        maxLength={10}
      />

      <TextInput
        style={styles.input}
        placeholder="E-mail"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <TextInput
        style={styles.input}
        placeholder="Telefone"
        value={telefone}
        onChangeText={(t) => setTelefone(mascaraTelefone(t))}
        keyboardType="phone-pad"
        maxLength={15}
      />

      <View style={styles.pickerContainer}>
        <Picker selectedValue={curso} onValueChange={setCurso}>
          <Picker.Item label="Selecione um curso" value="" />
          {cursos.map((c) => <Picker.Item key={c} label={c} value={c} />)}
        </Picker>
      </View>

      <Text style={styles.subtitle}>Documento pessoal (RG ou CPF)</Text>
      <View style={styles.buttonRow}>
        <Button title="Galeria" onPress={() => handleUpload('documento', false)} style={styles.smallButton} />
        <Button title="Câmera" onPress={() => handleUpload('documento', true)} style={styles.smallButton} />
      </View>
      {docUri && <Image source={{ uri: docUri }} style={styles.preview} />}

      <Text style={styles.subtitle}>Certificado</Text>
      <View style={styles.buttonRow}>
        <Button title="Galeria" onPress={() => handleUpload('certificado', false)} style={styles.smallButton} />
        <Button title="Câmera" onPress={() => handleUpload('certificado', true)} style={styles.smallButton} />
      </View>
      {certUri && <Image source={{ uri: certUri }} style={styles.preview} />}

      <Button title="Salvar Cadastro" onPress={handleSalvar} disabled={loading} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, alignItems: 'center' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  subtitle: { fontSize: 18, fontWeight: 'bold', marginTop: 15, alignSelf: 'flex-start' },
  input: { width: '100%', backgroundColor: '#f5f5f5', padding: 12, borderRadius: 8, marginVertical: 8, fontSize: 16 },
  pickerContainer: { width: '100%', backgroundColor: '#f5f5f5', borderRadius: 8, marginVertical: 8, overflow: 'hidden' },
  buttonRow: { flexDirection: 'row', gap: 10, width: '100%' },
  smallButton: { flex: 1 },
  preview: { width: 150, height: 150, marginTop: 10, borderRadius: 8, resizeMode: 'cover' },
});
