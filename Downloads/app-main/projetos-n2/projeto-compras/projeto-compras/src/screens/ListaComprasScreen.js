import { View, Text, FlatList, TouchableOpacity, TextInput, StyleSheet, Alert, Image } from 'react-native';
import { useState, useEffect } from 'react';
import { auth } from '../../firebaseConfig';
import { escutarItens, atualizarItem, deletarItem } from '../services/firestoreService';
import { logoutUser } from '../services/authService';
import Button from '../components/Button';

export default function ListaComprasScreen({ navigation }) {
  const [itens, setItens] = useState([]);
  const [totalGeral, setTotalGeral] = useState(0);

  // Escuta os itens em tempo real (atualiza sozinho ao adicionar/remover/editar)
  useEffect(() => {
    const userId = auth.currentUser?.uid;
    if (!userId) return;
    const unsubscribe = escutarItens(userId, setItens);
    return unsubscribe;
  }, []);

  // Recalcula o total geral sempre que a lista muda
  useEffect(() => {
    const total = itens.reduce((acc, item) => acc + item.valorUnitario * item.quantidade, 0);
    setTotalGeral(total);
  }, [itens]);

  const alterarQuantidade = async (id, novaQuantidade) => {
    if (novaQuantidade < 0) return;
    const item = itens.find((i) => i.id === id);
    if (item) {
      await atualizarItem(id, {
        quantidade: novaQuantidade,
        totalItem: item.valorUnitario * novaQuantidade,
      });
    }
  };

  const excluirItem = (id) => {
    Alert.alert('Confirmar', 'Excluir item?', [
      { text: 'Não', style: 'cancel' },
      { text: 'Sim', onPress: () => deletarItem(id) },
    ]);
  };

  const handleLogout = async () => {
    await logoutUser();
    navigation.replace('Login');
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Image source={{ uri: item.imagemUri }} style={styles.imagem} />
      <View style={styles.info}>
        <Text style={styles.nome}>{item.nome}</Text>
        <Text>Valor unit: R$ {item.valorUnitario.toFixed(2)}</Text>
        <View style={styles.qtd}>
          <Text>Qtd: </Text>
          <TextInput
            style={styles.inputQtd}
            value={String(item.quantidade)}
            keyboardType="numeric"
            onChangeText={(text) => {
              const q = parseInt(text) || 0;
              alterarQuantidade(item.id, q);
            }}
          />
        </View>
        <Text>Total item: R$ {(item.valorUnitario * item.quantidade).toFixed(2)}</Text>
        <TouchableOpacity onPress={() => excluirItem(item.id)}>
          <Text style={styles.excluir}>Excluir</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Button title="+ Adicionar Produto" onPress={() => navigation.navigate('CadastroProduto')} />
      <FlatList
        data={itens}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        ListEmptyComponent={<Text style={styles.vazio}>Nenhum item na lista. Adicione um produto.</Text>}
      />
      <Text style={styles.total}>Total Geral: R$ {totalGeral.toFixed(2)}</Text>
      <Button title="Sair" onPress={handleLogout} style={styles.logout} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10 },
  card: { flexDirection: 'row', backgroundColor: '#fff', margin: 8, padding: 10, borderRadius: 10, borderWidth: 1, borderColor: '#eee' },
  imagem: { width: 80, height: 80, borderRadius: 8 },
  info: { flex: 1, marginLeft: 10 },
  nome: { fontSize: 16, fontWeight: 'bold' },
  qtd: { flexDirection: 'row', alignItems: 'center', marginVertical: 5 },
  inputQtd: { borderWidth: 1, borderColor: '#ccc', width: 50, textAlign: 'center', borderRadius: 4, padding: 2 },
  excluir: { color: 'red', marginTop: 5 },
  vazio: { textAlign: 'center', marginTop: 40, color: '#888' },
  total: { fontSize: 20, fontWeight: 'bold', textAlign: 'center', margin: 15 },
  logout: { backgroundColor: '#6c757d' },
});
