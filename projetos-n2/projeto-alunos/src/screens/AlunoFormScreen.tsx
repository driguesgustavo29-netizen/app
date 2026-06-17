import React, { useState, useEffect } from 'react';
import {
  View, TextInput, Button, Alert, ScrollView, Text, Image, StyleSheet, Platform
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '../../firebaseConfig';
import * as ImagePicker from 'expo-image-picker';
import { cursos } from '../utils/cursos';

export default function AlunoFormScreen() {
  // Estados do formulário
  const [nome, setNome] = useState('');
  const [cpf, setCpf] = useState('');
  const [dataNasc, setDataNasc] = useState('');
  const [email, setEmail] = useState('');
  const [telefone, setTelefone] = useState('');
  const [cursoSelecionado, setCursoSelecionado] = useState('');
  const [semestre, setSemestre] = useState('');
  const [turno, setTurno] = useState('');
  const [modalidade, setModalidade] = useState('');
  const [rgUri, setRgUri] = useState<string | null>(null);
  const [certUri, setCertUri] = useState<string | null>(null);
  const [status, setStatus] = useState('Pendente');
  const [loading, setLoading] = useState(false);

  // Efeito para carregar dados existentes
  useEffect(() => {
    loadExistingData();
  }, []);

  // Função para carregar dados do usuário se já existirem
  const loadExistingData = async () => {
    const userId = auth.currentUser?.uid;
    if (!userId) return;
    const docRef = doc(db, 'alunos', userId);
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      const data = snap.data();
      setNome(data.nome || '');
      setCpf(data.cpf || '');
      setDataNasc(data.dataNasc || '');
      setEmail(data.email || '');
      setTelefone(data.telefone || '');
      setCursoSelecionado(data.curso || '');
      setSemestre(data.semestre || '');
      setTurno(data.turno || '');
      setModalidade(data.modalidade || '');
      setStatus(data.status || 'Pendente');
    }
  };

  // Função para selecionar imagem (CORRIGIDA)
  const pickImage = async (tipo: 'rg' | 'cert') => {
  try {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      Alert.alert(
        'Permissão necessária',
        'Permita acesso à galeria para selecionar imagens.'
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      quality: 0.8,
      allowsEditing: false,
    });

    if (!result.canceled) {
      const uri = result.assets[0].uri;

      if (tipo === 'rg') {
        setRgUri(uri);
      } else {
        setCertUri(uri);
      }
    }
  } catch (error) {
    console.error('Erro ao selecionar:', error);
    Alert.alert('Erro', 'Falha ao selecionar imagem');
  }
};
  // Função de upload da imagem
 {
    try {
      const response = await fetch(uri);
      const blob = await response.blob();
      const fileName = `alunos/${userId}/${tipo}_${Date.now()}.jpg`;
      const storageRef = ref(storage, fileName);
      await uploadBytes(storageRef, blob);
      const downloadUrl = await getDownloadURL(storageRef);
      console.log(`Upload ${tipo} concluído:`, downloadUrl);
      return downloadUrl;
    } catch (error) {
      console.error(`Erro upload ${tipo}:`, error);
      throw new Error(`Falha ao enviar ${tipo}: ${error.message}`);
    }
  };

  // Função principal para salvar o cadastro
  const salvarAluno = async () => {
    // Validações
    if (!nome.trim()) return Alert.alert('Erro', 'Nome é obrigatório');
    const cpfNumeros = cpf.replace(/\D/g, '');
    if (cpfNumeros.length !== 11) return Alert.alert('Erro', 'CPF deve ter 11 dígitos');
    const dataNumeros = dataNasc.replace(/\D/g, '');
    if (dataNumeros.length !== 8) return Alert.alert('Erro', 'Data deve ser DD/MM/AAAA');
    if (!email.trim()) return Alert.alert('Erro', 'E-mail obrigatório');
    if (!cursoSelecionado) return Alert.alert('Erro', 'Selecione um curso');

    setLoading(true);
    const userId = auth.currentUser?.uid;
    if (!userId) return;

    try {
      let rgUrl = null, certUrl = null;
      if (rgUri) rgUrl = await uploadImage(userId, 'rg', rgUri);
      if (certUri) certUrl = await uploadImage(userId, 'certificado', certUri);

      await setDoc(doc(db, 'alunos', userId), {
        nome, cpf: cpfNumeros, dataNasc, email, telefone,
        curso: cursoSelecionado, semestre, turno, modalidade,
        status, rgUrl, certUrl,
        updatedAt: new Date()
      }, { merge: true });

      Alert.alert('Sucesso', 'Cadastro salvo com sucesso!');
    } catch (error: any) {
      Alert.alert('Erro', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={{ padding: 20 }}>
      <TextInput placeholder="Nome completo" value={nome} onChangeText={setNome} style={styles.input} />

      {/* Input com Máscara de CPF */}
      <TextInput
  placeholder="CPF"
  value={cpf}
  keyboardType="numeric"
  maxLength={11}
  onChangeText={(text) => {
    const numeros = text.replace(/\D/g, '');
    setCpf(numeros.slice(0, 11));
  }}
  style={styles.input}
/>

      {/* Input com Máscara de Data */}
     <TextInput
  placeholder="DD/MM/AAAA"
  value={dataNasc}
  keyboardType="numeric"
  maxLength={10}
  onChangeText={(text) => {
    let valor = text.replace(/\D/g, '');

    if (valor.length > 2) {
      valor = valor.replace(/^(\d{2})(\d)/, '$1/$2');
    }

    if (valor.length > 5) {
      valor = valor.replace(/^(\d{2})\/(\d{2})(\d)/, '$1/$2/$3');
    }

    setDataNasc(valor.slice(0, 10));
  }}
  style={styles.input}
/>

      <TextInput placeholder="E-mail" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" style={styles.input} />
      <TextInput placeholder="Telefone" value={telefone} onChangeText={setTelefone} keyboardType="phone-pad" style={styles.input} />

      {/* Picker para os Cursos */}
      <View style={styles.pickerContainer}>
        <Picker selectedValue={cursoSelecionado} onValueChange={setCursoSelecionado}>
          <Picker.Item label="Selecione um curso" value="" />
          {cursos.map(curso => <Picker.Item key={curso} label={curso} value={curso} />)}
        </Picker>
      </View>

      <TextInput placeholder="Semestre (ex: 1º semestre)" value={semestre} onChangeText={setSemestre} style={styles.input} />

      <View style={styles.pickerContainer}>
        <Picker selectedValue={turno} onValueChange={setTurno}>
          <Picker.Item label="Turno" value="" />
          <Picker.Item label="Matutino" value="matutino" />
          <Picker.Item label="Vespertino" value="vespertino" />
          <Picker.Item label="Noturno" value="noturno" />
          <Picker.Item label="Integral" value="integral" />
        </Picker>
      </View>

      <View style={styles.pickerContainer}>
        <Picker selectedValue={modalidade} onValueChange={setModalidade}>
          <Picker.Item label="Modalidade" value="" />
          <Picker.Item label="Presencial" value="presencial" />
          <Picker.Item label="EAD" value="ead" />
          <Picker.Item label="Híbrido" value="hibrido" />
        </Picker>
      </View>

      <Text>Status: {status}</Text>

      <Button title="Selecionar RG/CPF" onPress={() => pickImage('rg')} disabled={loading} />
      {rgUri && <Image source={{ uri: rgUri }} style={{ width: 100, height: 100, marginVertical: 8 }} />}
      <Button title="Selecionar Certificado" onPress={() => pickImage('cert')} disabled={loading} />
      {certUri && <Image source={{ uri: certUri }} style={{ width: 100, height: 100, marginVertical: 8 }} />}

      <Button title="Salvar Cadastro" onPress={salvarAluno} disabled={loading} />
      {loading && <Text style={{ textAlign: 'center', marginTop: 10 }}>Processando...</Text>}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  input: { borderWidth: 1, marginBottom: 12, padding: 8, borderRadius: 5, backgroundColor: '#fff' },
  pickerContainer: { borderWidth: 1, marginBottom: 12, borderRadius: 5, overflow: 'hidden', backgroundColor: '#fff' }
});