import { View, Text, StyleSheet, ScrollView, Alert, Image, TouchableOpacity } from 'react-native';
import { useState } from 'react';
import { Picker } from '@react-native-picker/picker';
import Input from '../components/Input';
import Button from '../components/Button';
import Header from '../components/Header';
import { getAndProcessImage } from '../services/imageService';
import { salvarAluno } from '../services/firestoreService';
import { auth } from '../../firebaseConfig';
import { cursos } from '../utils/cursos';
import { colors, shadow, radius } from '../theme';
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
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível carregar a imagem: ' + error.message);
    }
  };

  const handleSalvar = async () => {
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
      cpf: cpf.replace(/\D/g, ''),
      rg: rg.replace(/[^\dxX]/g, ''),
      dataNascimento: dataNasc,
      email: email.trim().toLowerCase(),
      telefone: telefone.replace(/\D/g, ''),
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

  const UploadBox = ({ titulo, uri, tipo }) => (
    <View style={styles.uploadBox}>
      <Text style={styles.uploadTitle}>{titulo}</Text>
      {uri ? (
        <Image source={{ uri }} style={styles.preview} />
      ) : (
        <View style={styles.previewEmpty}>
          <Text style={styles.previewEmptyText}>Nenhuma imagem</Text>
        </View>
      )}
      <View style={styles.uploadButtons}>
        <TouchableOpacity style={styles.miniBtn} onPress={() => handleUpload(tipo, false)}>
          <Text style={styles.miniBtnText}>🖼️ Galeria</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.miniBtn} onPress={() => handleUpload(tipo, true)}>
          <Text style={styles.miniBtnText}>📷 Câmera</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <ScrollView style={styles.flex} contentContainerStyle={styles.container}>
      <Header variant="bar" subtitle="Cadastro de aluno" />

      <View style={styles.body}>
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Dados pessoais</Text>
          <Input label="Nome completo" placeholder="Nome do aluno" value={nome} onChangeText={setNome} />
          <Input label="CPF" placeholder="000.000.000-00" value={cpf} onChangeText={(t) => setCpf(mascaraCPF(t))} keyboardType="numeric" maxLength={14} />
          <Input label="RG" placeholder="00.000.000-0" value={rg} onChangeText={(t) => setRg(mascaraRG(t))} maxLength={12} />
          <Input label="Data de nascimento" placeholder="DD/MM/AAAA" value={dataNasc} onChangeText={(t) => setDataNasc(mascaraData(t))} keyboardType="numeric" maxLength={10} />
          <Input label="E-mail" placeholder="aluno@email.com" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />
          <Input label="Telefone" placeholder="(00) 00000-0000" value={telefone} onChangeText={(t) => setTelefone(mascaraTelefone(t))} keyboardType="phone-pad" maxLength={15} />

          <Text style={styles.inputLabel}>Curso</Text>
          <View style={styles.pickerContainer}>
            <Picker selectedValue={curso} onValueChange={setCurso}>
              <Picker.Item label="Selecione um curso" value="" color={colors.textMuted} />
              {cursos.map((c) => <Picker.Item key={c} label={c} value={c} />)}
            </Picker>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Documentos</Text>
          <UploadBox titulo="Documento pessoal (RG/CPF)" uri={docUri} tipo="documento" />
          <UploadBox titulo="Certificado" uri={certUri} tipo="certificado" />
        </View>

        <Button title={loading ? 'Salvando...' : 'Finalizar cadastro'} onPress={handleSalvar} disabled={loading} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.bg },
  container: { paddingBottom: 30 },
  body: { padding: 16 },
  card: { backgroundColor: colors.surface, borderRadius: radius.lg, padding: 18, marginBottom: 16, ...shadow.card },
  sectionTitle: { fontSize: 17, fontWeight: '700', color: colors.accent, marginBottom: 10 },
  inputLabel: { fontSize: 13, color: colors.textMuted, marginTop: 6, marginBottom: 4, fontWeight: '600' },
  pickerContainer: { backgroundColor: colors.surfaceLight, borderRadius: radius.md, borderWidth: 1.5, borderColor: 'transparent', overflow: 'hidden' },
  uploadBox: { marginBottom: 18 },
  uploadTitle: { fontSize: 14, fontWeight: '600', color: colors.text, marginBottom: 8 },
  preview: { width: '100%', height: 170, borderRadius: radius.md, resizeMode: 'cover' },
  previewEmpty: { width: '100%', height: 100, borderRadius: radius.md, backgroundColor: colors.surfaceLight, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: colors.border, borderStyle: 'dashed' },
  previewEmptyText: { color: colors.textMuted },
  uploadButtons: { flexDirection: 'row', gap: 10, marginTop: 8 },
  miniBtn: { flex: 1, backgroundColor: colors.primary, paddingVertical: 10, borderRadius: radius.sm, alignItems: 'center' },
  miniBtnText: { color: colors.onPrimary, fontWeight: '600', fontSize: 14 },
});
