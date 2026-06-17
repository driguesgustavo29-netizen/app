import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useEffect, useState } from 'react';
import { listarAlunos, atualizarStatusAluno } from '../services/firestoreService';
import { logoutUser } from '../services/authService';
import { mascaraCPF } from '../utils/validators';
import Button from '../components/Button';

export default function AtendenteScreen({ navigation }) {
  const [alunos, setAlunos] = useState([]);

  useEffect(() => {
    const unsubscribe = listarAlunos(setAlunos);
    return unsubscribe;
  }, []);

  const handleStatus = async (id, status) => {
    if (status === 'Pendente') {
      const result = await atualizarStatusAluno(id, 'Entregue');
      if (!result.success) Alert.alert('Erro', result.error);
    } else {
      Alert.alert('Aviso', 'Documentos já entregues.');
    }
  };

  const handleLogout = async () => {
    await logoutUser();
    navigation.replace('Login');
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('VisualizarDocumentos', { aluno: item })}
    >
      <Text style={styles.nome}>{item.nome}</Text>
      <Text>CPF: {item.cpf ? mascaraCPF(item.cpf) : '-'}</Text>
      <Text>Curso: {item.curso}</Text>
      <Text>
        Status: <Text style={item.status === 'Entregue' ? styles.entregue : styles.pendente}>{item.status}</Text>
      </Text>
      {item.status === 'Pendente' && (
        <TouchableOpacity style={styles.buttonAprovar} onPress={() => handleStatus(item.id, item.status)}>
          <Text style={styles.buttonText}>Marcar Entregue</Text>
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Painel do Atendente</Text>
      <FlatList
        data={alunos}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        ListEmptyComponent={<Text style={styles.vazio}>Nenhum aluno cadastrado ainda.</Text>}
      />
      <Button title="Sair" onPress={handleLogout} style={styles.logout} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  card: { backgroundColor: '#f9f9f9', padding: 15, borderRadius: 10, marginVertical: 8 },
  nome: { fontSize: 18, fontWeight: 'bold' },
  pendente: { color: '#dc3545', fontWeight: 'bold' },
  entregue: { color: '#28a745', fontWeight: 'bold' },
  buttonAprovar: { backgroundColor: '#28a745', padding: 10, borderRadius: 5, marginTop: 10, alignItems: 'center' },
  buttonText: { color: '#fff', fontWeight: 'bold' },
  vazio: { textAlign: 'center', marginTop: 40, color: '#888' },
  logout: { backgroundColor: '#6c757d' },
});
