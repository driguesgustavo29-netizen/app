import { View, Text, StyleSheet, Alert } from 'react-native';
import { useState } from 'react';
import Input from '../components/Input';
import Button from '../components/Button';
import { registerUser } from '../services/authService';
import { salvarPerfilUsuario } from '../services/firestoreService';
import { validarEmail } from '../utils/validators';

export default function RegisterScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [perfil, setPerfil] = useState('aluno');
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!email || !password || !confirm) {
      Alert.alert('Erro', 'Preencha todos os campos');
      return;
    }
    if (!validarEmail(email)) {
      Alert.alert('Erro', 'E-mail inválido');
      return;
    }
    if (password.length < 6) {
      Alert.alert('Erro', 'A senha deve ter pelo menos 6 caracteres');
      return;
    }
    if (password !== confirm) {
      Alert.alert('Erro', 'Senhas não coincidem');
      return;
    }
    setLoading(true);
    const result = await registerUser(email.trim().toLowerCase(), password);
    if (result.success) {
      await salvarPerfilUsuario(result.user.uid, perfil);
      Alert.alert('Sucesso', 'Cadastro realizado! Faça login.');
      navigation.navigate('Login');
    } else {
      Alert.alert('Erro', result.error);
    }
    setLoading(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Cadastro</Text>
      <Input placeholder="E-mail" value={email} onChangeText={setEmail} keyboardType="email-address" />
      <Input placeholder="Senha (mín. 6 caracteres)" value={password} onChangeText={setPassword} secureTextEntry />
      <Input placeholder="Confirmar senha" value={confirm} onChangeText={setConfirm} secureTextEntry />
      <View style={styles.perfilContainer}>
        <Text style={styles.perfilLabel}>Perfil:</Text>
        <View style={styles.perfilOptions}>
          <Button title="Aluno" onPress={() => setPerfil('aluno')} style={perfil === 'aluno' ? styles.selected : styles.unselected} />
          <Button title="Atendente" onPress={() => setPerfil('atendente')} style={perfil === 'atendente' ? styles.selected : styles.unselected} />
        </View>
      </View>
      <Button title="Cadastrar" onPress={handleRegister} disabled={loading} />
      <Button title="Voltar" onPress={() => navigation.goBack()} style={styles.secondary} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20 },
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  perfilContainer: { marginVertical: 10 },
  perfilLabel: { fontSize: 16, marginBottom: 5 },
  perfilOptions: { flexDirection: 'row', justifyContent: 'space-around', gap: 10 },
  selected: { backgroundColor: '#007bff', flex: 1 },
  unselected: { backgroundColor: '#6c757d', flex: 1 },
  secondary: { backgroundColor: '#6c757d' },
});
