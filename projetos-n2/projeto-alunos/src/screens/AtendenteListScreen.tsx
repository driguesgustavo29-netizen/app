import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Button, Image, Alert, StyleSheet } from 'react-native';
import { collection, onSnapshot, doc, updateDoc } from 'firebase/firestore';
import { db, auth } from '../../firebaseConfig';

export default function AtendenteListScreen() {
  const [alunos, setAlunos] = useState<any[]>([]);
  const [userRole, setUserRole] = useState('');

  useEffect(() => {
    const checkRole = async () => {
      const { doc, getDoc } = await import('firebase/firestore');
      const userDoc = await getDoc(doc(db, 'users', auth.currentUser!.uid));
      const role = userDoc.data()?.role;
      if (role !== 'atendente') {
        Alert.alert('Acesso negado', 'Você não é atendente');
      }
      setUserRole(role);
    };
    checkRole();

    const unsubscribe = onSnapshot(collection(db, 'alunos'), (snap) => {
      const lista = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      setAlunos(lista);
    });
    return unsubscribe;
  }, []);

  const alterarStatus = async (id: string) => {
    await updateDoc(doc(db, 'alunos', id), { status: 'Entregue' });
  };

  if (userRole !== 'atendente') {
    return <Text style={{ textAlign: 'center', marginTop: 20 }}>Acesso restrito a atendentes.</Text>;
  }

  return (
    <FlatList
      data={alunos}
      keyExtractor={item => item.id}
      renderItem={({ item }) => (
        <View style={styles.card}>
          <Text style={styles.nome}>{item.nome}</Text>
          <Text>CPF: {item.cpf}</Text>
          <Text>Curso: {item.curso}</Text>
          <Text>Status: {item.status}</Text>
          <View style={{ flexDirection: 'row', gap: 8 }}>
            {item.rgUrl && <Image source={{ uri: item.rgUrl }} style={styles.thumbnail} />}
            {item.certUrl && <Image source={{ uri: item.certUrl }} style={styles.thumbnail} />}
          </View>
          {item.status !== 'Entregue' && (
            <Button title="Marcar Entregue" onPress={() => alterarStatus(item.id)} />
          )}
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  card: { padding: 12, borderBottomWidth: 1, marginBottom: 8 },
  nome: { fontWeight: 'bold', fontSize: 16 },
  thumbnail: { width: 80, height: 80, marginTop: 8, marginRight: 8 }
});