import { View, Text, TextInput, StyleSheet, Alert, Image, ScrollView } from 'react-native';
import { useState } from 'react';
import { auth } from '../../firebaseConfig';
import { tirarFoto, processImage } from '../services/imageService';
import { salvarItem } from '../services/firestoreService';
import Button from '../components/Button';

export default function CadastroProdutoScreen({ navigation }) {
  const [nome, setNome] = useState('');
  const [valor, setValor] = useState('');
  const [quantidade, setQuantidade] = useState('1');
  const [imagemUri, setImagemUri] = useState(null);
  const [loading, setLoading] = useState(false);

  const tirarFotoProduto = async () => {
    try {
      const uri = await tirarFoto();
      if (uri) {
        const processed = await processImage(uri);
        setImagemUri(processed);
      }
      // se uri for null, o usuário cancelou ou negou permissão
    } catch (error) {
      Alert.alert('Erro', 'Falha ao capturar a imagem: ' + error.message);
    }
  };

  const salvar = async () => {
    if (!nome.trim()) return Alert.alert('Erro', 'Informe o nome do produto.');

    // Aceita vírgula ou ponto como separador decimal
    const valorNum = parseFloat(valor.replace(',', '.'));
    if (isNaN(valorNum) || valorNum <= 0) {
      return Alert.alert('Erro', 'Informe um valor unitário válido (maior que zero).');
    }

    const qtdNum = parseInt(quantidade);
    if (isNaN(qtdNum) || qtdNum <= 0) {
      return Alert.alert('Erro', 'Informe uma quantidade válida (maior que zero).');
    }

    if (!imagemUri) return Alert.alert('Erro', 'Tire uma foto do produto.');

    setLoading(true);
    const userId = auth.currentUser.uid;
    const item = {
      nome: nome.trim(),
      valorUnitario: valorNum,
      quantidade: qtdNum,
      totalItem: valorNum * qtdNum,
      imagemUri,
    };
    const result = await salvarItem(userId, item);
    setLoading(false);

    if (result.success) {
      Alert.alert('Sucesso', 'Produto adicionado!');
      navigation.goBack();
    } else {
      Alert.alert('Erro', result.error);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Novo Produto</Text>
      <TextInput style={styles.input} placeholder="Nome do produto" value={nome} onChangeText={setNome} />
      <TextInput
        style={styles.input}
        placeholder="Valor unitário (ex: 4.50)"
        value={valor}
        onChangeText={setValor}
        keyboardType="decimal-pad"
      />
      <TextInput
        style={styles.input}
        placeholder="Quantidade"
        value={quantidade}
        onChangeText={setQuantidade}
        keyboardType="numeric"
      />
      <Button title="Tirar Foto" onPress={tirarFotoProduto} />
      {imagemUri && <Image source={{ uri: imagemUri }} style={styles.preview} />}
      <Button title="Salvar" onPress={salvar} disabled={loading} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  input: { backgroundColor: '#f5f5f5', padding: 12, borderRadius: 8, marginVertical: 8, fontSize: 16 },
  preview: { width: 150, height: 150, marginVertical: 10, alignSelf: 'center', borderRadius: 8 },
});
