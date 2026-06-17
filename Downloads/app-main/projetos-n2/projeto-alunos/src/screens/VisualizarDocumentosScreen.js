import { View, Text, Image, StyleSheet, ScrollView, Alert } from 'react-native';
import { useState } from 'react';
import { mascaraCPF, mascaraRG, mascaraTelefone } from '../utils/validators';
import { atualizarStatusAluno } from '../services/firestoreService';
import Button from '../components/Button';

export default function VisualizarDocumentosScreen({ route, navigation }) {
  const { aluno } = route.params;
  const [status, setStatus] = useState(aluno.status);

  const getSource = (uri) => (uri ? { uri } : null);

  const marcarEntregue = async () => {
    const result = await atualizarStatusAluno(aluno.id, 'Entregue');
    if (result.success) {
      setStatus('Entregue');
      Alert.alert('Sucesso', 'Status atualizado para Entregue.');
    } else {
      Alert.alert('Erro', result.error);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Documentos do Aluno</Text>

      <View style={styles.dados}>
        <Text style={styles.linha}><Text style={styles.label}>Nome: </Text>{aluno.nome}</Text>
        <Text style={styles.linha}><Text style={styles.label}>CPF: </Text>{aluno.cpf ? mascaraCPF(aluno.cpf) : '-'}</Text>
        <Text style={styles.linha}><Text style={styles.label}>RG: </Text>{aluno.rg ? mascaraRG(aluno.rg) : '-'}</Text>
        <Text style={styles.linha}><Text style={styles.label}>Nascimento: </Text>{aluno.dataNascimento || '-'}</Text>
        <Text style={styles.linha}><Text style={styles.label}>E-mail: </Text>{aluno.email}</Text>
        <Text style={styles.linha}><Text style={styles.label}>Telefone: </Text>{aluno.telefone ? mascaraTelefone(aluno.telefone) : '-'}</Text>
        <Text style={styles.linha}><Text style={styles.label}>Curso: </Text>{aluno.curso}</Text>
        <Text style={styles.linha}>
          <Text style={styles.label}>Status: </Text>
          <Text style={status === 'Entregue' ? styles.entregue : styles.pendente}>{status}</Text>
        </Text>
      </View>

      <Text style={styles.subtitle}>Documento Pessoal</Text>
      {aluno.caminhoDocumento
        ? <Image source={getSource(aluno.caminhoDocumento)} style={styles.image} />
        : <Text style={styles.semImg}>Não enviado</Text>}

      <Text style={styles.subtitle}>Certificado</Text>
      {aluno.caminhoCertificado
        ? <Image source={getSource(aluno.caminhoCertificado)} style={styles.image} />
        : <Text style={styles.semImg}>Não enviado</Text>}

      {status === 'Pendente' && (
        <Button title="Marcar como Entregue" onPress={marcarEntregue} style={styles.aprovar} />
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, alignItems: 'center' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 15 },
  dados: { width: '100%', backgroundColor: '#f9f9f9', padding: 15, borderRadius: 10, marginBottom: 10 },
  linha: { fontSize: 16, marginVertical: 2 },
  label: { fontWeight: 'bold' },
  subtitle: { fontSize: 20, fontWeight: 'bold', marginTop: 20 },
  image: { width: 300, height: 300, resizeMode: 'contain', marginVertical: 10, borderWidth: 1, borderColor: '#ccc', borderRadius: 8 },
  semImg: { color: '#888', marginVertical: 10 },
  pendente: { color: '#dc3545', fontWeight: 'bold' },
  entregue: { color: '#28a745', fontWeight: 'bold' },
  aprovar: { backgroundColor: '#28a745' },
});
